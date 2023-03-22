const projectController = require('../controllers/ProjectController');

const router = require('express').Router();

router.post('/', projectController.addProject);

router.get('/', projectController.getProjects);

router.get('/:id', projectController.getProjectById);

router.put('/:id', projectController.updateInfoProject);

module.exports = router;