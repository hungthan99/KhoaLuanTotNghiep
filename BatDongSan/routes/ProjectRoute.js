const projectController = require("../controllers/ProjectController");
const authController = require("../controllers/AuthController");

const router = require("express").Router();

router.post("/", authController.verifyToken, projectController.addProject);

router.get("/", authController.verifyToken, projectController.getProjects);

router.get(
  "/get-project-by-id/:id",
  authController.verifyToken,
  projectController.getProjectById
);

router.put(
  "/:id",
  authController.verifyToken,
  projectController.updateInfoProject
);

router.post("/find", authController.verifyToken, projectController.findProject);

router.delete(
  "/:id",
  authController.verifyToken,
  projectController.deleteProject
);

router.post(
  "/search-by-keyword",
  authController.verifyToken,
  projectController.searchByKeyword
);

module.exports = router;
