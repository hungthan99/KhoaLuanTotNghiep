const Post = require("../models/Post");
const Report = require("../models/Report");
const User = require("../models/User");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const limit = process.env.PAGE_SIZE_FOR_REPORT;

async function sendEmailForReport(mailTo, content) {
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
    subject: "Your post was reported.",
    html: `
    <h1>${content}</h1>
    `,
  });

  console.log("Message is sent your mail");
}

const ReportController = {
  getAllReport: async (req, res) => {
    try {
      let page = req.query.page;
      if (page) {
        page = parseInt(page);
        let skip = (page - 1) * limit;
        const reports = await Report.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        const items = [];
        for (const i in reports) {
          let reportUser = await User.findById(reports[i].reportUser);
          let postUser = await User.findById(reports[i].postUser);
          const item = {
            id: reports[i].id,
            reportUserId: reports[i].reportUser,
            reportUserName: reportUser.name,
            reportUserPhone: reportUser.phoneNumber,
            reportUserEmail: reportUser.email,
            postUserId: reports[i].postUser,
            postUserName: postUser.name,
            postUserPhone: postUser.phoneNumber,
            postUserEmail: postUser.email,
            postId: reports[i].post,
            postTitle: reports[i].postTitle,
            content: reports[i].content,
            status: reports[i].status,
            createdAt: reports[i].createdAt.getTime()
          };
          items.push(item);
        }
        res.status(200).json({
          status: 200,
          message: "Lấy danh sách tất cả báo cáo thành công.",
          payload: items,
        });
      } else {
        const reports = await Report.find().sort({ createdAt: -1 });
        const items = [];
        for (const i in reports) {
          let reportUser = await User.findById(reports[i].reportUser);
          let postUser = await User.findById(reports[i].postUser);
          const item = {
            id: reports[i].id,
            reportUserId: reports[i].reportUser,
            reportUserName: reportUser.name,
            reportUserPhone: reportUser.phoneNumber,
            reportUserEmail: reportUser.email,
            postUserId: reports[i].postUser,
            postUserName: postUser.name,
            postUserPhone: postUser.phoneNumber,
            postUserEmail: postUser.email,
            postId: reports[i].post,
            postTitle: reports[i].postTitle,
            content: reports[i].content,
            status: reports[i].status,
            createdAt: reports[i].createdAt.getTime()
          };
          items.push(item);
        }
        res.status(200).json({
          status: 200,
          message: "Lấy danh sách tất cả báo cáo thành công.",
          payload: items,
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getReportById: async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      const reportUser = await User.findById(report.reportUser);
      const postUser = await User.findById(report.postUser);
      const item = {
        id: report.id,
        reportUserId: report.reportUser,
        reportUserName: reportUser.name,
        reportUserPhone: reportUser.phoneNumber,
        reportUserEmail: reportUser.email,
        postUserId: report.postUser,
        postUserName: postUser.name,
        postUserPhone: postUser.phoneNumber,
        postUserEmail: postUser.email,
        postId: report.post,
        postTitle: report.postTitle,
        content: report.content,
        status: report.status,
        createdAt: report.createdAt.getTime()
      };
      res.status(200).json({
        status: 200,
        message: "Lấy báo cáo theo mã thành công.",
        payload: item,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  addReport: async (req, res) => {
    try {
      const postUser = await Post.findById(req.body.postId);
      const newReport = new Report({
        post: req.body.postId,
        reportUser: req.user.id,
        postUser: postUser.user,
        postTitle: postUser.title,
        content: req.body.content,
      });
      await newReport.save();
      res.status(200).json({
        status: 200,
        message: "Thêm báo cáo thành công.",
        payload: null,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  updateInfoReport: async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      if (!report) {
        res.status(404).json({
          status: 404,
          message: "Không tìm thấy mã report cần cập nhật thông tin.",
          payload: null,
        });
      }
      const reportUpdated = await report.updateOne({ $set: req.body });
      if (reportUpdated) {
        res.status(200).json({
          status: 200,
          message: "Cập nhật thông tin cho báo cáo thành công.",
          payload: null,
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteReport: async (req, res) => {
    try {
      const deletedReport = await Report.findByIdAndDelete(req.params.id);
      if (deletedReport) {
        res.status(200).json({
          status: 200,
          message: "Xóa báo cáo thành công.",
          payload: null,
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "Mã báo cáo cần xóa không tồn tại.",
          payload: null,
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getReportsByStatus: async (req, res) => {
    try {
      let page = req.query.page;
      if (page) {
        page = parseInt(page);
        let skip = (page - 1) * limit;
        const reports = await Report.find({ status: req.body.status })
          .skip(skip)
          .limit(limit).sort({ createdAt: -1 });
        const items = [];
        for (const i in reports) {
          let reportUser = await User.findById(reports[i].reportUser);
          let postUser = await User.findById(reports[i].postUser);
          const item = {
            id: reports[i].id,
            reportUserId: reports[i].reportUser,
            reportUserName: reportUser.name,
            reportUserPhone: reportUser.phoneNumber,
            reportUserEmail: reportUser.email,
            postUserId: reports[i].postUser,
            postUserName: postUser.name,
            postUserPhone: postUser.phoneNumber,
            postUserEmail: postUser.email,
            postId: reports[i].post,
            postTitle: reports[i].postTitle,
            content: reports[i].content,
            status: reports[i].status,
            createdAt: reports[i].createdAt.getTime()
          };
          items.push(item);
        }
        res.status(200).json({
          status: 200,
          message: "Lấy danh sách báo cáo theo trạng thái thành công.",
          payload: items,
        });
      } else {
        const reports = await Report.find({ status: req.body.status }).sort({ createdAt: -1 });
        const items = [];
        for (const i in reports) {
          let reportUser = await User.findById(reports[i].reportUser);
          let postUser = await User.findById(reports[i].postUser);
          const item = {
            id: reports[i].id,
            reportUserId: reports[i].reportUser,
            reportUserName: reportUser.name,
            reportUserPhone: reportUser.phoneNumber,
            postUserId: reports[i].postUser,
            postUserName: postUser.name,
            postUserPhone: postUser.phoneNumber,
            postId: reports[i].post,
            postTitle: reports[i].postTitle,
            content: reports[i].content,
            status: reports[i].status,
            createdAt: reports[i].createdAt.getTime()
          };
          items.push(item);
        }
        res.status(200).json({
          status: 200,
          message: "Lấy danh sách báo cáo theo trạng thái thành công.",
          payload: items,
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  sendReportEmail: async (req, res) => {
    try {
      const user = await User.find({ email: req.body.email });
      if (user) {
        sendEmailForReport(req.body.email, req.body.content);
        res
          .status(200)
          .json({
            status: 200,
            message: "Gửi mail cho việc báo cáo tin đăng thành công",
            payload: null,
          });
      } else {
        res
          .status(400)
          .json({
            status: 400,
            message: "Tài khoản có email này không tồn tại",
          });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = ReportController;
