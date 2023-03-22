const provinceController = require('../controllers/ProvinceController');

const router = require('express').Router();

router.post('/', provinceController.addProvince);

router.get('/', provinceController.getProvinces);

router.get('/:id', provinceController.getProvinceById);

router.put('/:id', provinceController.updateInfoProvince);

module.exports = router;