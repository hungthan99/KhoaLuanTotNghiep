const District = require('../models/District');
const Province = require('../models/Province');
const Post = require('../models/Post');
const Project = require('../models/Project');
const User = require('../models/User');

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
            const items = [];
            districts.forEach((district) => {
                const item = {
                    'id': district._id,
                    'name': district.name,
                    'province': district.province
                }
                items.push(item);
            });
            res.status(200).json({status: 200, 'message': 'Get districts successfully.', 'data': items});
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
    },

    deleteDistrict: async(req, res) => {
        try {
            await User.updateMany({districts: req.params.id}, {$pull: {districts: req.params.id}});
            await Post.updateMany({districts: req.params.id}, {$pull: {districts: req.params.id}});
            await Project.updateMany({districts: req.params.id}, {$pull: {districts: req.params.id}});
            await Province.updateMany({districts: req.params.id}, {$pull: {districts: req.params.id}});
            const deletedDistrict = await District.findByIdAndDelete(req.params.id);
            res.status(200).json({status: 200, 'message': 'Deleted district successfully.', 'data': deletedDistrict});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = districtController;