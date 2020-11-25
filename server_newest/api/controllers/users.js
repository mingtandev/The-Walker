const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const User = require('./../models/user')
const History = require('./../models/history')

const {sendMail} =  require('./../config/nodemailer')
const {loadHistory, saveHistory} = require('./../utils/history')
const {saveStatistic} = require('./../utils/statistic')
const {saveUserItem} = require('./../utils/userItem')

const tokenLife = process.env.TOKEN_LIFE
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE
const jwtKey = process.env.JWT_KEY

exports.getAll = (req, res, next) => {
    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: 'ValidatorError',
            errors: {
                user: `You don't have the permission!`
            }
        })
    }

    const page = parseInt(req.query.page) || 1
    const items_per_page = parseInt(req.query.limit) || 100

    if (page < 1) page = 1

    User.find({})
    .select('name slugName email cash roles isVerified')
    .skip((page - 1) * items_per_page)
    .limit(items_per_page)
    .then(async users => {
        const request = {}
        const len = await User.find({}).countDocuments()

        request.currentPage = page
        request.totalPages = Math.ceil(len / items_per_page)

        if (page > 1) {
            request.previous = {
                page: page - 1,
                limit: items_per_page
            }
        }

        if (page * items_per_page < len) {
            request.next = {
                page: page + 1,
                limit: items_per_page
            }
        }

        const response = {
            msg: 'success',
            length: users.length,
            users: users.map(user => {
                return {
                    _id: user._id,
                    name: user.name,
                    slugName: user.slugName,
                    email: user.email,
                    cash: user.cash,
                    roles: user.roles,
                    isVerified: user.isVerified,
                    request: {
                        type: 'GET',
                        url: req.hostname + '/users/' + user._id
                    }
                }
            }),
            request
        }

        res.status(200).json(response)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.getOne = (req, res, next) => {
    const _id = req.params.userId

    let selectStr = ''

    if(_id === req.userData._id) selectStr = 'name email roles cash isVerified'
    else selectStr = 'name email roles'

    User.findById(_id)
    .select(selectStr)
    .then(user => {
        if(!user){
            return res.status(202).json({
                msg: 'ValidatorError',
                errors: {
                    user: `User not found!`
                }
            })
        }

        res.status(200).json({
            msg: 'success',
            user
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.create = (req, res, next) => {
    const {name, email, password} = req.body

    bcrypt.hash(password, 10, (error, encryptedPassword) => {
        if(error){
            console.log(error)
            return res.status(500).json({
                msg: 'Server error!',
                error
            })

        }else{
            const passwordResetToken = crypto.randomBytes(16).toString('hex')
            const user = new User({
                name,
                email,
                password: encryptedPassword,
                passwordResetToken
            })

            user.save()
            .then(async newUser => {
                const token = jwt.sign( {_id: newUser._id}, jwtKey, {
                    expiresIn: tokenLife
                })

                await Promise.all([
                    sendMail(req, newUser.email, token, 'confirmation'),
                    saveStatistic(1, 0, 0, 0, 0, 0),
                    saveUserItem(newUser._id, [], 0)
                ])

                res.status(201).json({
                    msg: "success",
                    user: newUser
                })
            })
            .catch(error => {
                console.log(error)
                let respond = {}
                error.errors && Object.keys(error.errors).forEach(err => respond[err] = error.errors[err].message)
                res.status(202).json({
                    msg: 'ValidatorError',
                    errors: respond
                })
            })
        }
    })
}

exports.update = (req, res, next) => {
    const {userId: _id} = req.params
    const {roles} = req.userData

    if(roles != 'admin' && _id != req.userData._id){
        return res.status(403).json({
            msg: 'ValidatorError',
            errors: {
                user: `You don't have the permission!`
            }
        })
    }

    let hasPassword = false

    let newUser = {}

    for (const ops of req.body) {
        newUser[ops.propName] = ops.value

        if(ops.propName === 'password'){
            hasPassword = true
        }
    }

    if (roles === 'user') {
        for (const key of Object.keys(newUser)) {
            if (!['name', 'password'].includes(key)) {
                return res.status(202).json({
                    msg: 'ValidatorError',
                    errors: {
                        user: `You are only allowed to change the name and password!`
                    }
                })
            }
        }
    }

    try {
        User.findById(_id)
        .then(async user => {
            if(!user){
                return res.status(202).json({
                    msg: 'ValidatorError',
                    errors: {
                        user: `User not found!`
                    }
                })
            }

            if(hasPassword){
                bcrypt.hash(newUser.password, 10, (error, encryptedPassword) => {
                    if(error){
                        console.log(error)
                        return res.status(500).json({
                            msg: 'Server error!',
                            error
                        })
                    }

                    newUser.password = encryptedPassword
                })
            }

            const  [, newUser] = await Promise.all([
                saveHistory(_id, 'accInfos', 'personal', `Update an account: ${_id}-${Object.keys(newUser).join('-')} | ${new Date()}`),
                User.updateOne({_id}, {$set: newUser}, { runValidators: true })
            ])

            res.status(200).json({
                msg: 'success',
                user: newUser,
                request: {
                    type: 'GET',
                    url: req.hostname + '/users/' + _id
                }
            })
        })
        .catch(error => {
            res.status(500).json({
                msg: 'Server error!',
                error
            })
        })
    }
    catch (error) {
        console.log(error)
        let respond = {}
        error.errors && Object.keys(error.errors).forEach(err => respond[err] = error.errors[err].message)
        res.status(202).json({
            msg: 'ValidatorError',
            errors: respond
        })
    }
}

exports.delete =  (req, res, next) => {
    const {roles} = req.userData
    const {userId: _id} = req.params

    if(roles != 'admin'){
        return res.status(403).json({
            msg: 'ValidatorError',
            errors: {
                user: `You don't have the permission!`
            }
        })
    }

    try {
        User.findById(_id)
        .then(async user => {
            if(!user){
                return res.status(202).json({
                    msg: 'ValidatorError',
                    errors: {
                        user: `User not found!`
                    }
                })
            }

            await Promise.all([
                User.deleteOne({_id}),
                saveHistory(req.userData._id, 'accInfos', 'manage', `Delete an account: ${_id}-${user.name}-${user.email} | ${new Date()}`)
            ])

            res.status(200).json({
                msg: 'success',
                request: {
                    type: 'POST',
                    url: req.hostname + '/users',
                    body: {
                        name: 'String',
                        email: 'String',
                        password: 'String'
                    }
                }
            })
        })
        .catch(error => {
            res.status(500).json({
                msg: 'Server error!',
                error
            })
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    }
}

// --------------------------------------------------------------------

exports.confirmation = (req, res, next) => {
    const {verifyToken: token} = req.params

    try {
        const decoded = jwt.verify(token, jwtKey)
        const {_id} = decoded

        User.findOne({_id})
        .then(async user => {
            if(!user) {
                return res.status(202).json({
                    msg: 'ValidatorError',
                    errors: {
                        user: 'User not found!'
                    }
                })
            }

            if(user.isVerified){
                return res.status(200).json({
                    msg: 'success'
                })
            }

            user.isVerified = true

            await Promise.all([
                User.updateOne({_id}, {$set: user}),
                saveHistory(_id, 'accInfos', 'manage', `Confirm this account | ${new Date()}`)

            ])

            res.status(200).json({
                msg: 'success'
            })
        })
        .catch(error => {
            res.status(500).json({
                msg: 'Server error!',
                error
            })
        })
    }
    catch (error) {
        console.log(error)
        res.status(202).json({
            msg: 'ValidatorError',
            errors: {
                user: 'Token is invalid or has been expired. Please click resend confirmation email!'
            }
        })
    }
}

exports.resend = (req, res, next) => {
    const {email} = req.body

    User.findOne({email})
    .then(async user => {
        if(!user) {
            return res.status(202).json({
                msg: 'ValidatorError',
                errors: {
                    user: 'User not found!'
                }
            })
        }

        if(user.isVerified) {
            return res.status(200).json({
                msg: 'Your account has been verified!'
            })
        }

        const token = jwt.sign( {_id: user._id}, jwtKey, {
            expiresIn: tokenLife
        })

        sendMail(req, user.email, token, 'confirmation')

        await saveHistory(user._id, 'accInfos', 'manage', `Resend confirm email: ${user._id}-${user.name}-${user.email} | ${new Date()}`)

        res.status(201).json({
            msg: "success"
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.login = (req, res, next) => {
    const {email, password} = req.body

    User.findOne({email})
    .then(user => {
        if(!user){
            return res.status(202).json({
                msg: 'ValidatorError',
                errors: {
                    user: 'User not found!'
                }
            })
        }

        bcrypt.compare(password, user.password, (error, matched) => {
            if(error){
                console.log(error)
                return res.status(500).json({
                    msg: 'Server error!',
                    error
                })

            }

            if(matched){
                const { email, _id, isVerified, name, cash, slugName, roles } = user
                const payloadToken = { _id, roles, name, cash, slugName, email }

                const token = jwt.sign( payloadToken, jwtKey, {
                    expiresIn: tokenLife
                })
                const refreshToken = jwt.sign(payloadToken, jwtKey, {
                    expiresIn: refreshTokenLife
                })

                if(!isVerified) {
                    return res.status(202).json({
                        msg: 'ValidatorError',
                        errors: {
                            user: 'Your account has not been verified!'
                        }
                    })
                }

                res.status(200).json({
                    msg: 'success',
                    token,
                    refreshToken
                })

            }else{
                return res.status(202).json({
                    msg: 'ValidatorError',
                    errors: {
                        user: 'Email or password does not match!'
                    }
                })
            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.refresh = (req, res, next) => {
    const { refreshToken } = req.body

    try {
        const decoded = jwt.verify(refreshToken, jwtKey)
        const { _id, roles, name, cash, slugName, email} = decoded
        const user = {_id, roles, name, cash, slugName, email}

        const token = jwt.sign(user, jwtKey, {
            expiresIn: tokenLife,
        })

        res.status(200).json({
            msg: 'success',
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json({
            msg: 'ValidatorError',
            errors: {
                user: 'Token has been expired. Please login!'
            }
        })
    }
}

exports.recovery = (req, res, next) => {
    const {email} = req.body

    User.findOne({email})
    .then(user => {
        if(!user) {
            return res.status(202).json({
                msg: 'ValidatorError',
                errors: {
                    user: 'Email not found!'
                }
            })
        }

        bcrypt.hash(email, 10)
        .then(async hashed => {
            user.passwordResetToken = hashed
            user.passwordResetExpires = Date.now() + 5*60*1000 // 5h

            const [, , newUser] = await Promise.all([
                sendMail(req, email, hashed, 'recovery'),
                saveHistory(user._id, 'accInfos', 'manage', `Send password reset token: ${user._id}-${user.email} | ${new Date()}`),
                User.updateOne({_id: user._id}, {$set: user})
            ])

            res.status(200).json({
                msg: 'success',
                user: newUser
            })
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.forgot = (req, res, next)  => {
    const {newPassword, passwordResetToken} = req.body

    User.findOne({
        passwordResetToken,
        passwordResetExpires: {
            $gt: Date.now()
        }
    })
    .then(user => {
        if(!user){
            return res.status(202).json({
                msg: 'ValidatorError',
                errors: {
                    user: 'User not found or reset password token has been expired!'
                }
            })
        }

        bcrypt.hash(newPassword, 10)
        .then(async hashed => {
            user.password = hashed
            user.passwordResetToken = 'randomStringHere'
            user.passwordResetExpires = Date.now()

            const [, newUser] = await Promise.all([
                saveHistory(user._id, 'accInfos', 'personal', `Recovery password: ${user._id}-${user.name}-${user.email} | ${new Date()}`),
                User.updateOne({_id: user._id}, {$set: user})
            ])

            res.status(200).json({
                msg: 'success',
                user: newUser
            })
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.history = async (req, res, next)  => {
    const {_id} = req.userData
    const {type, effect} = req.body

    const types = ['accInfos', 'items', 'rolls', 'codes', 'blogs']
    const effects = ['personal', 'manage']

    let result = []

    try {
        if (!type && !effect) {
            if (req.userData.roles != 'admin'){
                return res.status(403).json({
                    msg: 'ValidatorError',
                    errors: {
                        user: `You don't have the permission!`
                    }
                })
            }

            result = await History.find({})

            return res.status(200).json({
                msg: 'success',
                length: result.length,
                history: result
            })
        }
        else if (!types) {
            return res.status(202).json({
                msg: 'ValidatorError',
                errors: {
                    user: `Request body have to include 'type'!`
                }
            })
        }
        else if (!effect) {
            return res.status(202).json({
                msg: 'ValidatorError',
                errors: {
                    user: `Request body have to include 'effect'!`
                }
            })
        }
        else if (!types.includes(type) || !effects.includes(effect)) {
            return res.status(202).json({
                msg: 'ValidatorError',
                errors: {
                    user: `Value of 'type' and 'effect' must be valid!`
                }
            })
        }

        result = await loadHistory(_id, type, effect)

        res.status(200).json({
            msg: 'success',
            history: result
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    }
}