const User = require('../models/User');
const Otp = require('../models/Otp');
const Post = require('../models/Post');
const Project = require('../models/Project');

const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const limit = process.env.PAGE_SIZE_FOR_USER;

const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
    apiKey: process.env.NEXMO_KEY,
    apiSecret: process.env.NEXMO_SECRET
})

async function sendSMS(to, from, text) {
    await vonage.sms.send({ to, from, text })
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
}

// const admin = require('firebase-admin');
// const serviceAccount =
// {
//     "type": "service_account",
//     "project_id": "realestateproject-fcad6",
//     "private_key_id": "a90e7153b98cbfdf56f622df67b5b9012a042512",
//     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDSeGzradNG2wcM\ni6CdPfQ5xFLmVBKwxma7xTi0xOEqKiZSLCsQenJtEcfbu1Rmhml3hJrggkDQFGZc\nuPb1GyGMSUeyM8p3MZOYdrD7GrWgUoKpq5Bb/0Pp6gDLf4aGI5C8IhquQVa4ByZC\n2CcRwwtwuyY1KDgeweuzZY2mOzPLjLQP4LBgL3e91TEZJqlDoW/YaWz9JNTe3l0+\ngAtm6gXPMf/n3MVy1fZ6t136GZcFD62Nr4Rrk6rJJEJ0W2wAZFvYdX0MaY0ZquDt\ncJ/G0hz+cn6NVX3jgxKVETMIpaK4r4iKYfArs44vQO18HtpwmYxtJ81YZMxD1jge\niBexhvoXAgMBAAECggEAD3Vb3qCLrYkZx/Cbb+EkhnemdRdYthYkZocyRoitVwj4\nfpGS6idsLxmeucNVDCC0L1yUeYfnlcDh0c6eCNugx6p8Mxj9tmp0Qj75eb/49hkJ\nUsfwluk1RkFzJH8t1L1Y/JBusDzJT0PrKf6xQ+s09Gcyg7X8BTpOAwOi90Ii6EC/\nplTzq5tAsPhCSsyex0QevGFcxt6O2mmekx0Lqx/VjlOfCZBahqdJLCoEK0U8+muy\nOMVbOqErsQyuMQiSWeucaukljT7mCtBxdx5TQtumTuyjldaX0Ig2sD0l7sCb+Xzo\nOSAt55g74nMCji/lZk5+ZJpsbHtwmZH8RL9lKUczkQKBgQD7Tl3dVZ35v9sqG/FI\n+FkHvRiNW/SBt7wGSNasL2953LG736O5ngdYSkvJ6dh4AeweWqP4aBDrIbBM/MgJ\nqfE4CG7v10DgTn6sQ8MB+r9mShtv1/04GGl4LPOBTS9avqhbmxhTjWPdeV9si4g5\nDTff20B+DDjtr031Omwj3N7fJwKBgQDWZsz9L7HWsNYWdmRwjDnBIuOtz4wU4FJJ\nF8XIni0nm4lC010uBy6ftSFXvOTOuRI9kGewErM1ZCfd3mR7cNuFiV4YE38HszAF\nI8yaMpActPsnySVyinQjAv7rGKNDNiiXHUUkiqA8+Q68d/GR7XPFxhz4gbVD69r/\nSDgJ0B3jkQKBgQCdx+8g9w9PbgixYIfWU666MBxJLHHQO8Z+f57gzouEDG8+0MPf\n13svEL6S0BJMDpDr4ebPIK92oVkqjQ8fGibMEmdsiE5ARqg7ifPWu1MOavrc9tQS\nMymM/VQJW6eeptPXaAIW+0+3Duw9n0Fw6H6rOuI8AXqAqK8eh4a74YHAwwKBgQCA\neF0AoWGoyZGfKBYLMpsw1Z0j+ydvIvNrhOkoy083WoWnG0vMVtVjMX/nOPLJxC/f\n3/WhlbL4nSkeUzJWnUuM+sD9IEGP9Zkim07wXrfn27JbJrZfqgLpL9RcPwklLwCn\nfAyAVuipYHuqBx0jWetzaMDXT7G0H1G8giPCDYi7YQKBgQDIslJh9d2CULXl03hg\nPfv53GSdi6KaxphqweWl8Pom9slezxHOW+x7ZR2Qy8DApv6pZiDN+RcyNr3dQaBj\n7D3VYSxugAap6+w0GlvXM6UQHuZnQh2Y5lgZOdhBYhXFZC9KF6raTCUGkP+fDCgR\n0tNflO1vNLFd9NVvNKEGyVTMuw==\n-----END PRIVATE KEY-----\n",
//     "client_email": "firebase-adminsdk-ahgnj@realestateproject-fcad6.iam.gserviceaccount.com",
//     "client_id": "102822154399897053632",
//     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//     "token_uri": "https://oauth2.googleapis.com/token",
//     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ahgnj%40realestateproject-fcad6.iam.gserviceaccount.com"
// }

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// async function sendVerificationCode(phoneNumber, verificationCode) {
//     try {
//         const auth = admin.auth();

//         const message = `Your verification code is ${verificationCode}`;

//         const result = await auth
//             .createUser({ phoneNumber })
//             .then((userRecord) =>
//                 admin.auth().setCustomUserClaims(userRecord.uid, {
//                     verificationCode,
//                 })
//             )
//             .then(() =>
//                 admin.messaging().send({
//                     notification: { title: 'Verification Code', body: message },
//                     token: phoneNumber,
//                 })
//             );

//         console.log('Verification code sent successfully:', result);
//         return verificationCode;
//     } catch (error) {
//         console.error('Error sending verification code:', error);
//         return null;
//     }
// }

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
            const phoneNumber = req.body.phoneNumber;
            sendSMS('84' + phoneNumber, 'Vonage APIs', OTP);
            // sendVerificationCode(phoneNumber, OTP)
            //     .then((verificationCode) => console.log('Verification code:', verificationCode))
            //     .catch((error) => console.error(error));
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
            const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
            if (!user) {
                return res.status(404).json({ status: 404, 'message': 'Số điện thoại chưa được đăng ký!', payload: null });
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
            sendSMS('84' + phoneNumber, 'Vonage APIs', OTP);
            // sendVerificationCode(phoneNumber, OTP)
            //     .then((verificationCode) => console.log('Verification code:', verificationCode))
            //     .catch((error) => console.error(error));
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
            if (user.isActive == false) {
                return res.status(404).json({ status: 404, message: 'Tài khoản đã bị khóa!', payload: null });
            }
            if (user.isAdmin == req.body.isAdmin) {
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
            } else {
                return res.status(404).json({ status: 404, message: 'Đăng nhập thất bại.', payload: null });
            }
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
            let page = req.query.page;
            if (page) {
                page = parseInt(page);
                let skip = (page - 1) * limit;
                const users = await User.find().skip(skip).limit(limit);
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
            } else {
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
            }
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
            await user.updateOne({ $set: req.body });
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
            const posts = await Post.deleteMany({ user: req.params.id });
            await Project.updateMany({ posts: posts.id }, { $pull: { posts: posts.id } });
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ status: 200, message: 'Xoá tài khoản thành công.', payload: null });
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = userController;