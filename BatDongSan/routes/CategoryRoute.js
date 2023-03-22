const categoryController = require('../controllers/CategoryController');

const router = require('express').Router();

router.post('/', categoryController.addCategory);

router.get('/', categoryController.getCategories);

router.get('/:id', categoryController.getCategoryById);

router.put('/:id', categoryController.updateInfoCategory);

module.exports = router;