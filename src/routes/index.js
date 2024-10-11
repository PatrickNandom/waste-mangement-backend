const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../middlewares/adminMiddleware");
const { authMiddleware } = require("../middlewares/authMiddlewares");

const {
  registerController,
  loginUserController,
} = require("../controllers/authController");

const {
  defineCollectionPoint,
} = require("../controllers/collectionController");

//AUTH ROUTES(PUBLIC ROUTES).
router.post("/register", registerController);
router.post("/login", loginUserController);

// ADMIN PROTECTED ROUTES
router.post(
  "/admin/collection-point",
  authMiddleware,
  adminMiddleware,
  defineCollectionPoint
);

// Add collection point
// router.put(
//   "/admin/collection-point/:id",
//   authMiddleware,
//   adminMiddleware,
//   updateCollectionPoint
// );

module.exports = router;
