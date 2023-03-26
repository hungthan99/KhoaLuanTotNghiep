const wardController = require('../controllers/WardController');
const authController = require('../controllers/AuthController');

const router = require('express').Router();

router.post('/', authController.verifyToken, wardController.addWard);

router.get('/', authController.verifyToken, wardController.getWards);

router.get('/:id', authController.verifyToken, wardController.getWardById);

router.put('/:id', authController.verifyToken, wardController.updateInfoWard);

router.delete('/:id', authController.verifyToken, wardController.deleteWard);

router.post('/list', authController.verifyToken, wardController.getWardsByDistrict);

module.exports = router;