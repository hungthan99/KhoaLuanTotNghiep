const Post = require("../models/Post");
const Report = require("../models/Report");
const User = require("../models/User");

const limit = process.env.PAGE_SIZE_FOR_REPORT;

const ReportController = {
  getAllReport: async (req, res) => {
    try {
      let page = req.query.page;
      if (page) {
        page = parseInt(page);
        let skip = (page - 1) * limit;
        const reports = await Report.find().skip(skip).limit(limit);
        const items = [];
        for (const i in reports) {
          const item = {
            id: reports[i].id,
            reportUserId: reports[i].reportUser,
            postUserId: reports[i].postUser,
            postId: reports[i].post,
            postTitle: reports[i].postTitle,
            content: reports[i].content,
          };
          items.push(item);
        }
        res.status(200).json({
          status: 200,
          message: "Lấy danh sách tất cả báo cáo thành công.",
          payload: items,
        });
      } else {
        const reports = await Report.find();
        const items = [];
        for (const i in reports) {
          const item = {
            id: reports[i].id,
            reportUserId: reports[i].reportUser,
            postUserId: reports[i].postUser,
            postId: reports[i].post,
            postTitle: reports[i].postTitle,
            content: reports[i].content,
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
      const item = {
        id: report.id,
        reportUserId: report.reportUser,
        postUserId: report.postUser,
        postId: report.post,
        postTitle: report.postTitle,
        content: report.content,
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
};

module.exports = ReportController;
