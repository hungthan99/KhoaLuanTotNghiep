const wardController = require("../controllers/WardController");
const authController = require("../controllers/AuthController");

const router = require("express").Router();

router.get("/", authController.verifyToken, wardController.getWards);

router.post("/", authController.verifyToken, wardController.getWardById);

router.post(
  "/d",
  authController.verifyToken,
  wardController.getWardsByDistrict
);

module.exports = router;
