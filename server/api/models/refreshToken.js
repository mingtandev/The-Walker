const mongoose = require('mongoose')

const refreshTokenSchema = mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    refreshToken: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
})

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)