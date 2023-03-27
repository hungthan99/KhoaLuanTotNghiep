const postController = require('../controllers/PostController');
const authController = require('../controllers/AuthController');

const router = require('express').Router();

router.post('/', authController.verifyToken, postController.addPost);

router.get('/', authController.verifyToken, postController.getPosts);

router.get('/:id', authController.verifyToken, postController.getPostById);

router.put('/:id', authController.verifyToken, postController.updateInfoPost);

router.delete('/:id', authController.verifyToken, postController.deletePost);

router.put('/update-status/:id', authController.verifyToken, postController.updatePostStatus);

router.post('/find', authController.verifyToken, postController.findPost);

module.exports = router;