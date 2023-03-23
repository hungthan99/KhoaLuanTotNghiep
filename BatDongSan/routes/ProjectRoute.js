const projectController = require('../controllers/ProjectController');
const authController = require('../controllers/AuthController');

const router = require('express').Router();

router.post('/', authController.verifyToken, projectController.addProject);

router.get('/', authController.verifyToken, projectController.getProjects);

router.get('/:id', authController.verifyToken, projectController.getProjectById);

router.put('/:id', authController.verifyToken, projectController.updateInfoProject);

router.post('/find', authController.verifyToken, projectController.findProject);

module.exports = router;