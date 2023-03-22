const Category = require('../models/Category');

const categoryController = {
    addCategory: async(req, res) => {
        try {
            const newCategory = new Category(req.body);
            const savedCategory = await newCategory.save();
            res.status(200).json(savedCategory);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getCategories: async(req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
        } catch (err) {
            res.status(500).json(err);
        }
    }, 

    getCategoryById: async(req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            res.status(200).json(category);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoCategory: async(req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            await category.updateOne({$set: req.body});
            res.status(200).json('Updated information of category successfully.');
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = categoryController;