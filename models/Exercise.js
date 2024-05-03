const mongoose = require('mongoose')

const { Schema, SchemaTypes } = mongoose

const exerciseSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    username: String,
    description: String,
    duration: SchemaTypes.Number,
    date: String,
})

module.exports = mongoose.model('Exercise', exerciseSchema)