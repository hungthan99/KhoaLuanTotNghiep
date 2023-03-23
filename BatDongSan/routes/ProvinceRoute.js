const provinceController = require('../controllers/ProvinceController');
const authController = require('../controllers/AuthController');

const router = require('express').Router();

router.post('/', authController.verifyToken, provinceController.addProvince);

router.get('/', authController.verifyToken, provinceController.getProvinces);

router.get('/:id', authController.verifyToken, provinceController.getProvinceById);

router.put('/:id', authController.verifyToken, provinceController.updateInfoProvince);

module.exports = router;