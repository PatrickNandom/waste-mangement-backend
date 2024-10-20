const User = require("../models/userModel");
const PickUpRequest = require("../models/pickUprequest");
const bcryptjs = require("bcryptjs");

//CREATE A NEW STAFF CONTROLLER
exports.createNewStaff = async (req, res) => {
  const { name, email, phone, role } = req.body;
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Set default password to '1234' and hash it
    const defaultPassword = "1234";
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(defaultPassword, salt);

    // Create the new staff user object
    user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "staff",
    });

    // Save the user to the database
    await user.save();

    //  Return success response
    res.status(201).json({
      message: "Staff created successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE A PICK UP REQUEST CONTROLLER
exports.updatePickUpRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validate that the status provided is one of the allowed enum values
    if (!["Pending", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedPickUpRequest = await PickUpRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedPickUpRequest) {
      return res
        .status(404)
        .json({ message: "pick up request point not found" });
    }

    // Return the updated collection point
    res.status(200).json(updatedPickUpRequest);
  } catch (error) {
    console.error("Error updating pick up request point:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//FETCH ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    // Find all users with role "user"
    const users = await User.find({ role: "user" });

    // If no users are found
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the list of users
    res.status(200).json({ users, totalUsers: users.length });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//FETCH ALL STAFFS
exports.getAllStaff = async (req, res) => {
  try {
    // Find all users with role "staff"
    const staffs = await User.find({ role: "staff" });

    // If no staff are found
    if (staffs.length === 0) {
      return res.status(404).json({ message: "No staff found" });
    }

    // Return the list of staffs
    res.status(200).json({ staffs, totalStaff: staffs.length });
  } catch (error) {
    console.error("Error fetching staffs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// FETCH ALL PICKUPS
exports.getAllPickUp = async (req, res) => {
  try {
    const pickUpRequests = await PickUpRequest.find();

    if (pickUpRequests.length === 0) {
      return res.status(404).json({ message: "No pick up request found." });
    }

    res.status(200).json({
      message: "Pick up request retrieved successfully.",
      pickUpRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

//FETCHING COMPLETED PICKUP
exports.getCompletedPickUp = async (req, res) => {
  try {
    const completedPickups = await PickUpRequest.find({
      status: "Completed",
    });

    if (completedPickups.length === 0) {
      return res.status(404).json({ message: "No completed pickups found." });
    }

    res.status(200).json({
      message: "Completed pickups retrieved successfully.",
      completedPickups,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

//FETCHING PENDING PICKUP
exports.getPendingPickUp = async (req, res) => {
  try {
    const pendingPickups = await PickUpRequest.find({
      status: "Pending",
    });

    if (pendingPickups.length === 0) {
      return res.status(404).json({ message: "No pending pickups found." });
    }

    res.status(200).json({
      message: "Pending pickups retrieved successfully.",
      pendingPickups,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
