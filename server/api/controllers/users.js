const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const User = require('./../models/user')
const VerifyToken = require('../models/verifyToken')
const RefreshToken = require('../models/refreshToken')

const { sendMail } =  require('./../config/nodemailer')

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

        }else{
            bcrypt.hash(password, 10, (error, encryptedPassword) => {
                if(error){
                    return res.status(500).json({
                        msg: 'Server error!',
                        error
                    })

                }else{
                    const user = new User({
                        name,
                        email,
                        password: encryptedPassword
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
                            sendMail(newUser.email, userReg.token)
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
        }
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

    User.findOne({email}).
    then(user => {
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
            sendMail(email, userReg.token)

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
                        const { email, _id, isVerified, slugName } = user[0]
                        const payloadToken = { _id, slugName, email }
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

exports.change = (req, res, next) => {
}

exports.reset = (req, res, next) => {
}

exports.information = (req, res, next) => {
}

exports.delete =  (req, res, next) => {
}