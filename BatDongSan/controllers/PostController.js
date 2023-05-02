const Post = require('../models/Post');
const User = require('../models/User');
const Project = require('../models/Project');

const dotenv = require('dotenv');

dotenv.config();

const limit = process.env.PAGE_SIZE_FOR_POST;

const postController = {
    addPost: async (req, res) => {
        try {
            const newPost = new Post({
                isSell: req.body.isSell,
                realEstateType: req.body.realEstateType,
                address: req.body.address,
                price: req.body.price,
                priceRange: req.body.priceRange,
                acreage: req.body.acreage,
                acreageRange: req.body.acreageRange,
                bedroom: req.body.bedroom,
                bedroomRange: req.body.bedroomRange,
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
                provinceCode: req.body.provinceCode,
                districtCode: req.body.districtCode,
                wardCode: req.body.wardCode,
                provinceName: req.body.provinceName,
                districtName: req.body.districtName,
                wardName: req.body.wardName,
                project: req.body.project,
                user: req.user.id
            });
            const savedPost = await newPost.save();
            if (newPost.user) {
                const user = User.findById(req.body.user);
                await user.updateOne({ $push: { posts: savedPost._id } });
            }
            if (newPost.project) {
                const project = Project.findById(req.body.project);
                await project.updateOne({ $push: { posts: savedPost._id } });
            }
            res.status(200).json({ status: 200, message: 'Thêm bài đăng thành công.', payload: null });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getPosts: async (req, res) => {
        try {
            let page = req.query.page;
            if (page) {
                page = parseInt(page);
                let skip = (page - 1) * limit;
                const posts = await Post.find().sort({createdAt: -1}).skip(skip).limit(limit);
                const items = [];
                for (const i in posts) {
                    const item = {
                        'id': posts[i]._id,
                        'isSell': posts[i].isSell,
                        'realEstateType': posts[i].realEstateType,
                        'address': posts[i].address,
                        'price': posts[i].price,
                        'acreage': posts[i].acreage,
                        'bedroom': posts[i].bedroom,
                        'houseDirection': posts[i].houseDirection,
                        'lat': posts[i].lat,
                        'long': posts[i].long,
                        'title': posts[i].title,
                        'description': posts[i].description,
                        'legal': posts[i].legal,
                        'funiture': posts[i].funiture,
                        'bathroom': posts[i].bathroom,
                        'floor': posts[i].floor,
                        'balconyDirection': posts[i].balconyDirection,
                        'wayIn': posts[i].wayIn,
                        'facade': posts[i].facade,
                        'images': posts[i].images,
                        'contactName': posts[i].contactName,
                        'contactPhoneNumber': posts[i].contactPhoneNumber,
                        'status': posts[i].status,
                        'provinceCode': posts[i].provinceCode,
                        'districtCode': posts[i].districtCode,
                        'wardCode': posts[i].wardCode,
                        'provinceName': posts[i].provinceName,
                        'districtName': posts[i].districtName,
                        'wardName': posts[i].wardName,
                        'project': posts[i].project,
                        'userId': posts[i].user,
                        'createdAt': posts[i].createdAt.getTime()
                    }
                    items.push(item);
                }
                res.status(200).json({ status: 200, message: 'Lấy danh sách tất cả bài đăng thành công.', payload: items });
            } else {
                const posts = await Post.find().sort({createdAt: -1});
                const items = [];
                for (const i in posts) {
                    const item = {
                        'id': posts[i]._id,
                        'isSell': posts[i].isSell,
                        'realEstateType': posts[i].realEstateType,
                        'address': posts[i].address,
                        'price': posts[i].price,
                        'acreage': posts[i].acreage,
                        'bedroom': posts[i].bedroom,
                        'houseDirection': posts[i].houseDirection,
                        'lat': posts[i].lat,
                        'long': posts[i].long,
                        'title': posts[i].title,
                        'description': posts[i].description,
                        'legal': posts[i].legal,
                        'funiture': posts[i].funiture,
                        'bathroom': posts[i].bathroom,
                        'floor': posts[i].floor,
                        'balconyDirection': posts[i].balconyDirection,
                        'wayIn': posts[i].wayIn,
                        'facade': posts[i].facade,
                        'images': posts[i].images,
                        'contactName': posts[i].contactName,
                        'contactPhoneNumber': posts[i].contactPhoneNumber,
                        'status': posts[i].status,
                        'provinceCode': posts[i].provinceCode,
                        'districtCode': posts[i].districtCode,
                        'wardCode': posts[i].wardCode,
                        'provinceName': posts[i].provinceName,
                        'districtName': posts[i].districtName,
                        'wardName': posts[i].wardName,
                        'project': posts[i].project,
                        'userId': posts[i].user,
                        'createdAt': posts[i].createdAt.getTime()
                    }
                    items.push(item);
                }
                res.status(200).json({ status: 200, message: 'Lấy danh sách tất cả bài đăng thành công.', payload: items });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getPostsByUser: async (req, res) => {
        try {
            let page = req.query.page;
            const userSignIn = await User.findById(req.user.id);
            const userSearch = await User.findById(req.params.id);
            if (page) {
                page = parseInt(page);
                let skip = (page - 1) * limit;
                let items = [];
                if(userSignIn == userSearch) {
                    const posts = await Post.find({ user: req.params.id, $or: [{status: 0}, {status: 1}]}).sort({createdAt: -1}).skip(skip).limit(limit);
                    for (const i in posts) {
                        const user = await User.findById(posts[i].user);
                        const item = {
                            'id': posts[i]._id,
                            'isSell': posts[i].isSell,
                            'address': posts[i].address,
                            'price': posts[i].price,
                            'lat': posts[i].lat,
                            'long': posts[i].long,
                            'title': posts[i].title,
                            'thumbnail': posts[i].images[0],
                            'status': posts[i].status,
                            'browseStatus': posts[i].browseStatus,
                            'provinceCode': posts[i].provinceCode,
                            'districtCode': posts[i].districtCode,
                            'wardCode': posts[i].wardCode,
                            'provinceName': posts[i].provinceName,
                            'districtName': posts[i].districtName,
                            'wardName': posts[i].wardName,
                            'acreage': posts[i].acreage,
                            'userName': user.name,
                            'userId': posts[i].user,
                            'createdAt': posts[i].createdAt.getTime()
                        }
                        items.push(item);
                    }
                } else {
                    const posts = await Post.find({ user: req.params.id, status: 0 }).sort({createdAt: -1}).skip(skip).limit(limit);
                    for (const i in posts) {
                        const user = await User.findById(posts[i].user);
                        const item = {
                            'id': posts[i]._id,
                            'isSell': posts[i].isSell,
                            'address': posts[i].address,
                            'price': posts[i].price,
                            'lat': posts[i].lat,
                            'long': posts[i].long,
                            'title': posts[i].title,
                            'thumbnail': posts[i].images[0],
                            'status': posts[i].status,
                            'browseStatus': posts[i].browseStatus,
                            'provinceCode': posts[i].provinceCode,
                            'districtCode': posts[i].districtCode,
                            'wardCode': posts[i].wardCode,
                            'provinceName': posts[i].provinceName,
                            'districtName': posts[i].districtName,
                            'wardName': posts[i].wardName,
                            'acreage': posts[i].acreage,
                            'userName': user.name,
                            'userId': posts[i].user,
                            'createdAt': posts[i].createdAt.getTime()
                        }
                        items.push(item);
                    }
                }
                res.status(200).json({ status: 200, message: 'Lấy danh sách bài đăng theo tài khoản thành công.', payload: items });
            } else {
                let items = [];
                if(userSignIn == userSearch) {
                    const posts = await Post.find({ user: req.params.id, $or: [{status: 0}, {status: 1}] }).sort({createdAt: -1});
                    for (const i in posts) {
                        const user = await User.findById(posts[i].user);
                        const item = {
                            'id': posts[i]._id,
                            'isSell': posts[i].isSell,
                            'address': posts[i].address,
                            'price': posts[i].price,
                            'lat': posts[i].lat,
                            'long': posts[i].long,
                            'title': posts[i].title,
                            'thumbnail': posts[i].images[0],
                            'status': posts[i].status,
                            'browseStatus': posts[i].browseStatus,
                            'provinceCode': posts[i].provinceCode,
                            'districtCode': posts[i].districtCode,
                            'wardCode': posts[i].wardCode,
                            'provinceName': posts[i].provinceName,
                            'districtName': posts[i].districtName,
                            'wardName': posts[i].wardName,
                            'acreage': posts[i].acreage,
                            'userName': user.name,
                            'userId': posts[i].user,
                            'createdAt': posts[i].createdAt.getTime()
                        }
                        items.push(item);
                    }
                } else {
                    const posts = await Post.find({ user: req.params.id, status: 0 }).sort({createdAt: -1});
                    for (const i in posts) {
                        const user = await User.findById(posts[i].user);
                        const item = {
                            'id': posts[i]._id,
                            'isSell': posts[i].isSell,
                            'address': posts[i].address,
                            'price': posts[i].price,
                            'lat': posts[i].lat,
                            'long': posts[i].long,
                            'title': posts[i].title,
                            'thumbnail': posts[i].images[0],
                            'status': posts[i].status,
                            'browseStatus': posts[i].browseStatus,
                            'provinceCode': posts[i].provinceCode,
                            'districtCode': posts[i].districtCode,
                            'wardCode': posts[i].wardCode,
                            'provinceName': posts[i].provinceName,
                            'districtName': posts[i].districtName,
                            'wardName': posts[i].wardName,
                            'acreage': posts[i].acreage,
                            'userName': user.name,
                            'userId': posts[i].user,
                            'createdAt': posts[i].createdAt.getTime()
                        }
                        items.push(item);
                    }
                }
                res.status(200).json({ status: 200, message: 'Lấy danh sách bài đăng theo tài khoản thành công.', payload: items });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getPostsByLikePosts: async (req, res) => {
        try {
            let page = req.query.page;
            const user = await User.findById(req.user.id);
            const likePosts = user.likePosts;
            const posts = [];
            if (page) {
                page = parseInt(page);
                let skip = (page - 1) * limit;
                let from = limit;
                for (const i in likePosts) {
                    const post = await Post.findById(likePosts[i]);
                    posts.push(post);
                }
                const items = [];
                if (skip > 0) from = from + skip;
                const lsPost = posts.slice(skip, from).sort((a, b) => {
                    return a.createdAt.getTime() - b.createdAt.getTime();
                });
                for (const i in lsPost) {
                    const user = await User.findById(lsPost[i].user);
                    const item = {
                        'id': lsPost[i]._id,
                        'isSell': lsPost[i].isSell,
                        'address': lsPost[i].address,
                        'price': lsPost[i].price,
                        'lat': lsPost[i].lat,
                        'long': lsPost[i].long,
                        'title': lsPost[i].title,
                        'thumbnail': lsPost[i].images[0],
                        'provinceCode': lsPost[i].provinceCode,
                        'districtCode': lsPost[i].districtCode,
                        'wardCode': lsPost[i].wardCode,
                        'provinceName': lsPost[i].provinceName,
                        'districtName': lsPost[i].districtName,
                        'wardName': lsPost[i].wardName,
                        'acreage': lsPost[i].acreage,
                        'userName': user.name,
                        'userId': user.id,
                        'createdAt': lsPost[i].createdAt.getTime()
                    }
                    items.push(item);
                }
                res.status(200).json({ status: 200, message: 'Lấy danh sách bài đăng trong danh sách yêu thích thành công.', payload: items });
            } else {
                for (const i in likePosts) {
                    const post = await Post.findById(likePosts[i]);
                    posts.push(post);
                }
                posts.sort((a, b) => {
                    return a.createdAt.getTime(), b.createdAt.getTime();
                })
                const items = [];
                for (const i in posts) {
                    const user = await User.findById(posts[i].user);
                    const item = {
                        'id': posts[i]._id,
                        'isSell': posts[i].isSell,
                        'address': posts[i].address,
                        'price': posts[i].price,
                        'lat': posts[i].lat,
                        'long': posts[i].long,
                        'title': posts[i].title,
                        'thumbnail': posts[i].images[0],
                        'provinceCode': posts[i].provinceCode,
                        'districtCode': posts[i].districtCode,
                        'wardCode': posts[i].wardCode,
                        'provinceName': posts[i].provinceName,
                        'districtName': posts[i].districtName,
                        'wardName': posts[i].wardName,
                        'acreage': posts[i].acreage,
                        'userName': user.name,
                        'userId': user.id,
                        'createdAt': posts[i].createdAt.getTime()
                    }
                    items.push(item);
                }
                res.status(200).json({ status: 200, message: 'Lấy danh sách bài đăng trong danh sách yêu thích thành công.', payload: items });
            }
        } catch (err) {
            console.log("---> err", err);
            res.status(500).json(err);
        }
    },

    getPostsByIsSell: async (req, res) => {
        try {
            let page = req.query.page;
            let isSell = req.body.isSell;
            let items = [];
            if (page) {
                page = parseInt(page);
                let skip = (page - 1) * limit;
                const posts = await Post.find({ isSell: isSell }).sort({createdAt: -1}).skip(skip).limit(limit);
                for (const i in posts) {
                    const user = await User.findById(posts[i].user);
                    const item = {
                        'id': posts[i]._id,
                        'isSell': posts[i].isSell,
                        'address': posts[i].address,
                        'price': posts[i].price,
                        'lat': posts[i].lat,
                        'long': posts[i].long,
                        'title': posts[i].title,
                        'thumbnail': posts[i].images[0],
                        'acreage': posts[i].acreage,
                        'provinceCode': posts[i].provinceCode,
                        'districtCode': posts[i].districtCode,
                        'wardCode': posts[i].wardCode,
                        'provinceName': posts[i].provinceName,
                        'districtName': posts[i].districtName,
                        'wardName': posts[i].wardName,
                        'userName': user.name,
                        'userId': user.id,
                        'createdAt': posts[i].createdAt.getTime()
                    }
                    items.push(item);
                }
                res.status(200).json({ status: 200, message: 'Lấy danh sách bài đăng theo trạng thái đã bán hay chưa thành công.', payload: items });
            } else {
                const posts = await Post.find({ isSell: isSell }).sort({createdAt: -1});
                for (const i in posts) {
                    const user = await User.findById(posts[i].user);
                    const item = {
                        'id': posts[i]._id,
                        'isSell': posts[i].isSell,
                        'address': posts[i].address,
                        'price': posts[i].price,
                        'lat': posts[i].lat,
                        'long': posts[i].long,
                        'title': posts[i].title,
                        'thumbnail': posts[i].images[0],
                        'acreage': posts[i].acreage,
                        'provinceCode': posts[i].provinceCode,
                        'districtCode': posts[i].districtCode,
                        'wardCode': posts[i].wardCode,
                        'provinceName': posts[i].provinceName,
                        'districtName': posts[i].districtName,
                        'wardName': posts[i].wardName,
                        'userName': user.name,
                        'userId': user.id,
                        'createdAt': posts[i].createdAt.getTime()
                    }
                    items.push(item);
                }
                res.status(200).json({ status: 200, message: 'Lấy danh sách bài đăng theo trạng thái đã bán hay chưa thành công.', payload: items });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getPostById: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            const user = await User.findById(post.user);
            const project = await Project.findById(post.project);
            let data = {};
            if(project) {
                data = {
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
                    'contactPhoneNumber': post.contactPhoneNumber,
                    'status': post.status,
                    'provinceCode': post.provinceCode,
                    'districtCode': post.districtCode,
                    'wardCode': post.wardCode,
                    'provinceName': post.provinceName,
                    'districtName': post.districtName,
                    'wardName': post.wardName,
                    'project': post.project,
                    'projectName': project.name,
                    'userName': user.name,
                    'userId': post.user,
                    'createdAt': post.createdAt.getTime()
                }
            } else {
                data = {
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
                    'contactPhoneNumber': post.contactPhoneNumber,
                    'status': post.status,
                    'provinceCode': post.provinceCode,
                    'districtCode': post.districtCode,
                    'wardCode': post.wardCode,
                    'provinceName': post.provinceName,
                    'districtName': post.districtName,
                    'wardName': post.wardName,
                    'userName': user.name,
                    'userId': post.user,
                    'createdAt': post.createdAt.getTime()
                }
            }
            res.status(200).json({ status: 200, message: 'Lấy thông tin bài đăng theo mã thành công.', payload: data });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoPost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            await post.updateOne({ $set: req.body });
            res.status(200).json({ status: 200, message: 'Cập nhật thông tin bài đăng thành công.', payload: null });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deletePost: async (req, res) => {
        try {
            await User.updateMany({ posts: req.params.id }, { $pull: { posts: req.params.id } });
            await User.updateMany({ likePosts: req.params.id }, { $pull: { likePosts: req.params.id } });
            await Project.updateMany({ posts: req.params.id }, { $pull: { posts: req.params.id } });
            await Post.findByIdAndDelete(req.params.id);
            res.status(200).json({ status: 200, message: 'Đã xóa bài đăng thành công.', payload: null });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // updatePostStatus: async (req, res) => {
    //     try {
    //         const post = await Post.findById(req.params.id);
    //         if (post.status == true) {
    //             await post.updateOne({ $set: { status: false } });
    //         } else {
    //             await post.updateOne({ $set: { status: true } });
    //         }
    //         res.status(200).json({ status: 200, message: 'Cập nhật trạng thái bài đăng thành công.', payload: null });
    //     } catch (err) {
    //         res.status(500).json(err);
    //     }
    // },

    findPost: async (req, res) => {
        try {
            let page = req.query.page;
            if (page) {
                page = parseInt(page);
                let skip = (page - 1) * limit;
                const posts = await Post.find(req.body).sort({createdAt: -1}).skip(skip).limit(limit);
                const data = [];
                for (const i in posts) {
                    const user = await User.findById(posts[i].user);
                    const item = {
                        'id': posts[i]._id,
                        'isSell': posts[i].isSell,
                        'address': posts[i].address,
                        'price': posts[i].price,
                        'lat': posts[i].lat,
                        'long': posts[i].long,
                        'title': posts[i].title,
                        'thumbnail': posts[i].images[0],
                        'acreage': posts[i].acreage,
                        'provinceCode': posts[i].provinceCode,
                        'districtCode': posts[i].districtCode,
                        'wardCode': posts[i].wardCode,
                        'provinceName': posts[i].provinceName,
                        'districtName': posts[i].districtName,
                        'wardName': posts[i].wardName,
                        'userName': user.name,
                        'userId': user.id,
                        'createdAt': posts[i].createdAt.getTime()
                    }
                    data.push(item);
                }
                res.status(200).json({ status: 200, message: 'Lọc danh sách bài đăng theo thông tin đã được cung cấp thành công.', payload: data });
            } else {
                const posts = await Post.find(req.body).sort({createdAt: -1});
                const data = [];
                for (const i in posts) {
                    const user = await User.findById(posts[i].user);
                    const item = {
                        'id': posts[i]._id,
                        'isSell': posts[i].isSell,
                        'address': posts[i].address,
                        'price': posts[i].price,
                        'lat': posts[i].lat,
                        'long': posts[i].long,
                        'title': posts[i].title,
                        'thumbnail': posts[i].images[0],
                        'acreage': posts[i].acreage,
                        'provinceCode': posts[i].provinceCode,
                        'districtCode': posts[i].districtCode,
                        'wardCode': posts[i].wardCode,
                        'provinceName': posts[i].provinceName,
                        'districtName': posts[i].districtName,
                        'wardName': posts[i].wardName,
                        'userName': user.name,
                        'userId': user.id,
                        'createdAt': posts[i].createdAt.getTime()
                    }
                    data.push(item);
                }
                res.status(200).json({ status: 200, message: 'Lọc danh sách bài đăng theo thông tin đã được cung cấp thành công.', payload: data });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    searchByKeyWord: async(req, res) => {
        try {
            let page = req.query.page;
            if(page) {
                page = parseInt(page);
                let skip = (page - 1) * limit;
                const search = req.body.keyword + '';
                const regex = new RegExp(`${search}`, 'i');
                const posts = await Post.find({
                    $or: [ 
                        { address: {$regex: regex} }
                    ]
                }).skip(skip).limit(limit);
                const data = [];
                for (const i in posts) {
                    const user = await User.findById(posts[i].user);
                    const item = {
                        'id': posts[i]._id,
                        'isSell': posts[i].isSell,
                        'address': posts[i].address,
                        'price': posts[i].price,
                        'lat': posts[i].lat,
                        'long': posts[i].long,
                        'title': posts[i].title,
                        'thumbnail': posts[i].images[0],
                        'acreage': posts[i].acreage,
                        'provinceCode': posts[i].provinceCode,
                        'districtCode': posts[i].districtCode,
                        'wardCode': posts[i].wardCode,
                        'provinceName': posts[i].provinceName,
                        'districtName': posts[i].districtName,
                        'wardName': posts[i].wardName,
                        'userName': user.name,
                        'userId': user.id,
                        'createdAt': posts[i].createdAt.getTime()
                    }
                    data.push(item);
                }
                res.status(200).json({ status: 200, message: 'Lọc danh sách bài đăng theo thông tin đã được cung cấp thành công.', payload: data });
            } else {
                const search = req.body.keyword + '';
                const regex = new RegExp(`${search}`, 'i');
                const posts = await Post.find({
                    $or: [ 
                        { address: {$regex: regex} }
                    ]
                });
                const data = [];
                for (const i in posts) {
                    const user = await User.findById(posts[i].user);
                    const item = {
                        'id': posts[i]._id,
                        'isSell': posts[i].isSell,
                        'address': posts[i].address,
                        'price': posts[i].price,
                        'lat': posts[i].lat,
                        'long': posts[i].long,
                        'title': posts[i].title,
                        'thumbnail': posts[i].images[0],
                        'acreage': posts[i].acreage,
                        'provinceCode': posts[i].provinceCode,
                        'districtCode': posts[i].districtCode,
                        'wardCode': posts[i].wardCode,
                        'provinceName': posts[i].provinceName,
                        'districtName': posts[i].districtName,
                        'wardName': posts[i].wardName,
                        'userName': user.name,
                        'userId': user.id,
                        'createdAt': posts[i].createdAt.getTime()
                    }
                    data.push(item);
                }
                res.status(200).json({ status: 200, message: 'Lọc danh sách bài đăng theo thông tin đã được cung cấp thành công.', payload: data });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = postController;