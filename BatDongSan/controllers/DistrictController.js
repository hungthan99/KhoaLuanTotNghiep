const District = require('../models/District');
const Province = require('../models/Province');

const districtController = {
    addDistrict: async(req, res) => {
        try {
            const newDistrict = new District(req.body);
            const savedDistrict = await newDistrict.save();
            if(req.body.province) {
                const province = Province.findById(req.body.province);
                await province.updateOne({$push: {districts: savedDistrict._id}});
            }
            res.status(200).json(savedDistrict);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getDistricts: async(req, res) => {
        try {
            const districts = await District.find();
            res.status(200).json(districts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getDistrictById: async(req, res) => {
        try {
            const district = await District.findById(req.params.id);
            res.status(200).json(district);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoDistrict: async(req, res) => {
        try {
            const district = await District.findById(req.params.id);
            await district.updateOne({$set: req.body});
            res.status(200).json('Updated information of district successfully.');
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = districtController;