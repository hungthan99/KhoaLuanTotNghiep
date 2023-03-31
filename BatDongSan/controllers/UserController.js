const User = require('../models/User');
const Otp = require('../models/Otp');
const Post = require('../models/Post');

const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const userController = {
    sendOtp: async(req, res) => {
        try {
            const user = await User.findOne({phoneNumber: req.body.phoneNumber});
            if(user) {
                return res.status(404).json({status: 404, 'message': 'Phone number is registered!', payload: null});
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
            client.messages
                .create({ body: 'OTP Verification is: ' + OTP, from: process.env.TWILIO_PHONE_NUMBER, to: '+84' + phoneNumber })
                .then(data => {
                    return res.status(200).send({status: 200, message: 'Otp sent to SMS successfully.', payload: data});
                });
            // client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verifications
            //     .create({ to: '+84' + phoneNumber, channel: 'sms', body: 'OTP Verification is: ' + OTP })
            //     .then(data => {
            //         return res.status(200).send({status: 200, message: 'Otp sent to SMS successfully.', payload: data});
            //     });
            const otp = new Otp({phoneNumber: phoneNumber, otp: OTP});
            const salt = await bcrypt.genSalt(10);
            otp.otp = await bcrypt.hash(otp.otp, salt);
            await otp.save();
        } catch (err) {
            res.status(500).json(err);
        }
    },

    cofirmOtp: async(req, res) => {
        try {
            const otpHolder = await Otp.find({
                phoneNumber: req.body.phoneNumber,
            })
            if(otpHolder) {
                if(otpHolder.length === 0) return res.status(400).send({status: 400, message: 'Phone number is wrong!', payload: null});
            }
            if(otpHolder.length === 0) return res.status(400).send({status: 400, message: 'Otp is invalid!', payload: null});
            const rightOtpFind = otpHolder[otpHolder.length - 1];
            const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
            if(rightOtpFind.phoneNumber && req.body.phoneNumber && validUser) {
                res.status(200).json({status: 200, message: 'Otp is confirmed successfully.', payload: null});
            } else {
                return res.status(400).send({status: 400, message: 'OTP is wrong!', payload: null});
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    register: async(req, res) => {
        try {
            const otpHolder = await Otp.find({
                phoneNumber: req.body.phoneNumber,
            })
            if(otpHolder) {
                if(otpHolder.length === 0) return res.status(400).send({status: 400, message: 'Phone number is wrong!', payload: null});
            }
            if(otpHolder.length === 0) return res.status(400).send({status: 400, message: 'Otp is invalid!', payload: null});
            const rightOtpFind = otpHolder[otpHolder.length - 1];
            const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
            if(rightOtpFind.phoneNumber && req.body.phoneNumber && validUser) {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(req.body.password, salt);
                const newUser = new User({
                    phoneNumber: req.body.phoneNumber,
                    password: hashed
                })
                const token = userController.generateAccessToken(newUser);
                const refreshToken = userController.generateRefreshToken(newUser);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict'
                })
                const savedUser = await newUser.save();
                const loadData = {
                    'id': savedUser._id,
                    'name': savedUser.name,
                    'phoneNumber': savedUser.phoneNumber,
                    'password': savedUser.password,
                    'email': savedUser.email,
                    'dateOfBirth': savedUser.dateOfBirth,
                    'gender': savedUser.gender,
                    'identityCardNumber': savedUser.identityCardNumber,
                    'likePosts': savedUser.likePosts,
                    'token': token
                }
                await Otp.deleteMany({
                    phoneNumber: rightOtpFind.phoneNumber
                });
                res.status(200).json({status: 200, message: 'User is registered successfully.', payload: loadData});
            } else {
                return res.status(400).send({status: 400, message: 'OTP is wrong!', payload: null});
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    signIn: async(req, res) => {
        try {
            const user = await User.findOne({phoneNumber: req.body.phoneNumber});
            if(!user) {
                return res.status(404).json({status: 404, message: 'Phone number is wrong!', payload: null});
            }
            const password = await bcrypt.compare(
                req.body.password, user.password
            )
            if(!password) {
                return res.status(404).json({status: 404, message: 'Password is wrong!', payload: null});
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
            return res.status(200).json({status: 200, message: 'Sign in is successfully.', payload: loadData});
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
            return res.status(401).json({status: 401, message: 'User is not authentication!', payload: null});
        }
        jwt.verify(refreshTK, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({status: 403, 'message': 'RefreshToken is invalid!', payload: null});
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
        return res.status(200).json({status: 200, message: 'User is signed out successfully.', payload: null});
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
            return res.status(200).json({status: 200, message: 'Get all users successfully.', payload: items});
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
            return res.status(200).json({status: 200, message: 'Get user by id successfully.', payload: loadData});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoUser: async(req, res) => {
        try {
            const user = await User.findById(req.user.id);
            const updatedUser = await user.updateOne({$set: req.body});
            res.status(200).json({status: 200, message: 'Updated information of user successfully.', payload: null});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    likePost: async(req, res) => {
        try {
            const user = await User.findById(req.user.id);
            await user.updateOne({$push: {likePosts: req.params.id}});
            res.status(200).json({status: 200, message: 'Added this post on like posts successfully.', payload: null});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    dislikePost: async(req, res) => {
        try {
            const user = await User.findById(req.user.id);
            await user.updateOne({$pull: {likePosts: req.params.id}});
            res.status(200).json({status: 200, message: 'Removed this post from like posts successfully.', payload: null});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = userController;