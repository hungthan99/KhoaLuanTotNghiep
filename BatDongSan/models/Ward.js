const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
    }
})

module.exports = mongoose.model('Ward', wardSchema);