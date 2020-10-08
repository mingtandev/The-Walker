const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const userItemSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true
    },
    coin: {
        type: Number,
        default: 5000,
    },
    items: {
        guns: {
            type: Array,
            default: ['M16A4', 'AWM']
        }
        ,
        hats: {
            type: Array,
            default: ['Cowboy']
        }
        ,
        outfits: {
            type: Array,
            default: ['Amor lv1']
        }
    }
})

// Add plugins
mongoose.plugin(slug)
userItemSchema.set('timestamps', true)

module.exports = mongoose.model('UserItem', userItemSchema)