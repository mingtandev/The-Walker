const mongoose = require('mongoose')

const userScheme = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    roles: {
        type: Array,
        default: []
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    password: {type: String,  required: true},
    passwordResetToken: {type: String, default: "hello"},
    passwordResetExpires: {type: Date, default: Date.now},
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
})

module.exports = mongoose.model('User', userScheme)