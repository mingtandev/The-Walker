const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const codeSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        default: 'Normal'
    },
    items: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Item'
        }
    ],
    isUsed: {
        type: Boolean,
        default: false
    },
    expiresTime: {
        type: Date,
        default: Date.now() + 259200000 // 3 days
    }
})

// Add plugins
codeSchema.set('timestamps', true)

module.exports = mongoose.model('Code', codeSchema)