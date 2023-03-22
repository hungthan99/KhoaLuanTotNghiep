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
    }
}

module.exports = projectController;