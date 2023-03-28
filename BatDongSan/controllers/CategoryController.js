const Category = require('../models/Category');

const categoryController = {
    addCategory: async(req, res) => {
        try {
            const newCategory = new Category(req.body);
            const savedCategory = await newCategory.save();
            res.status(200).json({status: 200, message: 'Add category successfully.', payload: savedCategory});
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
            res.status(200).json({status: 200, message: 'Get categories successfully.', payload: items});
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
            res.status(200).json({status: 200, message: 'Get category by id successfully.', payload: data});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoCategory: async(req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            const updatedCategory = await category.updateOne({$set: req.body});
            res.status(200).json({status: 200, message: 'Updated information of category successfully.', payload: updatedCategory});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = categoryController;