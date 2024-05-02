const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema({
    username: String,
    exercises: [{
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
    }]
})

module.exports = mongoose.model('User', userSchema)