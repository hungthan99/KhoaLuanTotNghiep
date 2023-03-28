// const District = require('../models/District');
// const Province = require('../models/Province');
// const Post = require('../models/Post');
// const Project = require('../models/Project');
// const User = require('../models/User');

const pcVN = require('pc-vn');

const districtController = {
    // addDistrict: async(req, res) => {
    //     try {
    //         const newDistrict = new District(req.body);
    //         const savedDistrict = await newDistrict.save();
    //         if(savedDistrict.province) {
    //             const province = Province.findById(req.body.province);
    //             await province.updateOne({$push: {districts: savedDistrict._id}});
    //         }
    //         res.status(200).json({status: 200, message: 'Add district successfully.', data: savedDistrict});
    //     } catch (err) {
    //         res.status(500).json(err);
    //     }
    // },

    getDistricts: async(req, res) => {
        try {
            // const districts = await District.find();
            // const items = [];
            // districts.forEach((district) => {
            //     const item = {
            //         'id': district._id,
            //         'name': district.name,
            //         'province': district.province
            //     }
            //     items.push(item);
            // });
            // res.status(200).json({status: 200, message: 'Get districts successfully.', data: items});
            const districts = pcVN.getDistricts();
            res.status(200).json({status: 200, message: 'Get districts successfully.', payload: districts});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getDistrictById: async(req, res) => {
        try {
            // const district = await District.findById(req.params.id);
            // const data = {
            //     'id': district._id,
            //     'name': district.name,
            //     'province': district.province
            // }
            // res.status(200).json({status: 200, message: 'Get district by id successfully.', data: data});
            const districts = pcVN.getDistricts();
            districts.forEach((item) => {
                if(item.code == req.body.code) {
                    const district = {
                        'code': item.code,
                        'name': item.name,
                        'unit': item.unit,
                        'province_code': item.province_code,
                        'province_name': item.province_name,
                        'full_name': item.full_name
                    }
                    res.status(200).json({status: 200, message: 'Get province by id successfully.', payload: district});
                }
            });       
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // updateInfoDistrict: async(req, res) => {
    //     try {
    //         const district = await District.findById(req.params.id);
    //         const updatedDistrict = await district.updateOne({$set: req.body});
    //         res.status(200).json({status: 200, message: 'Updated information of district successfully.', data: updatedDistrict});
    //     } catch (err) {
    //         res.status(500).json(err);
    //     }
    // },

    // deleteDistrict: async(req, res) => {
    //     try {
    //         await User.updateOne({district: req.params.id}, {$set: {district: null}});
    //         await Post.updateOne({district: req.params.id}, {$set: {district: null}});
    //         await Project.updateOne({district: req.params.id}, {$set: {district: null}});
    //         await Province.updateMany({districts: req.params.id}, {$pull: {districts: req.params.id}});
    //         const deletedDistrict = await District.findByIdAndDelete(req.params.id);
    //         res.status(200).json({status: 200, message: 'Deleted district successfully.', data: deletedDistrict});
    //     } catch (err) {
    //         res.status(500).json(err);
    //     }
    // },

    getDistrictsByProvince: async(req, res) => {
        try {
            // const districts = await District.find({province: req.params.id});
            // const items = [];
            // districts.forEach((district) => {
            //     const item = {
            //         'id': district._id,
            //         'name': district.name,
            //         'province': district.province
            //     }
            //     items.push(item);
            // });
            // res.status(200).json({status: 200, message: 'Get districts of province successfully.', data: items});
            const districts = pcVN.getDistrictsByProvinceCode(req.body.province);
            res.status(200).json({status: 200, message: 'Get districts of province successfully.', payload: districts});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = districtController;