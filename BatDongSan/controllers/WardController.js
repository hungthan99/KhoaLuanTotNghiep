// const District = require('../models/District');
// const Ward = require('../models/Ward');
// const Post = require('../models/Post');
// const Project = require('../models/Project');
// const User = require('../models/User');

const pcVN = require('pc-vn');

const wardController = {
    // addWard: async(req, res) => {
    //     try {
    //         const newWard = new Ward(req.body);
    //         const savedWard = await newWard.save();
    //         if(savedWard.district) {
    //             const district = District.findById(req.body.district);
    //             await district.updateOne({$push: {wards: savedWard._id}});
    //         }
    //         res.status(200).json({status: 200, message: 'Add ward successfully.', data: savedWard});
    //     } catch (err) {
    //         res.status(500).json(err);
    //     }
    // },

    getWards: async(req, res) => {
        try {
            // const wards = await Ward.find();
            // const items = [];
            // wards.forEach((ward) => {
            //     const item = {
            //         'id': ward._id,
            //         'name': ward.name,
            //         'district': ward.district
            //     }
            //     items.push(item);
            // });
            // res.status(200).json({status: 200, message: 'Get wards successfully.', data: items});
            const wards = pcVN.getWards();
            res.status(200).json({status: 200, message: 'Get wards successfully.', data: wards});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getWardById: async(req, res) => {
        try {
            // const ward = await Ward.findById(req.params.id);
            // const data = {
            //     'id': ward._id,
            //     'name': ward.name,
            //     'district': ward.district
            // }
            // res.status(200).json({status: 200, message: 'Get ward by id successfully.', data: data});
            const wards = pcVN.getWards();
            wards.forEach((item) => {
                if(item.code == req.body.code) {
                    const ward = {
                        'code': item.code,
                        'name': item.name,
                        'unit': item.unit,
                        'district_code': item.district_code,
                        'district_name': item.district_name,
                        'province_code': item.province_code,
                        'province_name': item.province_name,
                        'full_name': item.full_name
                    }
                    res.status(200).json({status: 200, message: 'Get province by id successfully.', data: ward});
                }
            }); 
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // updateInfoWard: async(req, res) => {
    //     try {
    //         const ward = await Ward.findById(req.params.id);
    //         const updatedWard = await ward.updateOne({$set: req.body});
    //         res.status(200).json({status: 200, message: 'Updated information of ward successfully.', data: updatedWard});
    //     } catch (err) {
    //         res.status(500).json(err);
    //     }
    // },

    // deleteWard: async(req, res) => {
    //     try {
    //         await User.updateOne({ward: req.params.id}, {$set: {ward: null}});
    //         await Post.updateOne({ward: req.params.id}, {$set: {ward: null}});
    //         await Project.updateOne({ward: req.params.id}, {$set: {ward: null}});
    //         await District.updateMany({wards: req.params.id}, {$pull: {wards: req.params.id}});
    //         const deleteWard = await Ward.findByIdAndDelete(req.params.id);
    //         res.status(200).json({status: 200, message: 'Deleted ward successfully.', data: deleteWard});
    //     } catch (err) {
    //         res.status(500).json(err);
    //     }
    // },

    getWardsByDistrict: async(req, res) => {
        try {
            // const wards = await Ward.find({district: req.params.id});
            // const items = [];
            // wards.forEach((ward) => {
            //     const item = {
            //         'id': ward._id,
            //         'name': ward.name,
            //         'district': ward.district
            //     }
            //     items.push(item);
            // });
            // res.status(200).json({status: 200, message: 'Get wards of district successfully.', data: items});
            const wards = pcVN.getWardsByDistrictCode(req.body.district);
            res.status(200).json({status: 200, message: 'Get wards of district successfully.', data: wards});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getWardsByProvince: async(req, res) => {
        try {
            // const wards = await Ward.find({district: req.params.id});
            // const items = [];
            // wards.forEach((ward) => {
            //     const item = {
            //         'id': ward._id,
            //         'name': ward.name,
            //         'district': ward.district
            //     }
            //     items.push(item);
            // });
            // res.status(200).json({status: 200, message: 'Get wards of district successfully.', data: items});
            const wards = pcVN.getWardsByProvinceCode(req.body.province);
            res.status(200).json({status: 200, message: 'Get wards of district successfully.', data: wards});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = wardController;