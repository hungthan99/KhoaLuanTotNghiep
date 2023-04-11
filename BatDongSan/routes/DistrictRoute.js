const districtController = require('../controllers/DistrictController');
const authController = require('../controllers/AuthController');

const router = require('express').Router();

router.get('/', authController.verifyToken, districtController.getDistricts);

router.post('/', authController.verifyToken, districtController.getDistrictById);

router.post('/p', authController.verifyToken, districtController.getDistrictsByProvince);

module.exports = router;