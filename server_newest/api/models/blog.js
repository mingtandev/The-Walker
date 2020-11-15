const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const blogSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    writer: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: ''
    }
})

// Add plugins
mongoose.plugin(slug)
blogSchema.set('timestamps', true)

module.exports = mongoose.model('Blog', blogSchema)