const mongoose = require('mongoose')

const enu = {
    values: ['Normal', 'Vip'],
    message: `Type must be 'Normal' or 'Vip'!`
}

const codeSchema = mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Code is required!'],
        unique: true
    },
    type: {
        type: String,
        enum: enu,
        default: 'Normal'
    },
    items: [
        {
            type: mongoose.Types.ObjectId,
            required: [true, 'Items is required!'],
            ref: 'Item'
        }
    ],
    isUsed: {
        type: Boolean,
        default: false
    },
    expiresTime: {
        type: Date
    }

}, {strict: 'throw'})

codeSchema.path('code').validate(async (value) => {
    const codeCount = await mongoose.models.Code.countDocuments({code: value })
    return !codeCount

}, 'Code already exists!')

// Add plugins
codeSchema.set('timestamps', true)

module.exports = mongoose.model('Code', codeSchema)