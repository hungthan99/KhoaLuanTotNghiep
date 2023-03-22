const wardController = require('../controllers/WardController');

const router = require('express').Router();

router.post('/', wardController.addWard);

router.get('/', wardController.getWards);

router.get('/:id', wardController.getWardById);

router.put('/:id', wardController.updateInfoWard);

module.exports = router;