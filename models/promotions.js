const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose)

const Currency = mongoose.Types.Currency
const Schema = mongoose.Schema

const promotionSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Promotions = mongoose.model('Promotion', promotionSchema)

module.exports = Promotions