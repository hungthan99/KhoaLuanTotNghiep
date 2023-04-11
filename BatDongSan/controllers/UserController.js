const User = require('../models/User');
const Otp = require('../models/Otp');
const Post = require('../models/Post');

const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: process.env.NEXMO_KEY,
  apiSecret: process.env.NEXMO_SECRET
})

async function sendSMS(to, from, text) {
    await vonage.sms.send({to, from, text})
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
}

const userController = {
    sendOtpForRegister: async (req, res) => {
        try {
            const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
            if (user) {
                return res.status(404).json({ status: 404, 'message': 'Số điện thoại đã được đăng ký!', payload: null });
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
            sendSMS('84' + req.body.phoneNumber, 'Vonage APIs', OTP);
            const phoneNumber = req.body.phoneNumber;
            const otp = new Otp({ phoneNumber: phoneNumber, otp: OTP });
            const salt = await bcrypt.genSalt(10);
            otp.otp = await bcrypt.hash(otp.otp, salt);
            await otp.save();
            return res.status(200).send({ status: 200, message: 'Mã otp đã được gửi tới sms cho việc đăng ký.', payload: null });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    sendOtpForResetPassword: async (req, res) => {
        try {
            const OTP = otpGenerator.generate(6, {
                digit: true,
                alphabets: false,
                upperCase: false,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
            console.log(OTP);
            sendSMS('84' + req.body.phoneNumber, 'Vonage APIs', OTP);
            const phoneNumber = req.body.phoneNumber;
            const otp = new Otp({ phoneNumber: phoneNumber, otp: OTP });
            const salt = await bcrypt.genSalt(10);
            otp.otp = await bcrypt.hash(otp.otp, salt);
            await otp.save();
            return res.status(200).send({ status: 200, message: 'Mã otp đã được gửi tới sms cho việc đổi mật khẩu.', payload: null });

        } catch (err) {
            res.status(500).json(err);
        }
    },

    cofirmOtp: async (req, res) => {
        try {
            const otpHolder = await Otp.find({
                phoneNumber: req.body.phoneNumber,
            })
            if (otpHolder) {
                if (otpHolder.length === 0) return res.status(400).send({ status: 400, message: 'Sai số điện thoại!', payload: null });
            }
            if (otpHolder.length === 0) return res.status(400).send({ status: 400, message: 'Mã otp đã hết hạn!', payload: null });
            const rightOtpFind = otpHolder[otpHolder.length - 1];
            const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
            if (rightOtpFind.phoneNumber && req.body.phoneNumber && validUser) {
                res.status(200).json({ status: 200, message: 'Xác thực mã otp thành công.', payload: null });
            } else {
                return res.status(400).send({ status: 400, message: 'Sai mã otp!', payload: null });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    register: async (req, res) => {
        try {
            const otpHolder = await Otp.find({
                phoneNumber: req.body.phoneNumber,
            })
            if (otpHolder) {
                if (otpHolder.length === 0) return res.status(400).send({ status: 400, message: 'Sai số điện thoại!', payload: null });
            }
            if (otpHolder.length === 0) return res.status(400).send({ status: 400, message: 'Mã otp đã hết hạn!', payload: null });
            const rightOtpFind = otpHolder[otpHolder.length - 1];
            const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
            if (rightOtpFind.phoneNumber && req.body.phoneNumber && validUser) {
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
                res.status(200).json({ status: 200, message: 'Đăng ký tài khoản thành công.', payload: loadData });
            } else {
                return res.status(400).send({ status: 400, message: 'Sai mã otp!', payload: null });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    resetPassword: async (req, res) => {
        try {
            const otpHolder = await Otp.find({
                phoneNumber: req.body.phoneNumber,
            })
            if (otpHolder) {
                if (otpHolder.length === 0) return res.status(400).send({ status: 400, message: 'Sai số điện thoại!', payload: null });
            }
            if (otpHolder.length === 0) return res.status(400).send({ status: 400, message: 'Mã otp đã hết hạn!', payload: null });
            const rightOtpFind = otpHolder[otpHolder.length - 1];
            const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
            if (rightOtpFind.phoneNumber && req.body.phoneNumber && validUser) {
                const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
                if (user) {
                    const salt = await bcrypt.genSalt(10);
                    const hashed = await bcrypt.hash(req.body.password, salt);
                    await user.updateOne({ $set: { password: hashed } });
                    res.status(200).json({ status: 200, message: 'Đổi mật khẩu thành công.', payload: null });
                }
            } else {
                return res.status(400).send({ status: 400, message: 'Sai mã otp!', payload: null });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    signIn: async (req, res) => {
        try {
            const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
            if (!user) {
                return res.status(404).json({ status: 404, message: 'Sai số điện thoại!', payload: null });
            }
            const password = await bcrypt.compare(
                req.body.password, user.password
            )
            if (!password) {
                return res.status(404).json({ status: 404, message: 'Sai mật khẩu!', payload: null });
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
            return res.status(200).json({ status: 200, message: 'Đăng nhập thành công.', payload: loadData });
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
            return res.status(401).json({ status: 401, message: 'Tài khoản chưa được xác thực!', payload: null });
        }
        jwt.verify(refreshTK, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ status: 403, 'message': 'RefreshToken đã hết hạn!', payload: null });
            }
            const newAccessToken = userController.generateAccessToken(user);
            const newRefreshToken = userController.generateRefreshToken(user);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            return res.status(200).json({ 'statusCode': 200, 'message': 'Token đã được làm mới thành công.', 'newAccessToken': newAccessToken });
        })
    },

    signOut: async (req, res) => {
        res.clearCookie('refreshToken');
        return res.status(200).json({ status: 200, message: 'Đăng xuất thành công.', payload: null });
    },

    getUsers: async (req, res) => {
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
            return res.status(200).json({ status: 200, message: 'Lấy danh sách tất cả tài khoản thành công.', payload: items });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getUserById: async (req, res) => {
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
            return res.status(200).json({ status: 200, message: 'Lấy tài khoản theo mã thành công.', payload: loadData });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            const updatedUser = await user.updateOne({ $set: req.body });
            res.status(200).json({ status: 200, message: 'Cập nhật thông tin tài khoản thành công.', payload: null });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    likePost: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            await user.updateOne({ $push: { likePosts: req.params.id } });
            res.status(200).json({ status: 200, message: 'Đã thêm bài đăng này vào danh sách yêu thích.', payload: null });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    dislikePost: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            await user.updateOne({ $pull: { likePosts: req.params.id } });
            res.status(200).json({ status: 200, message: 'Đã xóa bài đăng này khỏi danh sách yêu thích.', payload: null });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteUser: async (req, res) => {
        try {
            await Post.updateMany({user: req.params.id}, {$set: {user: null}});
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ status: 200, message: 'Xoá tài khoản thành công.', payload: null });
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = userController;