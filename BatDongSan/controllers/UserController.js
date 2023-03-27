const User = require('../models/User');
const Otp = require('../models/Otp');
const Post = require('../models/Post');

const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userController = {
    register: async(req, res) => {
        try {
            const user = await User.findOne({phoneNumber: req.body.phoneNumber});
            if(user) {
                return res.status(404).json({status: 404, 'message': 'Phone number is registered!'});
            }
            const OTP = otpGenerator.generate(6, {
                digit: true,
                alphabets: false,
                upperCase: false,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
            console.log(OTP);
            const phoneNumber = req.body.phoneNumber;
            const otp = new Otp({phoneNumber: phoneNumber, otp: OTP});
            const salt = await bcrypt.genSalt(10);
            otp.otp = await bcrypt.hash(otp.otp, salt);
            await otp.save();
            return res.status(200).send({status: 200, message: 'Otp sent to SMS successfully.', data: null});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    cofirmOtp: async(req, res) => {
        const otpHolder = await Otp.find({
            phoneNumber: req.body.phoneNumber,
        })
        if(otpHolder.length === 0) return res.status(400).send({status: 400, message: 'Otp is invalid!', data: null});
        const rightOtpFind = otpHolder[otpHolder.length - 1];
        const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
        if(rightOtpFind.phoneNumber && req.body.phoneNumber && validUser) {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                phoneNumber: req.body.phoneNumber,
                password: hashed
            })
            const savedUser = await newUser.save();
            await Otp.deleteMany({
                phoneNumber: rightOtpFind.phoneNumber
            });
            res.status(200).json({status: 200, message: 'User is registered successfully.', data: savedUser});
        } else {
            return res.status(400).send({status: 400, message: 'OTP is wrong!', data: null});
        }
    },

    signIn: async(req, res) => {
        try {
            const user = await User.findOne({phoneNumber: req.body.phoneNumber});
            if(!user) {
                return res.status(404).json({status: 404, message: 'Phone number is wrong!', data: null});
            }
            const password = await bcrypt.compare(
                req.body.password, user.password
            )
            if(!password) {
                return res.status(404).json({status: 404, message: 'Password is wrong!', data: null});
            }
            const token = userController.generateAccessToken(user);
            const refreshToken = userController.generateRefreshToken(user);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict'
            })
            const loadData = {
                'id': user._id,
                'name': user.name,
                'phoneNumber': user.phoneNumber,
                'password': user.password,
                'email': user.email,
                'dateOfBirth': user.dateOfBirth,
                'gender': user.gender,
                'identityCardNumber': user.identityCardNumber,
                'likePosts': user.likePosts,
                'token': token
            }
            return res.status(200).json({status: 200, message: 'Sign in is successfully.', data: loadData});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "30d" }
        );
    },

    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "180d" }
        );
    },

    requestRefreshToken: async (req, res) => {
        const refreshTK = req.cookies.refreshToken;
        if (!refreshTK) {
            return res.status(401).json({status: 401, message: 'User is not authentication!', data: null});
        }
        jwt.verify(refreshTK, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({status: 403, 'message': 'RefreshToken is invalid!'});
            }
            const newAccessToken = userController.generateAccessToken(user);
            const newRefreshToken = userController.generateRefreshToken(user);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            return res.status(200).json({'statusCode': 200, 'message': 'Token is refreshed successfully.', 'newAccessToken': newAccessToken});
        })
    },

    signOut: async(req, res) => {
        res.clearCookie('refreshToken');
        return res.status(200).json({status: 200, message: 'User is signed out successfully.', data: null});
    },

    getUsers: async(req, res) => {
        try {
            const users = await User.find();
            const items = [];
            users.forEach((user) => {
                const item = {
                    'id': user._id,
                    'name': user.name,
                    'phoneNumber': user.phoneNumber,
                    'password': user.password,
                    'email': user.email,
                    'dateOfBirth': user.dateOfBirth,
                    'gender': user.gender,
                    'identityCardNumber': user.identityCardNumber,
                    'likePosts': user.likePosts
                }
                items.push(item);
            });
            return res.status(200).json({status: 200, message: 'Get all users successfully.', data: items});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getUserById: async(req, res) => {
        try {
            const user = await User.findById(req.params.id);
            const loadData = {
                'id': user._id,
                'name': user.name,
                'phoneNumber': user.phoneNumber,
                'password': user.password,
                'email': user.email,
                'dateOfBirth': user.dateOfBirth,
                'gender': user.gender,
                'identityCardNumber': user.identityCardNumber
            }
            return res.status(200).json({status: 200, message: 'Get user by id successfully.', data: loadData});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoUser: async(req, res) => {
        try {
            const user = await User.findById(req.params.id);
            const updatedUser = await user.updateOne({$set: req.body});
            res.status(200).json({status: 200, message: 'Updated information of user successfully.', data: null});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    likePost: async(req, res) => {
        try {
            const user = await User.findById(req.user.id);
            await user.updateOne({$push: {likePosts: req.params.id}});
            res.status(200).json({status: 200, message: 'Added this post on like posts successfully.', data: null});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    dislikePost: async(req, res) => {
        try {
            const user = await User.findById(req.user.id);
            await user.updateOne({$pull: {likePosts: req.params.id}});
            res.status(200).json({status: 200, message: 'Removed this post from like posts successfully.', data: null});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = userController;