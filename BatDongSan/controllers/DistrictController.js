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
            res.status(200).json({status: 200, 'message': 'Add district successfully.', 'data': savedDistrict});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getDistricts: async(req, res) => {
        try {
            const districts = await District.find();
            const data = {
                'id': districts._id,
                'name': districts.name,
                'province': districts.province
            }
            res.status(200).json({status: 200, 'message': 'Get districts successfully.', 'data': data});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getDistrictById: async(req, res) => {
        try {
            const district = await District.findById(req.params.id);
            const data = {
                'id': district._id,
                'name': district.name,
                'province': district.province
            }
            res.status(200).json({status: 200, 'message': 'Get district by id successfully.', 'data': data});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoDistrict: async(req, res) => {
        try {
            const district = await District.findById(req.params.id);
            const updatedDistrict = await district.updateOne({$set: req.body});
            res.status(200).json({status: 200, 'message': 'Updated information of district successfully.', 'data': updatedDistrict});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = districtController;