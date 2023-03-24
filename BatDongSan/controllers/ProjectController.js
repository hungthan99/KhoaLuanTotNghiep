const Project = require('../models/Project');

const projectController = {
    addProject: async(req, res) => {
        try {
            const newProject = new Project(req.body);
            const savedProject = await newProject.save();
            res.status(200).json({status: 200, 'message': 'Add project successfully.', 'data': savedProject});
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
                    'province': project.province,
                    'district': project.district,
                    'ward': project.ward
                }
                items.push(item);
            });
            res.status(200).json({status: 200, 'message': 'Get projects successfully.', 'data': items});
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
                'province': project.province,
                'district': project.district,
                'ward': project.ward
            }
            res.status(200).json({status: 200, 'message': 'Get project by id successfully.', 'data': data});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoProject: async(req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            const updatedProject = await project.updateOne({$set: req.body});
            res.status(200).json({status: 200, 'message': 'Updated information of project successfully.', 'data': updatedProject});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    findProject: async(req, res) => {
        try {
            const projects = await Project.find();
            const data = [];
            for (let i = 0; i < projects.length; i++) {
                if(projects[i].province == req.body.province ||
                     projects[i].district == req.body.district ||
                      projects[i].ward == req.body.ward ||
                       projects[i].projectType == req.body.projectType ||
                        projects[i].price == req.body.price ||
                         projects[i].status == req.body.status) {
                            data.push(projects[i]);
                }
            }
            const dataProject = {
                'id': data._id,
                'projectType': data.projectType,
                'price': data.price,
                'status': data.status,
                'province': data.province,
                'district': data.district,
                'ward': data.ward
            }
            res.status(200).json({status: 200, 'message': 'Find list project by information applied successfully.', 'data': dataProject});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = projectController;