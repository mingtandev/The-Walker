const mongoose = require('mongoose')
const async = require('async')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const User = require('./../models/user')
const VerifyToken = require('../models/verifyToken')
const RefreshToken = require('../models/refreshToken')

const { sendMail } =  require('./../config/nodemailer')
const { json } = require('express')
const { decode } = require('punycode')

const tokenLife = process.env.TOKEN_LIFE
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE
const jwtKey = process.env.JWT_KEY

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
                    const token = crypto.randomBytes(16).toString('hex')
                    const tokenObj = new VerifyToken({
                        userID: newUser._id,
                        token
                    })

                    tokenObj.save()
                    .then(userReg => {
                        sendMail(newUser.email, userReg.token, 'confirmation')
                    })
                    .catch(error => {
                        res.status(500).json({
                            msg: 'Server error!',
                            error
                        })
                    })

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

    VerifyToken.findOne({token})
    .then(tokenObj => {
        if(!tokenObj){
            return res.status(404).json({
                msg: 'Invalid token!'
            })
        }

        User.findOne({_id: tokenObj.userID})
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    msg: 'Invalid token!'
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
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
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

        const token = crypto.randomBytes(16).toString('hex')
        const tokenObj = new VerifyToken({
            userID: user._id,
            token
        })

        tokenObj.save()
        .then(userReg => {
            sendMail(email, userReg.token, 'confirmation')

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
                        const { email, _id, isVerified, slugName, roles } = user[0]
                        const payloadToken = { _id, roles, slugName, email }
                        const token = jwt.sign( payloadToken, jwtKey, {
                            expiresIn: tokenLife
                        })
                        const refreshToken = jwt.sign(payloadToken, jwtKey, {
                            expiresIn: refreshTokenLife
                        })
                        const refreshTokenObj = new RefreshToken({
                            userID: _id,
                            refreshToken
                        })

                        if(!isVerified) {
                            return res.status(401).json({
                                msg: "Your account has not been verified!"
                            })
                        }

                        refreshTokenObj.save()
                        .then(result => {
                            res.status(200).json({
                                msg: 'success',
                                token,
                                refreshToken
                            })
                        })
                        .catch(error => {
                            res.status(500).json({
                                msg: 'Server error!',
                                error
                            })
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
    const {refreshToken} = req.body

    if(!refreshToken){
        return res.status(404).json({
            msg: 'RefreshToken is required!'
        })
    }

    RefreshToken.findOne({refreshToken})
    .then(result => {
        if(result){
            jwt.verify(refreshToken, jwtKey, (error, decoded) => {
                if(error){
                    return res.status(500).json({
                        msg: 'Server error!',
                        error
                    })
                }

                const {_id, slugName, email, roles} = decoded
                const token = jwt.sign({_id, roles, slugName, email}, jwtKey, {
                    expiresIn: tokenLife,
                })

                res.status(200).json({
                    msg: 'success',
                    token
                })
            })

        }else{
            res.status(404).json({
                msg: 'RefreshToken not found!'
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

        bcrypt.hash(email, 10, (error, encryptedEmail) => {
            if(error){
                return res.status(500).json({
                    msg: 'Server error!',
                    error
                })

            }else{
                const verifyToken = new VerifyToken({
                    userID: user._id,
                    token: encryptedEmail
                })

                verifyToken.save()
                .then(veri => {
                    const token = crypto.randomBytes(16).toString('hex')
                    const tokenObj = new VerifyToken({
                        userID: newUser._id,
                        token
                    })

                    tokenObj.save()
                    .then(userReg => {
                        sendMail(newUser.email, userReg.token, 'confirmation')
                    })
                    .catch(error => {
                        res.status(500).json({
                            msg: 'Server error!',
                            error
                        })
                    })

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
            msg: 'Server error!',
            error
        })
    })
}
exports.forgot = (req, res, next)  => {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, (err, buf) => {
                const token = buf.toString('hex')
                done(err, token)
            })
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, (err, user) => {
                if (!user) {
                    return res.status(404).json({
                        msg: 'Email not found!'
                    })
                }

                user.passwordResetToken = token
                user.passwordResetExpires = Date.now() + 3600000 // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                })
            })
        },
        function(token, user, done) {
            sendMail(user.email, token, 'recovery')
        }],
        function(err) {
            res.status(500).json({
                msg: 'Server error!'
            })
        }
    )

    res.status(200).json({
        msg: 'success'
    })
}

exports.postReset = (req, res, next) => {
}

exports.information = (req, res, next) => {
    const _id = req.userData._id

    User.findById(_id)
    .select('name email roles isVerified')
    .then(user => {
        if(!user){
            return res.status(404).json({
                msg: 'User not found!'
            })
        }

        res.status(200).json({
            msg: 'success',
            user
        })
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
    const {userID} = req.params

    if(roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have permission!`
        })

    }

    User.deleteOne({_id: userID})
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
}