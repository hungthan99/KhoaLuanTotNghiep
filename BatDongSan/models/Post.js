const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    isSell: {
        type: Boolean,
        required: true
    },
    realEstateType: {
        type: Number,
        required: true
    },
    province: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Province'
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'District'
    },
    ward: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Ward'
    },
    address: {
        type: String
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    postType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostType'
    },
    lat: {
        type: Number,
        required: true,
    },
    long: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    acreage: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    legal: {
        type: Number
    },
    funiture: {
        type: Number
    },
    bedroom: {
        type: Number
    },
    bathroom: {
        type: Number
    },
    floor: {
        type: Number
    },
    houseDirection: {
        type: Number
    },
    balconyDirection: {
        type: Number
    },
    wayIn: {
        type: Number
    },
    facade: {
        type: Number
    },
    image: {
        type: [String],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
})

module.exports = mongoose.model('Post', postSchema);