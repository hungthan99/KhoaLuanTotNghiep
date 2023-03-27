const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    // province: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Province',
    //     required: true
    // },
    // district: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'District',
    //     required: true
    // },
    // ward: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Ward',
    //     required: true
    // },
    province: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    ward: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: String,
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
    images: {
        type: [String],
        required: true
    },
    apartment: {
        type: String
    },
    acreage: {
        type: String
    },
    building: {
        type: String
    },
    legal: {
        type: String
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