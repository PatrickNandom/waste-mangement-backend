const express = require("express");
const router = express.Router();

// middlewares import
const { authMiddleware } = require("../middlewares/authMiddlewares");
const { adminMiddleware } = require("../middlewares/adminMiddleware");

// importing auth controllers
const {
  registerController,
  loginUserController,
} = require("../controllers/authController");

// importing admin controllers
const {
  createNewStaff,
  updateCollectionPoint,
  getAllUsers,
  getAllStaff,
} = require("../controllers/adninController");

// importing user controllers
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
router.post(
  "/admin/create-new-staff",
  authMiddleware,
  adminMiddleware,
  createNewStaff
);
router.put(
  "/admin/update-collection-point/:id",
  authMiddleware,
  adminMiddleware,
  updateCollectionPoint
);
router.get("/admin/all-users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/admin/all-staff", authMiddleware, adminMiddleware, getAllStaff);

//USER ROUTES
router.post("/user/request-pickup/:userId", authMiddleware, requestPickUp);
router.get("/user/pickup-points", authMiddleware, getAllPickUp);
router.put("/users/:userId", authMiddleware, updateUserProfile);
router.put("/users/:userId/password", authMiddleware, updateUserPassword);
module.exports = router;
