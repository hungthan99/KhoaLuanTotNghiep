const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');

const router = require('express').Router();

router.post('/send-otp', userController.sendOtp);

router.post('/confirm-otp', userController.cofirmOtp);

router.post('/register', userController.register);

router.post('/signin', userController.signIn);

router.put('/reset-password', userController.resetPassword);

router.post('/refresh', userController.requestRefreshToken);

router.post('/signout', authController.verifyToken, userController.signOut);

router.get('/', authController.verifyToken, userController.getUsers);

router.get('/:id', authController.verifyToken, userController.getUserById);

router.put('/update-info', authController.verifyToken, userController.updateInfoUser);

router.put('/like-post/:id', authController.verifyToken, userController.likePost);

router.put('/dislike-post/:id', authController.verifyToken, userController.dislikePost);

module.exports = router;