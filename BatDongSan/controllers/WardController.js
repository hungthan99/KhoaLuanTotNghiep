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
            res.status(200).json(savedWard);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getWards: async(req, res) => {
        try {
            const wards = await Ward.find();
            res.status(200).json(wards);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getWardById: async(req, res) => {
        try {
            const ward = await Ward.findById(req.params.id);
            res.status(200).json(ward);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoWard: async(req, res) => {
        try {
            const ward = await Ward.findById(req.params.id);
            await ward.updateOne({$set: req.body});
            res.status(200).json('Updated information of ward successfully.');
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = wardController;