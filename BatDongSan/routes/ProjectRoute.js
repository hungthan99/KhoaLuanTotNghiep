const projectController = require('../controllers/ProjectController');

const router = require('express').Router();

router.post('/', projectController.addProject);

router.get('/', projectController.getProjects);

router.get('/:id', projectController.getProjectById);

router.put('/:id', projectController.updateInfoProject);

router.post('/find', projectController.findProject);

module.exports = router;