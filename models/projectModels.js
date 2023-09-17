const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    profile: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    userid: {
        type: String,
        required: true
    },
    banner: {
        type: String,
        required: true,
        unique: true
    },
    
}, {timestamps: true})


module.exports = mongoose.model('Project', projectSchema)