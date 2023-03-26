const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    isSell: {
        type: Boolean,
        required: true
    },
    realEstateType: {
        type: String,
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
        type: String
    },
    funiture: {
        type: String
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
        type: String
    },
    balconyDirection: {
        type: String
    },
    wayIn: {
        type: Number
    },
    facade: {
        type: Number
    },
    images: {
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
    },
    contactName: {
        type: String,
        required: true
    },
    contactPhoneNumber: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Post', postSchema);