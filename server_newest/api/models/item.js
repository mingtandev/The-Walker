const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const enu = {
    values: ['gun', 'hat', 'outfit'],
    message: `Type must be 'gun', 'hat' or 'outfit'!`
}

const itemScheme = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Name is required!']
    },
    detail: {
        type: String,
        required: [true, 'Detail is required!']
    },
    slugName: {
        type: String,
        slug: 'name'
    },
    type: {
        type: String,
        enum: enu,
        required: [true, 'Type is required!']
    },
    thumbnail: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'Price is required!']
    },
    sale: {
        type: Number,
        default: 0
    },
    saleExpiresTime: {
        type: Date,
        default: Date.now()
    }
})

itemScheme.path('name').validate(async (value) => {
    const nameCount = await mongoose.models.Item.countDocuments({name: value })
    return !nameCount

}, 'Name already exists!')

// Add plugins
mongoose.plugin(slug)
itemScheme.set('timestamps', true)

module.exports = mongoose.model('Item', itemScheme)