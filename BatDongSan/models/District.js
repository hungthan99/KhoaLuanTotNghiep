const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Province'
    },
    wards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ward'
        }
    ]
})

module.exports = mongoose.model('District', districtSchema);