const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const itemScheme = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slugName: {
        type: String,
        slug: 'name',
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

// Add plugins
mongoose.plugin(slug)
itemScheme.set('timestamps', true)

module.exports = mongoose.model('Item', itemScheme)