const mongoose = require('mongoose')
const Item = require('./item')

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

// codeSchema.path('items').validate((value) => {
//     for (const ele of value) {
//         const respond = mongoose.Types.ObjectId.isValid(ele)
//         console.log(respond)
//         if (!respond) return 0
//     }

//     return 1

// }, 'Code already exists!')

// Add plugins
codeSchema.set('timestamps', true)

module.exports = mongoose.model('Code', codeSchema)