const mongoose = require('mongoose')

const rollupSchema = mongoose.Schema({
    day: {
        type: Number,
        required: true,
        unique: true
    },
    coin: {
        type: Number,
        default: 1000
    },
    item: {
        type: mongoose.Types.ObjectId,
        ref: 'Item',
        default: null
    }
})

// Add plugins
rollupSchema.set('timestamps', true)

module.exports = mongoose.model('Rollup', rollupSchema)