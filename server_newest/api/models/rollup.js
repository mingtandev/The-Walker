const mongoose = require('mongoose')

const rollupSchema = mongoose.Schema({
    day: {
        type: Number,
        required: [true, 'Day is required!'],
        unique: true
    },
    coin: {
        type: Number,
        default: 1000
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Item is required!'],
        ref: 'Item'
    },
    thumbnail: {
        type: String,
        default: ''
    }
})

rollupSchema.path('day').validate(async (value) => {
    const dayCount = await mongoose.models.Rollup.countDocuments({day: value })
    return !dayCount

}, 'Day already exists!')

// Add plugins
rollupSchema.set('timestamps', true)

module.exports = mongoose.model('Rollup', rollupSchema)