const mongoose = require('mongoose')

const historySchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'UserId is required!']
    },
    actions: {
        accInfos: {
            type: Object,
            default: {
                personal: [],
                manage: []
            }
        },
        items: {
            type: Object,
            default: {
                personal: [],
                manage: []
            }
        },
        rolls: {
            type: Object,
            default: {
                personal: [],
                manage: []
            }
        },
        codes: {
            type: Object,
            default: {
                personal: [],
                manage: []
            }
        },
        blogs: {
            type: Object,
            default: {
                personal: [],
                manage: []
            }
        }
    }
})

// Add plugins
historySchema.set('timestamps', true)

module.exports = mongoose.model('History', historySchema)