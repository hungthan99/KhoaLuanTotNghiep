const userController = require("../controllers/UserController");
const authController = require("../controllers/AuthController");

const router = require("express").Router();

router.post("/send-otp-for-register", userController.sendOtpForRegister);

router.post(
  "/send-otp-for-reset-password",
  userController.sendOtpForResetPassword
);

router.post("/confirm-otp", userController.cofirmOtp);

router.post("/register", userController.register);

router.post("/signin", userController.signIn);

router.put("/reset-password", userController.resetPassword);

router.post("/refresh", userController.requestRefreshToken);

router.post("/signout", authController.verifyToken, userController.signOut);

router.get("/", authController.verifyToken, userController.getUsers);

router.get("/:id", authController.verifyToken, userController.getUserById);

router.put(
  "/update-info",
  authController.verifyToken,
  userController.updateInfoUser
);

router.put(
  "/change-active-status/:id",
  authController.verifyToken,
  userController.changeStatusActiveUser
);

router.put(
  "/like-post/:id",
  authController.verifyToken,
  userController.likePost
);

router.put(
  "/dislike-post/:id",
  authController.verifyToken,
  userController.dislikePost
);

router.delete(
  "/delete-user/:id",
  authController.verifyToken,
  userController.deleteUser
);

router.put(
  "/change-password",
  authController.verifyToken,
  userController.changePassword
);

module.exports = router;
