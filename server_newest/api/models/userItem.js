const mongoose = require('mongoose')

const userItemSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    coin: {
        type: Number,
        default: 5000,
    },
    items: {
        guns: [],
        hats: [],
        outfits: []
    }
})

// Add plugins
userItemSchema.set('timestamps', true)

module.exports = mongoose.model('UserItem', userItemSchema)