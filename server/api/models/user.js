const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

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
        type: String,
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    passwordResetToken: {
        type: String,
        default: 'randomStringHere'
    },
    passwordResetExpires: {
        type: Date,
        default: Date.now(),
    },
    slugName: {
        type: String,
        slug: 'name',
        unique: true
    }
})

// Add plugins
mongoose.plugin(slug)
userScheme.set('timestamps', true)

module.exports = mongoose.model('User', userScheme)