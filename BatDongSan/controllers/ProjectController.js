const Project = require('../models/Project');
const Post = require('../models/Post');

const projectController = {
    addProject: async(req, res) => {
        try {
            const newProject = new Project(req.body);
            const savedProject = await newProject.save();
            res.status(200).json({status: 200, message: 'Add project successfully.', payload: null});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getProjects: async(req, res) => {
        try {
            const projects = await Project.find();
            const items = [];
            projects.forEach((project) => {
                const item = {
                    'id': project._id,
                    'projectType': project.projectType,
                    'price': project.price,
                    'status': project.status,
                    'lat': project.lat,
                    'long': project.long,
                    'name': project.name,
                    'images': project.images,
                    'apartment': project.apartment,
                    'acreage': project.acreage,
                    'building': project.building,
                    'legal': project.legal,
                    'investor': project.investor,
                    'description': project.description,
                    'provinceCode': project.provinceCode,
                    'districtCode': project.districtCode,
                    'wardCode': project.wardCode,
                    'provinceName': project.provinceName,
                    'districtName': project.districtName,
                    'wardName': project.wardName
                }
                items.push(item);
            });
            res.status(200).json({status: 200, message: 'Get projects successfully.', payload: items});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getProjectById: async(req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            const data = {
                'id': project._id,
                'projectType': project.projectType,
                'price': project.price,
                'status': project.status,
                'lat': project.lat,
                'long': project.long,
                'name': project.name,
                'images': project.images,
                'apartment': project.apartment,
                'acreage': project.acreage,
                'building': project.building,
                'legal': project.legal,
                'investor': project.investor,
                'description': project.description,
                'provinceCode': project.provinceCode,
                'districtCode': project.districtCode,
                'wardCode': project.wardCode,
                'provinceName': project.provinceName,
                'districtName': project.districtName,
                'wardName': project.wardName
            }
            res.status(200).json({status: 200, message: 'Get project by id successfully.', payload: data});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoProject: async(req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            const updatedProject = await project.updateOne({$set: req.body});
            res.status(200).json({status: 200, message: 'Updated information of project successfully.', payload: updatedProject});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    findProject: async(req, res) => {
        try {
            const projects = await Project.find(req.body);
            const items = [];
            projects.forEach((project) => {
                const item = {
                    'id': project._id,
                    'projectType': project.projectType,
                    'price': project.price,
                    'status': project.status,
                    'provinceCode': project.provinceCode,
                    'districtCode': project.districtCode,
                    'wardCode': project.wardCode,
                    'provinceName': project.provinceName,
                    'districtName': project.districtName,
                    'wardName': project.wardName
                }
                items.push(item);
            }); 
            res.status(200).json({status: 200, message: 'Find list project by information applied successfully.', payload: items});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteProject: async(req, res) => {
        try {
            await Post.updateMany({project: req.params.id}, {$set: {project: null}});
            await Project.findByIdAndDelete(req.params.id);
            res.status(200).json({status: 200, message: 'Deleted project successfully.', payload: null});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = projectController;