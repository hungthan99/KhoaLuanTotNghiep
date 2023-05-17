const Project = require("../models/Project");
const Post = require("../models/Post");
const dotenv = require("dotenv");

dotenv.config();

const limit = process.env.PAGE_SIZE_FOR_PROJECT;

const projectController = {
  addProject: async (req, res) => {
    try {
      const newProject = new Project(req.body);
      const savedProject = await newProject.save();
      res
        .status(200)
        .json({
          status: 200,
          message: "Thêm dự án thành công.",
          payload: null,
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getProjects: async (req, res) => {
    try {
      let page = req.query.page;
      if (page) {
        page = parseInt(page);
        let skip = (page - 1) * limit;
        const projects = await Project.find().skip(skip).limit(limit);
        const items = [];
        projects.forEach((project) => {
          const item = {
            id: project._id,
            projectType: project.projectType,
            minPrice: project.minPrice,
            maxPrice: project.maxPrice,
            openForSaleTime: project.openForSaleTime,
            status: project.status,
            lat: project.lat,
            long: project.long,
            name: project.name,
            images: project.images,
            apartment: project.apartment,
            acreage: project.acreage,
            building: project.building,
            legal: project.legal,
            investor: project.investor,
            description: project.description,
            provinceCode: project.provinceCode,
            districtCode: project.districtCode,
            wardCode: project.wardCode,
            provinceName: project.provinceName,
            districtName: project.districtName,
            wardName: project.wardName,
            posts: project.posts,
          };
          items.push(item);
        });
        res
          .status(200)
          .json({
            status: 200,
            message: "Lấy danh sách tất cả dự án thành công.",
            payload: items,
          });
      } else {
        const projects = await Project.find();
        const items = [];
        projects.forEach((project) => {
          const item = {
            id: project._id,
            projectType: project.projectType,
            minPrice: project.minPrice,
            maxPrice: project.maxPrice,
            openForSaleTime: project.openForSaleTime,
            status: project.status,
            lat: project.lat,
            long: project.long,
            name: project.name,
            images: project.images,
            apartment: project.apartment,
            acreage: project.acreage,
            building: project.building,
            legal: project.legal,
            investor: project.investor,
            description: project.description,
            provinceCode: project.provinceCode,
            districtCode: project.districtCode,
            wardCode: project.wardCode,
            provinceName: project.provinceName,
            districtName: project.districtName,
            wardName: project.wardName,
            posts: project.posts,
          };
          items.push(item);
        });
        res
          .status(200)
          .json({
            status: 200,
            message: "Lấy danh sách tất cả dự án thành công.",
            payload: items,
          });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getProjectById: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      const data = {
        id: project._id,
        projectType: project.projectType,
        minPrice: project.minPrice,
        maxPrice: project.maxPrice,
        openForSaleTime: project.openForSaleTime,
        status: project.status,
        lat: project.lat,
        long: project.long,
        name: project.name,
        images: project.images,
        apartment: project.apartment,
        acreage: project.acreage,
        building: project.building,
        legal: project.legal,
        investor: project.investor,
        description: project.description,
        provinceCode: project.provinceCode,
        districtCode: project.districtCode,
        wardCode: project.wardCode,
        provinceName: project.provinceName,
        districtName: project.districtName,
        wardName: project.wardName,
        posts: project.posts,
      };
      res
        .status(200)
        .json({
          status: 200,
          message: "Lấy dự án theo mã thành công.",
          payload: data,
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  updateInfoProject: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      await project.updateOne({ $set: req.body });
      res
        .status(200)
        .json({
          status: 200,
          message: "Cập nhật thông tin dự án thành công.",
          payload: null,
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  findProject: async (req, res) => {
    try {
      let page = req.query.page;
      if (page) {
        page = parseInt(page);
        let skip = (page - 1) * limit;
        const projects = await Project.find(req.body).skip(skip).limit(limit);
        const items = [];
        projects.forEach((project) => {
          const item = {
            id: project._id,
            projectType: project.projectType,
            minPrice: project.minPrice,
            maxPrice: project.maxPrice,
            openForSaleTime: project.openForSaleTime,
            status: project.status,
            acreage: project.acreage,
            lat: project.lat,
            long: project.long,
            name: project.name,
            images: project.images,
            apartment: project.apartment,
            building: project.building,
            legal: project.legal,
            investor: project.investor,
            description: project.description,
            provinceCode: project.provinceCode,
            districtCode: project.districtCode,
            wardCode: project.wardCode,
            provinceName: project.provinceName,
            districtName: project.districtName,
            wardName: project.wardName,
            posts: project.posts,
          };
          items.push(item);
        });
        res
          .status(200)
          .json({
            status: 200,
            message:
              "Lọc danh sách dự án theo thông tin đã cung cấp thành công.",
            payload: items,
          });
      } else {
        const projects = await Project.find(req.body);
        const items = [];
        projects.forEach((project) => {
          const item = {
            id: project._id,
            projectType: project.projectType,
            minPrice: project.minPrice,
            maxPrice: project.maxPrice,
            openForSaleTime: project.openForSaleTime,
            status: project.status,
            acreage: project.acreage,
            lat: project.lat,
            long: project.long,
            name: project.name,
            images: project.images,
            apartment: project.apartment,
            building: project.building,
            legal: project.legal,
            investor: project.investor,
            description: project.description,
            provinceCode: project.provinceCode,
            districtCode: project.districtCode,
            wardCode: project.wardCode,
            provinceName: project.provinceName,
            districtName: project.districtName,
            wardName: project.wardName,
            posts: project.posts,
          };
          items.push(item);
        });
        res
          .status(200)
          .json({
            status: 200,
            message:
              "Lọc danh sách dự án theo thông tin đã cung cấp thành công.",
            payload: items,
          });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteProject: async (req, res) => {
    try {
      await Post.updateMany(
        { project: req.params.id },
        { $set: { project: null } }
      );
      await Project.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({
          status: 200,
          message: "Đã xóa dự án thành công.",
          payload: null,
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  searchByKeyword: async (req, res) => {
    try {
      let page = req.query.page;
      if (page) {
        page = parseInt(page);
        let skip = (page - 1) * limit;
        const search = req.body.keyword + "";
        const regex = new RegExp(`${search}`, "i");
        const projects = await Project.find({
          $or: [{ name: { $regex: regex } }],
        })
          .skip(skip)
          .limit(limit);
        const items = [];
        projects.forEach((project) => {
          const item = {
            id: project._id,
            projectType: project.projectType,
            minPrice: project.minPrice,
            maxPrice: project.maxPrice,
            openForSaleTime: project.openForSaleTime,
            status: project.status,
            acreage: project.acreage,
            lat: project.lat,
            long: project.long,
            name: project.name,
            images: project.images,
            apartment: project.apartment,
            building: project.building,
            legal: project.legal,
            investor: project.investor,
            description: project.description,
            provinceCode: project.provinceCode,
            districtCode: project.districtCode,
            wardCode: project.wardCode,
            provinceName: project.provinceName,
            districtName: project.districtName,
            wardName: project.wardName,
            posts: project.posts,
          };
          items.push(item);
        });
        res
          .status(200)
          .json({
            status: 200,
            message:
              "Lọc danh sách dự án theo thông tin đã cung cấp thành công.",
            payload: items,
          });
      } else {
        const search = req.body.keyword + "";
        const regex = new RegExp(`${search}`, "i");
        const projects = await Project.find({
          $or: [{ name: { $regex: regex } }],
        });
        const items = [];
        projects.forEach((project) => {
          const item = {
            id: project._id,
            projectType: project.projectType,
            minPrice: project.minPrice,
            maxPrice: project.maxPrice,
            openForSaleTime: project.openForSaleTime,
            status: project.status,
            acreage: project.acreage,
            lat: project.lat,
            long: project.long,
            name: project.name,
            images: project.images,
            apartment: project.apartment,
            building: project.building,
            legal: project.legal,
            investor: project.investor,
            description: project.description,
            provinceCode: project.provinceCode,
            districtCode: project.districtCode,
            wardCode: project.wardCode,
            provinceName: project.provinceName,
            districtName: project.districtName,
            wardName: project.wardName,
            posts: project.posts,
          };
          items.push(item);
        });
        res
          .status(200)
          .json({
            status: 200,
            message:
              "Lọc danh sách dự án theo thông tin đã cung cấp thành công.",
            payload: items,
          });
      }
    } catch (err) {
      res.status.json(err);
    }
  },
};

module.exports = projectController;
