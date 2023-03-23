const postTypeController = require('../controllers/PostTypeController');
const authController = require('../controllers/AuthController');

const router = require('express').Router();

router.post('/', authController.verifyToken, postTypeController.addPostType);

router.get('/', authController.verifyToken, postTypeController.getPostTypes);

router.get('/:id', authController.verifyToken, postTypeController.getPostTypeById);

router.put('/:id', authController.verifyToken, postTypeController.updateInfoPostType);

module.exports = router;