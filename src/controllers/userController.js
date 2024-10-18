const User = require("../models/userModel");
const CollectionPoint = require("../models/collectionPointModel");
const bcryptjs = require("bcryptjs");

//MAKING REQUEST FOR PICKUPS
exports.requestPickUp = async (req, res) => {
  try {
    const { userId } = req.params;
    const { capacity, location, time, category } = req.body;

    if (!capacity || !location || !time || !category) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Fetch the user by userId
    let user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Create a new collection point entry
    let collectionPoint = new CollectionPoint({
      capacity,
      location,
      time,
      category,
      user_name: user.name,
      phone: user.phone,
    });

    await collectionPoint.save();

    res.status(201).json({
      message: "Collection point created successfully",
      collectionPoint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

//GETTING ALL THE PICKUP REQUEST
exports.getAllPickUp = async (req, res) => {
  try {
    const collectionPoints = await CollectionPoint.find();

    if (collectionPoints.length === 0) {
      return res.status(404).json({ message: "No collection points found." });
    }

    res.status(200).json({
      message: "Collection points retrieved successfully.",
      collectionPoints,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// UPDATING USER PROFILE
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone } = req.body;

    // Find the user by ID
    let user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the fields that were provided
    if (name) user.name = name;
    if (email) {
      // Validate email before updating
      const emailRegex =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (!email.match(emailRegex)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      user.email = email;
    }
    if (phone) {
      // Validate phone number before updating
      const phoneRegex = /^(\+234|0)[789]\d{9}$/;
      if (!phone.match(phoneRegex)) {
        return res.status(400).json({
          message:
            "Invalid phone number format (e.g., +2347012345678 or 07012345678)",
        });
      }
      user.phone = phone;
    }

    await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// CONTROLLER FOR UPDATING PASSWORD
exports.updateUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide both current and new passwords." });
    }

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    const hashedNewPassword = await bcryptjs.hash(newPassword, 8);

    user.password = hashedNewPassword;

    await user.save();

    // Respond with success
    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
