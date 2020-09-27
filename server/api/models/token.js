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
        required: true,
        default: Date.now,
        expires: 43200
    }
})

module.exports = mongoose.model('Token', tokenSchema)