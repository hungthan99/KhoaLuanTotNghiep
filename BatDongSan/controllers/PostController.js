const Post = require('../models/Post');
const User = require('../models/User');
const PostType = require('../models/PostType');
const Province = require('../models/Province');
const Project = require('../models/Project');

const postController = {
    addPost: async(req, res) => {
        try {
            const newPost = new Post(req.body);
            const savedPost = await newPost.save();
            if(req.body.user) {
                const user = User.findById(req.body.user);
                await user.updateOne({$push: {posts: savedPost._id}});
            }
            if(req.body.postType) {
                const postType = PostType.findById(req.body.postType);
                await postType.updateOne({$push: {posts: savedPost._id}});
            }
            if(req.body.province) {
                const province = Province.findById(req.body.province);
                await province.updateOne({$push: {posts: savedPost._id}});
            }
            if(req.body.project) {
                const project = Project.findById(req.body.project);
                await project.updateOne({$push: {posts: savedPost._id}});
            }
            res.status(200).json(savedPost);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getPosts: async(req, res) => {
        try {
            const posts = await Post.find();
            res.status(200).json(posts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getPostById: async(req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            res.status(200).json(post);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoPost: async(req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            await post.updateOne({$set: req.body});
            res.status(200).json('Updated information of post successfully.');
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deletePost: async(req, res) => {
        try {
            await User.updateMany({posts: req.params.id}, {$pull: {posts: req.params.id}});
            await PostType.updateMany({posts: req.params.id}, {$pull: {posts: req.params.id}});
            await Project.updateMany({posts: req.params.id}, {$pull: {posts: req.params.id}});
            await Province.updateMany({posts: req.params.id}, {$pull: {posts: req.params.id}});
            await Post.findByIdAndDelete(req.params.id);
            res.status(200).json('Deleted post successfully.');
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updatePostStatus: async(req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            await post.updateOne({$set: {status: false}});
            res.status(200).json('Updated status of post successfully.');
        } catch (err) {
            res.status(500).json(err);
        }
    },

    findPost: async(req, res) => {
        try {
            const posts = await Post.find();
            const data = [];
            for (let i = 0; i < posts.length; i++) {
                if(posts[i].isSell == req.body.isSell || 
                    posts[i].realEstateType == req.body.realEstateType || 
                    posts[i].province == req.body.province || 
                    posts[i].district == req.body.district || 
                    posts[i].ward == req.body.ward || 
                    posts[i].price == req.body.price || 
                    posts[i].acreage == req.body.acreage || 
                    posts[i].bedroom == req.body.bedroom || 
                    posts[i].houseDirection == req.body.houseDirection || 
                    posts[i].project == req.body.project) {
                        data.push(posts[i]);
                }
            }
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = postController;