const Post = require('../models/Post');
const User = require('../models/User');
const PostType = require('../models/PostType');
const Province = require('../models/Province');
const Project = require('../models/Project');

const postController = {
    addPost: async(req, res) => {
        try {
            const newPost = new Post({
                    isSell: req.body.isSell,
                    realEstateType: req.body.realEstateType,
                    address: req.body.address,
                    price: req.body.price,
                    acreage: req.body.acreage,
                    bedroom: req.body.bedroom,
                    houseDirection: req.body.houseDirection,
                    lat: req.body.lat,
                    long: req.body.long,
                    title: req.body.title,
                    description: req.body.description,
                    legal: req.body.legal,
                    funiture: req.body.funiture,
                    bathroom: req.body.bathroom,
                    floor: req.body.floor,
                    balconyDirection: req.body.balconyDirection,
                    wayIn: req.body.wayIn,
                    facade: req.body.facade,
                    images: req.body.images,
                    contactName: req.body.contactName,
                    contactPhoneNumber: req.body.contactPhoneNumber,
                    province: req.body.province,
                    district: req.body.district,
                    ward: req.body.ward,
                    project: req.body.project,
                    user: req.user.id
            });
            const savedPost = await newPost.save();
            if(newPost.user) {
                const user = User.findById(req.body.user);
                await user.updateOne({$push: {posts: savedPost._id}});
            }
            if(newPost.postType) {
                const postType = PostType.findById(req.body.postType);
                await postType.updateOne({$push: {posts: savedPost._id}});
            }
            // if(newPost.province) {
            //     const province = Province.findById(req.body.province);
            //     await province.updateOne({$push: {posts: savedPost._id}});
            // }
            if(newPost.project) {
                const project = Project.findById(req.body.project);
                await project.updateOne({$push: {posts: savedPost._id}});
            }
            res.status(200).json({status: 200, message: 'Add post successfully.', data: null});
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    },

    getPosts: async(req, res) => {
        try {
            const posts = await Post.find();
            const user = await User.findById(req.user.id);
            const items = [];
            posts.forEach((post) => {
                const item = {
                    'id': post._id,
                    'isSell': post.isSell,
                    'realEstateType': post.realEstateType,
                    'address': post.address,
                    'price': post.price,
                    'acreage': post.acreage,
                    'bedroom': post.bedroom,
                    'houseDirection': post.houseDirection,
                    'lat': post.lat,
                    'long': post.long,
                    'title': post.title,
                    'description': post.description,
                    'legal': post.legal,
                    'funiture': post.funiture,
                    'bathroom': post.bathroom,
                    'floor': post.floor,
                    'balconyDirection': post.balconyDirection,
                    'wayIn': post.wayIn,
                    'facade': post.facade,
                    'images': post.images,
                    'contactName': post.contactName,
                    'contactNumber': post.contactNumber,
                    'province': post.province,
                    'district': post.district,
                    'ward': post.ward,
                    'project': post.project,
                    'username': user.name
                }
                items.push(item);
            });
            res.status(200).json({status: 200, message: 'Get posts successfully.', data: items});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getPostById: async(req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            const user = await User.findById(req.user.id);
            const data = {
                'id': post._id,
                'isSell': post.isSell,
                'realEstateType': post.realEstateType,
                'address': post.address,
                'price': post.price,
                'acreage': post.acreage,
                'bedroom': post.bedroom,
                'houseDirection': post.houseDirection,
                'lat': post.lat,
                'long': post.long,
                'title': post.title,
                'description': post.description,
                'legal': post.legal,
                'funiture': post.funiture,
                'bathroom': post.bathroom,
                'floor': post.floor,
                'balconyDirection': post.balconyDirection,
                'wayIn': post.wayIn,
                'facade': post.facade,
                'images': post.images,
                'contactName': post.contactName,
                'contactNumber': post.contactNumber,
                'province': post.province,
                'district': post.district,
                'ward': post.ward,
                'project': post.project,
                'username': user.name
            }
            res.status(200).json({status: 200, message: 'Get post by id successfully.', data: data});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoPost: async(req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            await post.updateOne({$set: req.body});
            res.status(200).json({status: 200, message: 'Updated information of post successfully.', data: null});
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
            const deletedPost = await Post.findByIdAndDelete(req.params.id);
            res.status(200).json({status: 200, message: 'Deleted post successfully.', data: deletedPost});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updatePostStatus: async(req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            const updatedPost =  await post.updateOne({$set: {status: false}});
            res.status(200).json({status: 200, message: 'Updated status of post successfully.', data: updatedPost});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    findPost: async(req, res) => {
        try {
            const posts = await Post.find(req.body);
            const data = [];
            posts.forEach((post) => {
                const item = {
                    'id': post._id,
                    'isSell': post.isSell,
                    'realEstateType': post.realEstateType,
                    'address': post.address,
                    'price': post.price,
                    'acreage': post.acreage,
                    'bedroom': post.bedroom,
                    'houseDirection': post.houseDirection,
                    'province': post.province,
                    'district': post.district,
                    'ward': post.ward,
                    'project': post.project
                }
                data.push(item);
            });
            res.status(200).json({status: 200, message: 'Find list post by information applied successfully.', data: data});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = postController;