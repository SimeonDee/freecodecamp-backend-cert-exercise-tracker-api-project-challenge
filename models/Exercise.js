const mongoose = require('mongoose')

const { Schema, SchemaTypes } = mongoose

const exerciseSchema = new Schema({
    user_id: {
        type: SchemaTypes.ObjectId,
        ref: User,
    },
}, 
{timestamps: true})

module.exports = mongoose.model('Exercise', exerciseSchema)