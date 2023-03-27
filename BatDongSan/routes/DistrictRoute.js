const districtController = require('../controllers/DistrictController');
const authController = require('../controllers/AuthController');

const router = require('express').Router();

// router.post('/', authController.verifyToken, districtController.addDistrict);

router.get('/', authController.verifyToken, districtController.getDistricts);

router.post('/', authController.verifyToken, districtController.getDistrictById);

// router.put('/:id', authController.verifyToken, districtController.updateInfoDistrict);

// router.delete('/:id', authController.verifyToken, districtController.deleteDistrict);

router.post('/p', authController.verifyToken, districtController.getDistrictsByProvince);

module.exports = router;