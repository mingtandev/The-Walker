const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const historySchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    actions: {
        accInfos: [
            {
                type: Array,
                default: []
            }
        ],
        items: [
            {
                type: Array,
                default: []
            }
        ],
        rolls: [
            {
                type: Array,
                default: []
            }
        ],
        codes: [
            {
                type: Array,
                default: []
            }
        ]
    }
})

// Add plugins
historySchema.set('timestamps', true)

module.exports = mongoose.model('History', historySchema)