const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Province',
        required: true
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: true
    },
    ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ward',
        required: true
    },
    projectType: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: [String],
        required: true
    },
    apartment: {
        type: Number
    },
    acreage: {
        type: Number
    },
    building: {
        type: Number
    },
    legal: {
        type: Number
    },
    investor: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
})

module.exports = mongoose.model('Project', projectSchema);