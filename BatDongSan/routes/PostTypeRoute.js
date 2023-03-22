const postTypeController = require('../controllers/PostTypeController');

const router = require('express').Router();

router.post('/', postTypeController.addPostType);

router.get('/', postTypeController.getPostTypes);

router.get('/:id', postTypeController.getPostTypeById);

router.put('/:id', postTypeController.updateInfoPostType);

module.exports = router;