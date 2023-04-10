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
    provinceCode: {
        type: String,
        required: true
    },
    districtCode: {
        type: String,
        required: true
    },
    wardCode: {
        type: String,
        required: true
    },
    provinceName: {
        type: String,
        required: true
    },
    districtName: {
        type: String,
        required: true
    },
    wardName: {
        type: String,
        required: true
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
    acreageRange: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    priceRange: {
        type: String,
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
    bedroomRange: {
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
    },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Post', postSchema);