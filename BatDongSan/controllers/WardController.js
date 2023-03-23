const District = require('../models/District');
const Ward = require('../models/Ward');

const wardController = {
    addWard: async(req, res) => {
        try {
            const newWard = new Ward(req.body);
            const savedWard = await newWard.save();
            if(req.body.district) {
                const district = District.findById(req.body.district);
                await district.updateOne({$push: {wards: savedWard._id}});
            }
            res.status(200).json({status: 200, 'message': 'Add ward successfully.', 'data': savedWard});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getWards: async(req, res) => {
        try {
            const wards = await Ward.find();
            const items = [];
            wards.forEach((ward) => {
                const item = {
                    'id': ward._id,
                    'name': ward.name,
                    'district': ward.district
                }
                items.push(item);
            });
            res.status(200).json({status: 200, 'message': 'Get wards successfully.', 'data': items});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getWardById: async(req, res) => {
        try {
            const ward = await Ward.findById(req.params.id);
            const data = {
                'id': ward._id,
                'name': ward.name,
                'district': ward.district
            }
            res.status(200).json({status: 200, 'message': 'Get ward by id successfully.', 'data': data});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoWard: async(req, res) => {
        try {
            const ward = await Ward.findById(req.params.id);
            const updatedWard = await ward.updateOne({$set: req.body});
            res.status(200).json({status: 200, 'message': 'Updated information of ward successfully.', 'data': updatedWard});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = wardController;