const wardController = require('../controllers/WardController');
const authController = require('../controllers/AuthController');

const router = require('express').Router();

// router.post('/', authController.verifyToken, wardController.addWard);

router.get('/', authController.verifyToken, wardController.getWards);

router.post('/', authController.verifyToken, wardController.getWardById);

// router.put('/:id', authController.verifyToken, wardController.updateInfoWard);

// router.delete('/:id', authController.verifyToken, wardController.deleteWard);

router.post('/d', authController.verifyToken, wardController.getWardsByDistrict);

router.post('/p', authController.verifyToken, wardController.getWardsByProvince);

module.exports = router;