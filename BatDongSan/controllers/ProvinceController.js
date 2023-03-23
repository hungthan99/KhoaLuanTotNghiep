const Province = require('../models/Province');

const provinceController = {
    addProvince: async(req, res) => {
        try {
            const newProvince = new Province(req.body);
            const savedProvince = await newProvince.save();
            res.status(200).json({status: 200, 'message': 'Add province successfully.', 'data': savedProvince});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getProvinces: async(req, res) => {
        try {
            const provinces = await Province.find();
            const items = [];
            provinces.forEach((province) => {
                const item = {
                    'id': province._id,
                    'name': province.name,
                    'lat': province.lat,
                    'long': province.long
                }
                items.push(item);
            });
            res.status(200).json({status: 200, 'message': 'Get provinces successfully.', 'data': items});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getProvinceById: async(req, res) => {
        try {
            const province = await Province.findById(req.params.id);
            const data = {
                'id': province._id,
                'name': province.name,
                'lat': province.lat,
                'long': province.long
            }
            res.status(200).json({status: 200, 'message': 'Get province by id successfully.', 'data': data});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoProvince: async(req, res) => {
        try {
            const province = await Province.findById(req.params.id);
            const updatedProvince = await province.updateOne({$set: req.body});
            res.status(200).json({status: 200, 'message': 'Updated infomation of province successully.', 'data': updatedProvince});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = provinceController;