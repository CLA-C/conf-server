const mongoose = require('mongoose')
const Schema = mongoose.Schema

const leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Leaders = mongoose.model('Leader', leaderSchema)

module.exports = Leaders
