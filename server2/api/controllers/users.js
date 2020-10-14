const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const { sendMail } =  require('../config/nodemailer')

const tokenLife = process.env.TOKEN_LIFE
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE
const jwtKey = process.env.JWT_KEY

exports.getAll = (req, res, next) => {
    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    User.find({})
    .select('name slugName email cash roles isVerified')
    .then(users => {
        res.status(200).json({
            msg: 'success',
            length: users.length,
            users
        })
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.signup =  (req, res, next) => {
    const {name, email, password} = req.body

    if(!name || !email || !password) {
        return res.status(404).json({
            msg: "Fields: name, email and password are required!"
        })
    }

    User.find({email})
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                msg: "Email has been used!"
            })
        }

        bcrypt.hash(password, 10, (error, encryptedPassword) => {
            if(error){
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
                .then(newUser => {
                    const token = jwt.sign( {_id: newUser._id}, jwtKey, {
                        expiresIn: tokenLife
                    })

                    sendMail(req, newUser.email, token, 'confirmation')

                    res.status(201).json({
                        msg: "success"
                    })
                })
                .catch(error => {
                    res.status(500).json({
                        msg: 'Server error!',
                        error
                    })
                })
            }
        })
    })
    .catch(error => {
        res.status(500).json({
            msg: "Server error!",
            error
        })
    })
}

exports.confirmation = (req, res, next) => {
    const {verifyToken: token} = req.params

    if(!token){
        return res.status(404).json({
            msg: 'Invalid token!'
        })
    }

    try {
        const decoded = jwt.verify(token, jwtKey)
        const {_id} = decoded

        User.findOne({_id})
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    msg: 'User not found!'
                })
            }

            if(user.isVerified){
                return res.status(200).json({
                    msg: 'success'
                })
            }

            user.isVerified = true

            user.save((error) => {
                if(error) {
                    return res.status(500).json({
                        msg: 'Server error!',
                        error
                    })
                }

                res.status(200).json({
                    msg: 'success'
                })
            })
        })
        .catch(error => {
            res.status(500).json({
                msg: 'Server error!',
                error
            })
        })

    } catch (error) {
        res.status(404).json({
            msg: 'Token has expires. Please click resend confirmation email!'
        })
    }
}

exports.resend = (req, res, next) => {
    const {email} = req.body

    if(!email) {
        res.status(404).json({
            msg: 'Email is required!'
        })
    }

    User.findOne({email})
    .then(user => {
        if(!user) {
            return res.status(404).json({
                msg: 'Email not found!'
            })
        }

        if(user.isVerified) {
            return res.status(200).json({
                msg: 'success'
            })
        }

        const token = jwt.sign( {_id: user._id}, jwtKey, {
            expiresIn: tokenLife
        })

        sendMail(req, user.email, token, 'confirmation')

        res.status(201).json({
            msg: "success"
        })
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.login = (req, res, next) => {
    const {email, password} = req.body

    if(!email || !password){
        return res.status(404).json({
            msg: 'Email and password are required!'
        })
    }

    User.find({email})
    .then(user => {
        if(user.length < 1){
            return res.status(404).json({
                msg: 'Auth failed!'
            })

        }else{
            bcrypt.compare(password, user[0].password, (error, matched) => {
                if(error){
                    return res.status(404).json({
                        msg: 'Auth failed!'
                    })

                }else{
                    if(matched){
                        const { email, _id, isVerified, name, cash, slugName, roles } = user[0]
                        const payloadToken = { _id, roles, name, cash, slugName, email }
                        const token = jwt.sign( payloadToken, jwtKey, {
                            expiresIn: tokenLife
                        })
                        const refreshToken = jwt.sign(payloadToken, jwtKey, {
                            expiresIn: refreshTokenLife
                        })

                        if(!isVerified) {
                            return res.status(401).json({
                                msg: "Your account has not been verified!"
                            })
                        }

                        res.status(200).json({
                            msg: 'success',
                            token,
                            refreshToken
                        })

                    }else{
                        res.status(404).json({
                            msg: 'Auth failed!'
                        })
                    }
                }
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.refresh = (req, res, next) => {
    const { refreshToken } = req.body

    if(!refreshToken){
        return res.status(404).json({
            msg: 'RefreshToken is required!'
        })
    }

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
        res.status(401).json({
            msg: 'Refresh token expires. Please login!'
        })
    }
}

exports.change = (req, res, next) => {
    const {_id} = req.userData
    const {newPassword} = req.body

    User.findById({ _id})
    .then(user => {
        if(!user){
            return res.status(500).json({
                msg: 'User not found!'
            })
        }

        bcrypt.hash(newPassword, 10, (error, encryptedPassword) => {
            if(error){
                return res.status(500).json({
                    msg: 'Server error!',
                    error
                })

            }

            user.password = encryptedPassword
            user.save()
            .then(newUser => {
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
        })
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.recovery = (req, res, next) => {
    const {email} = req.body

    if(!email) {
        return res.status(404).json({
            msg: 'Email is required!'
        })
    }

    User.findOne({email})
    .then(user => {
        if(!user) {
            return res.status(404).json({
                msg: 'Email not found!'
            })
        }

        bcrypt.hash(email, 10)
        .then(hashed => {
            user.passwordResetToken = hashed
            user.passwordResetExpires = Date.now() + 7200000 // 2h

            user.save()
            .then(newUser => {
                sendMail(req, newUser.email, newUser.passwordResetToken, 'recovery')

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
        })
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.forgot = (req, res, next)  => {
    const {newPassword, passwordResetToken} = req.body

    if(!newPassword || ! passwordResetToken){
        return res.status(404).json({
            msg: 'newPassword and passwordResetToken are required!'
        })
    }

    User.findOne({
        passwordResetToken,
        passwordResetExpires: {
            $gt: Date.now()
        }
    })
    .then(user => {
        if(!user){
            return res.status(404).json({
                msg: 'User not found or password reset token expires!'
            })
        }

        bcrypt.hash(newPassword, 10)
        .then(hashed => {
            user.password = hashed
            user.passwordResetToken = ''
            user.passwordResetExpires = Date.now()

            user.save()
            .then(user => {
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
        })
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.information = (req, res, next) => {
    const _id = req.userData._id

    User.findById(_id)
    .select('name email roles cash isVerified')
    .then(user => {
        if(!user){
            return res.status(404).json({
                msg: 'User not found!'
            })
        }else{
            res.status(200).json({
                msg: 'success',
                user
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.delete =  (req, res, next) => {
    const {roles} = req.userData
    const {_id} = req.body

    if(roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    if(!_id){
        return res.status(404).json({
            msg: 'UserID is required!'
        })
    }

    User.findById(_id)
    .then(user => {
        if(!user){
            return res.status(404).json({
                msg: 'User not found!'
            })
        }

        if(user.roles === 'admin'){
            return res.status(404).json({
                msg: `You don't have the permission!`
            })
        }

        User.deleteOne({_id})
        .then(result => {
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
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}