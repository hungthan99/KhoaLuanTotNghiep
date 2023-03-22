const Project = require('../models/Project');

const projectController = {
    addProject: async(req, res) => {
        try {
            const newProject = new Project(req.body);
            const savedProject = await newProject.save();
            res.status(200).json(savedProject);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getProjects: async(req, res) => {
        try {
            const projects = await Project.find();
            res.status(200).json(projects);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getProjectById: async(req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            res.status(200).json(project);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateInfoProject: async(req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            await project.updateOne({$set: req.body});
            res.status(200).json('Updated information of project successfully.');
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
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = projectController;