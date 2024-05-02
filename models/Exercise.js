const mongoose = require('mongoose')

const { Schema, SchemaTypes } = mongoose

const exerciseSchema = new Schema({
    username: {
        type: String,
        ref: 'User',
    },
    description: String,
    duration: SchemaTypes.Number,
    date: String,
})

module.exports = mongoose.model('Exercise', exerciseSchema)