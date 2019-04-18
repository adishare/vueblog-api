const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name required']
    },
    img: {
        type: 'String',
        default: ''
    },
    description: {
        type: String,
        required: [true, 'description required']
    },
    price: {
        type: Number,
        required: [true, 'price required']
    },
    stock: {
        type: Number,
        required: [true, 'stock required'],
        default: 0
    },
    categories : {
        type: Array,
        default: ['Uncategorized']
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Item', itemSchema)
