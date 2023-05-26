const User = require("../models/User");
const Otp = require("../models/Otp");
const Post = require("../models/Post");
const Project = require("../models/Project");

const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const Report = require("../models/Report");

dotenv.config();

const limit = process.env.PAGE_SIZE_FOR_USER;

async function sendOtpByEmail(mailTo, otp) {
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: process.env.MAIL_FROM_ADDRESS,
    to: mailTo,
    subject: "Vertification email by Nodemailer",
    html: `
    <h1>Verify OTP code is: ${otp}</h1>
    `,
  });

  console.log("Message is sent your mail");
}

const userController = {
  sendOtpForRegister: async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      if (user) {
        return res.status(404).json({
          status: 404,
          message: "Email này đã được đăng ký!",
          payload: null,
        });
      }
      const OTP = otpGenerator.generate(6, {
        digit: true,
        alphabets: false,
        upperCase: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      console.log(OTP);
      const email = req.body.email;
      sendOtpByEmail(email, OTP);
      const otp = new Otp({ email: email, otp: OTP });
      const salt = await bcrypt.genSalt(10);
      otp.otp = await bcrypt.hash(otp.otp, salt);
      await otp.save();
      return res.status(200).send({
        status: 200,
        message: "Mã otp đã được gửi tới email cho việc đăng ký.",
        payload: null,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  sendOtpForResetPassword: async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "Email này chưa được đăng ký!",
          payload: null,
        });
      }
      const OTP = otpGenerator.generate(6, {
        digit: true,
        alphabets: false,
        upperCase: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      console.log(OTP);
      const email = req.body.email;
      sendOtpByEmail(email, OTP);
      const otp = new Otp({ email: email, otp: OTP });
      const salt = await bcrypt.genSalt(10);
      otp.otp = await bcrypt.hash(otp.otp, salt);
      await otp.save();
      return res.status(200).send({
        status: 200,
        message: "Mã otp đã được gửi tới email cho việc đổi mật khẩu.",
        payload: null,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  cofirmOtp: async (req, res) => {
    try {
      const otpHolder = await Otp.find({
        email: req.body.email,
      });
      if (otpHolder) {
        if (otpHolder.length === 0)
          return res.status(400).send({
            status: 400,
            message: "Sai email!",
            payload: null,
          });
      }
      if (otpHolder.length === 0)
        return res
          .status(400)
          .send({ status: 400, message: "Mã otp đã hết hạn!", payload: null });
      const rightOtpFind = otpHolder[otpHolder.length - 1];
      const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
      if (rightOtpFind.email && req.body.email && validUser) {
        res.status(200).json({
          status: 200,
          message: "Xác thực mã otp thành công.",
          payload: null,
        });
      } else {
        return res
          .status(400)
          .send({ status: 400, message: "Sai mã otp!", payload: null });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  register: async (req, res) => {
    try {
      const otpHolder = await Otp.find({
        email: req.body.email,
      });
      if (otpHolder) {
        if (otpHolder.length === 0)
          return res.status(400).send({
            status: 400,
            message: "Sai email!",
            payload: null,
          });
      }
      if (otpHolder.length === 0)
        return res
          .status(400)
          .send({ status: 400, message: "Mã otp đã hết hạn!", payload: null });
      const rightOtpFind = otpHolder[otpHolder.length - 1];
      const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
      if (rightOtpFind.email && req.body.email && validUser) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
          email: req.body.email,
          password: hashed,
        });
        const token = userController.generateAccessToken(newUser);
        const refreshToken = userController.generateRefreshToken(newUser);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const savedUser = await newUser.save();
        const loadData = {
          id: savedUser._id,
          name: savedUser.name,
          phoneNumber: savedUser.phoneNumber,
          password: savedUser.password,
          email: savedUser.email,
          dateOfBirth: savedUser.dateOfBirth,
          gender: savedUser.gender,
          identityCardNumber: savedUser.identityCardNumber,
          likePosts: savedUser.likePosts,
          token: token,
        };
        await Otp.deleteMany({
          email: rightOtpFind.email,
        });
        res.status(200).json({
          status: 200,
          message: "Đăng ký tài khoản thành công.",
          payload: loadData,
        });
      } else {
        return res
          .status(400)
          .send({ status: 400, message: "Sai mã otp!", payload: null });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const otpHolder = await Otp.find({
        email: req.body.email,
      });
      if (otpHolder) {
        if (otpHolder.length === 0)
          return res.status(400).send({
            status: 400,
            message: "Sai email!",
            payload: null,
          });
      }
      if (otpHolder.length === 0)
        return res
          .status(400)
          .send({ status: 400, message: "Mã otp đã hết hạn!", payload: null });
      const rightOtpFind = otpHolder[otpHolder.length - 1];
      const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
      if (rightOtpFind.email && req.body.email && validUser) {
        const user = await User.findOne({
          email: req.body.email,
        });
        if (user) {
          const salt = await bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(req.body.password, salt);
          await user.updateOne({ $set: { password: hashed } });
          res.status(200).json({
            status: 200,
            message: "Đổi mật khẩu thành công.",
            payload: null,
          });
        }
      } else {
        return res
          .status(400)
          .send({ status: 400, message: "Sai mã otp!", payload: null });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  signIn: async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "Sai email!",
          payload: null,
        });
      }
      if (user.isActive == false) {
        return res.status(404).json({
          status: 404,
          message: "Tài khoản đã bị khóa!",
          payload: null,
        });
      }
      if (user.isAdmin == req.body.isAdmin) {
        const password = await bcrypt.compare(req.body.password, user.password);
        if (!password) {
          return res
            .status(404)
            .json({ status: 404, message: "Sai mật khẩu!", payload: null });
        }
        const token = userController.generateAccessToken(user);
        const refreshToken = userController.generateRefreshToken(user);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const loadData = {
          id: user._id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          password: user.password,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          identityCardNumber: user.identityCardNumber,
          likePosts: user.likePosts,
          token: token,
        };
        return res.status(200).json({
          status: 200,
          message: "Đăng nhập thành công.",
          payload: loadData,
        });
      } else {
        return res
          .status(404)
          .json({ status: 404, message: "Đăng nhập thất bại.", payload: null });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30d" }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "180d" }
    );
  },

  requestRefreshToken: async (req, res) => {
    const refreshTK = req.cookies.refreshToken;
    if (!refreshTK) {
      return res.status(401).json({
        status: 401,
        message: "Tài khoản chưa được xác thực!",
        payload: null,
      });
    }
    jwt.verify(refreshTK, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          message: "RefreshToken đã hết hạn!",
          payload: null,
        });
      }
      const newAccessToken = userController.generateAccessToken(user);
      const newRefreshToken = userController.generateRefreshToken(user);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      return res.status(200).json({
        statusCode: 200,
        message: "Token đã được làm mới thành công.",
        newAccessToken: newAccessToken,
      });
    });
  },

  signOut: async (req, res) => {
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ status: 200, message: "Đăng xuất thành công.", payload: null });
  },

  getUsers: async (req, res) => {
    try {
      let page = req.query.page;
      if (page) {
        page = parseInt(page);
        let skip = (page - 1) * limit;
        const users = await User.find({ isAdmin: false })
          .skip(skip)
          .limit(limit);
        const items = [];
        users.forEach((user) => {
          const item = {
            id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            password: user.password,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            identityCardNumber: user.identityCardNumber,
            isActive: user.isActive,
            likePosts: user.likePosts,
          };
          items.push(item);
        });
        return res.status(200).json({
          status: 200,
          message: "Lấy danh sách tất cả tài khoản thành công.",
          payload: items,
        });
      } else {
        const users = await User.find({ isAdmin: false });
        const items = [];
        users.forEach((user) => {
          const item = {
            id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            password: user.password,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            identityCardNumber: user.identityCardNumber,
            isActive: user.isActive,
            likePosts: user.likePosts,
          };
          items.push(item);
        });
        return res.status(200).json({
          status: 200,
          message: "Lấy danh sách tất cả tài khoản thành công.",
          payload: items,
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const loadData = {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        password: user.password,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        identityCardNumber: user.identityCardNumber,
        isActive: user.isActive,
      };
      return res.status(200).json({
        status: 200,
        message: "Lấy tài khoản theo mã thành công.",
        payload: loadData,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  updateInfoUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      await user.updateOne({ $set: req.body });
      res.status(200).json({
        status: 200,
        message: "Cập nhật thông tin tài khoản thành công.",
        payload: null,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  changeStatusActiveUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        if (user.isActive) {
          await user.updateOne({ $set: { isActive: false } });
          res.status(200).json({
            status: 200,
            message: "Khóa tài khoản người dùng thành công",
            payload: null,
          });
        } else {
          await user.updateOne({ $set: { isActive: true } });
          res.status(200).json({
            status: 200,
            message: "Mở khóa tài khoản người dùng thành công",
            payload: null,
          });
        }
      } else {
        res.status(404).json({
          status: 404,
          message: "Tài khoản không tồn tại",
          payload: null,
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  likePost: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      await user.updateOne({ $push: { likePosts: req.params.id } });
      res.status(200).json({
        status: 200,
        message: "Đã thêm bài đăng này vào danh sách yêu thích.",
        payload: null,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  dislikePost: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      await user.updateOne({ $pull: { likePosts: req.params.id } });
      res.status(200).json({
        status: 200,
        message: "Đã xóa bài đăng này khỏi danh sách yêu thích.",
        payload: null,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const posts = await Post.deleteMany({ user: req.params.id });
      await Project.updateMany(
        { posts: posts.id },
        { $pull: { posts: posts.id } }
      );
      await Report.deleteMany({
        reportUser: req.params.id,
      });
      await Report.deleteMany({
        postUser: req.params.id,
      });
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({
        status: 200,
        message: "Xoá tài khoản thành công.",
        payload: null,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  changePassword: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const validPassword = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );
      if (validPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.newPassword, salt);
        await user.updateOne({ $set: { password: hashed } });
        res.status(200).json({
          status: 200,
          message: "Đổi mật khẩu thành công",
          payload: null,
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "Mật khẩu cũ không đúng!",
          payload: null,
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
