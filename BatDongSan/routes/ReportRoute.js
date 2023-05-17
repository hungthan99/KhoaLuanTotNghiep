const reportController = require("../controllers/ReportController");
const authController = require("../controllers/AuthController");

const router = require("express").Router();

router.get(
  "/get-all-report",
  authController.verifyToken,
  reportController.getAllReport
);

router.get(
  "/get-report-by-id/:id",
  authController.verifyToken,
  reportController.getReportById
);

router.post(
  "/add-report",
  authController.verifyToken,
  reportController.addReport
);

router.delete(
  "/delete-report/:id",
  authController.verifyToken,
  reportController.deleteReport
);

module.exports = router;
