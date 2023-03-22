const PostType = require('../models/PostType');
const Category = require('../models/Category');

const postTypeController = {
    addPostType: async(req, res) => {
        try {
            const newPostType = new PostType(req.body);
            const savedPostType = await newPostType.save();
            if(req.body.category) {
                const category = Category.findById(req.body.category);
                await category.updateOne({$push: {postTypes: savedPostType._id}});
            }
            res.status(200).json(savedPostType);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getPostTypes: async(req, res) => {
        try {
            const postTypes = await PostType.find();
            res.status(200).json(postTypes);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getPostTypeById: async(req, res) => {
        try {
            const postType = await PostType.findById(req.params.id);
            res.status(200).json(postType);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoPostType: async(req, res) => {
        try {
            const postType = await PostType.findById(req.params.id);
            await postType.updateOne({$set: req.body});
            res.status(200).json('Updated information of posttype successfully.');
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = postTypeController;