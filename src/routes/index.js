const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddlewares");

const {
  registerController,
  loginUserController,
} = require("../controllers/authController");
const {
  requestPickUp,
  getAllPickUp,
  updateUserProfile,
  updateUserPassword,
} = require("../controllers/userController");

//AUTH ROUTES(PUBLIC ROUTES).
router.post("/register", registerController);
router.post("/login", loginUserController);

// ADMIN PROTECTED ROUTES

//USER ROUTES
router.post("/user/request-pickup/:userId", authMiddleware, requestPickUp);
router.get("/user/pickup-points", authMiddleware, getAllPickUp);
router.put("/users/:userId", authMiddleware, updateUserProfile);
router.put("/users/:userId/password", authMiddleware, updateUserPassword);

module.exports = router;
