const categoryController = require('../controllers/CategoryController');
const authController = require('../controllers/AuthController');

const router = require('express').Router();

router.post('/', authController.verifyToken, categoryController.addCategory);

router.get('/', authController.verifyToken, categoryController.getCategories);

router.get('/:id', authController.verifyToken, categoryController.getCategoryById);

router.put('/:id', authController.verifyToken, categoryController.updateInfoCategory);

module.exports = router;