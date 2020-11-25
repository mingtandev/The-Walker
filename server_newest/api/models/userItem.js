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
        guns: {
            type: Array,
            default: [{
                id: '',
                name: 'AWM',
                detail: 'Item detail',
                boughtAt: new Date()
            }]
        }
        ,
        hats: {
            type: Array,
                default: [{id: '',
                name: 'Cowboy',
                detail: 'Item detail',
                boughtAt: new Date()
            }]
        }
        ,
        outfits: {
            type: Array,
            default: [{
                id: '',
                name: 'Bikini',
                detail: 'Item detail',
                boughtAt: new Date()
            }]
        }

    }
})

// Add plugins
userItemSchema.set('timestamps', true)

module.exports = mongoose.model('UserItem', userItemSchema)