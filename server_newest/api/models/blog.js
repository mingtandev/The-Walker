const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const blogSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    writer: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Writer is required!'],
        ref: 'User'
    },
    name: {
        type: String,
        required: [true,'Name is required!'],
    },
    title: {
        type: String,
        required: [true, 'Title is required!'],
        unique: true
    },
    content: {
        type: String,
        required: [true, 'Content is required!'],
    },
    thumbnail: {
        type: String,
        default: ''
    }
})

blogSchema.path('title').validate(async (value) => {
    const titleCount = await mongoose.models.Blog.countDocuments({title: value })
    return !titleCount

}, 'Title already exists!')

// Add plugins
mongoose.plugin(slug)
blogSchema.set('timestamps', true)

module.exports = mongoose.model('Blog', blogSchema)