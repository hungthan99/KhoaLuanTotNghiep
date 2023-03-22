const mongoose = require('mongoose');

const provinceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true,
    },
    long: {
        type: Number,
        required: true
    },
    districts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'District'
        }
    ]
})

module.exports = mongoose.model('Province', provinceSchema);