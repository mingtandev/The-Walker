const mongoose = require('mongoose')

const tokenSchema = mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d'
    }
})

module.exports = mongoose.model('VerifyToken', tokenSchema)