const mongoose = require('mongoose');

const optSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    otp: {
        type: String,
        require: true
    },
    createAt: { type: Date, default: Date.now, index: { expires: 60 } }
})

module.exports = mongoose.model('OTP', optSchema);