const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const User = require('./../models/user')
const Token = require('./../models/token')

const { sendMail } =  require('./../config/nodemailer')

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
                        const tokenObj = new Token({
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
}

exports.resend = (req, res, next) => {
}

exports.login = (req, res, next) => {
}

exports.change = (req, res, next) => {
}

exports.reset = (req, res, next) => {
}

exports.information = (req, res, next) => {
}

exports.delete =  (req, res, next) => {
}