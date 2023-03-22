const districtController = require('../controllers/DistrictController');

const router = require('express').Router();

router.post('/', districtController.addDistrict);

router.get('/', districtController.getDistricts);

router.get('/:id', districtController.getDistrictById);

router.put('/:id', districtController.updateInfoDistrict);

module.exports = router;