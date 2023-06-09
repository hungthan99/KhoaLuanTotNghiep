const postController = require("../controllers/PostController");
const authController = require("../controllers/AuthController");

const router = require("express").Router();

router.post("/add-post", authController.verifyToken, postController.addPost);

router.get(
  "/get-all-post",
  authController.verifyToken,
  postController.getPosts
);

router.get(
  "/get-post-by-user/:id",
  authController.verifyToken,
  postController.getPostsByUser
);

router.get(
  "/get-post-by-user-for-admin/:id",
  authController.verifyToken,
  postController.getPostByUserForAdmin
);

router.get(
  "/get-favorite-post",
  authController.verifyToken,
  postController.getPostsByLikePosts
);

router.post(
  "/get-post",
  authController.verifyToken,
  postController.getPostsByIsSell
);

router.get(
  "/get-post-by-id/:id",
  authController.verifyToken,
  postController.getPostById
);

router.put("/:id", authController.verifyToken, postController.updateInfoPost);

router.delete("/:id", authController.verifyToken, postController.deletePost);

router.post("/find", authController.verifyToken, postController.findPost);

router.post(
  "/search-by-keyword",
  authController.verifyToken,
  postController.searchByKeyWord
);

module.exports = router;
