const Category = require('../models/Category');

const categoryController = {
    addCategory: async(req, res) => {
        try {
            const newCategory = new Category(req.body);
            const savedCategory = await newCategory.save();
            res.status(200).json({status: 200, message: 'Thêm danh mục thành công.', payload: savedCategory});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getCategories: async(req, res) => {
        try {
            const categories = await Category.find();
            const items = [];
            categories.forEach((category) => {
                const item = {
                    'id': category._id,
                    'name': category.name
                }
                items.push(item);
            });
            res.status(200).json({status: 200, message: 'Lấy danh sách tất cả danh mục thành công.', payload: items});
        } catch (err) {
            res.status(500).json(err);
        }
    }, 

    getCategoryById: async(req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            const data = {
                'id': category._id,
                'name': category.name
            }
            res.status(200).json({status: 200, message: 'Lấy danh mục theo mã thành công.', payload: data});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoCategory: async(req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            const updatedCategory = await category.updateOne({$set: req.body});
            res.status(200).json({status: 200, message: 'Cập nhật thông tin danh mục thành công.', payload: updatedCategory});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = categoryController;