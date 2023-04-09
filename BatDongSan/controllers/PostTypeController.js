const PostType = require('../models/PostType');
const Category = require('../models/Category');

const postTypeController = {
    addPostType: async(req, res) => {
        try {
            const newPostType = new PostType(req.body);
            const savedPostType = await newPostType.save();
            if(savedPostType.category) {
                const category = Category.findById(req.body.category);
                await category.updateOne({$push: {postTypes: savedPostType._id}});
            }
            res.status(200).json({status: 200, message: 'Thêm loại bài đăng thành công.', payload: savedPostType});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getPostTypes: async(req, res) => {
        try {
            const postTypes = await PostType.find();
            const items = [];
            postTypes.forEach((postType) => {
                const item = {
                    'id': postType._id,
                    'name': postType.name,
                    'category': postType.category
                }
                items.push(item);
            });
            res.status(200).json({status: 200, message: 'Lấy danh sách tất cả loại bài đăng thành công.', payload: items});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getPostTypeById: async(req, res) => {
        try {
            const postType = await PostType.findById(req.params.id);
            const data = {
                'id': postType._id,
                'name': postType.name,
                'category': postType.category
            }
            res.status(200).json({status: 200, message: 'Lấy bài đăng theo mã thành công.', payload: data});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoPostType: async(req, res) => {
        try {
            const postType = await PostType.findById(req.params.id);
            updatedPostType = await postType.updateOne({$set: req.body});
            res.status(200).json({status: 200, message: 'Cập nhật thông tin loại bài đăng thành công.', payload: updatedPostType});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = postTypeController;