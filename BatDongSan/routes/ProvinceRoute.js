const provinceController = require("../controllers/ProvinceController");
const authController = require("../controllers/AuthController");

const router = require("express").Router();

router.get("/", authController.verifyToken, provinceController.getProvinces);

router.post(
  "/",
  authController.verifyToken,
  provinceController.getProvinceById
);

module.exports = router;
