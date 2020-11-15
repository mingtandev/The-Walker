const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

const userScheme = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid email!']
    },
    roles: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    cash: {
        type: Number,
        default: 200000
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
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
        slug: 'name'
    }
})

userScheme.path('name').validate(async (value) => {
    const nameCount = await mongoose.models.User.countDocuments({name: value })
    return !nameCount

}, 'Name already exists!')

userScheme.path('email').validate(async (value) => {
    const emailCount = await mongoose.models.User.countDocuments({email: value })
    return !emailCount

}, 'Email already exists!')

userScheme.path('roles').validate(async (value) => {
    const isValid = ['user', 'admin'].includes(value)
    return isValid

}, `Roles must be 'user' or 'admin'!`)

// Add plugins
mongoose.plugin(slug)
userScheme.set('timestamps', true)

module.exports = mongoose.model('User', userScheme)