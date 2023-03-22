const Province = require('../models/Province');
const axios = require('axios');

const provinceController = {
    addProvince: async(req, res) => {
        try {
            const newProvince = new Province(req.body);
            const savedProvince = await newProvince.save();
            res.status(200).json(savedProvince);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getProvinces: async(req, res) => {
        try {
            const provinces = await Province.find();
            res.status(200).json(provinces);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getProvinceById: async(req, res) => {
        try {
            const province = await Province.findById(req.params.id);
            res.status(200).json(province);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoProvince: async(req, res) => {
        try {
            const province = await Province.findById(req.params.id);
            await province.updateOne({$set: req.body});
            res.status(200).json('Updated infomation of province successully.');
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = provinceController;