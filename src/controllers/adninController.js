const User = require("../models/userModel");
const CollectionPoint = require("../models/collectionPointModel");
const bcryptjs = require("bcryptjs");

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
    const salt = await bcryptjs.genSalt(10); // Salt for password hashing
    const hashedPassword = await bcryptjs.hash(defaultPassword, salt); // Hash the password

    // Create the new staff user object
    user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "staff",
    });

    // Step 4: Save the user to the database
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
exports.updateCollectionPoint = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validate that the status provided is one of the allowed enum values
    if (!["Pending", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the collection point by ID and update the status
    const updatedCollectionPoint = await CollectionPoint.findByIdAndUpdate(
      id,
      { status },
      { new: true } // returns the updated document
    );

    // If no collection point found with the given ID
    if (!updatedCollectionPoint) {
      return res.status(404).json({ message: "Collection point not found" });
    }

    // Return the updated collection point
    res.status(200).json(updatedCollectionPoint);
  } catch (error) {
    console.error("Error updating collection point:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Find all users with role "user"
    const users = await User.find({ role: "user" });

    // If no users are found
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllStaff = async (req, res) => {
  try {
    // Find all users with role "user"
    const staffs = await User.find({ role: "staff" });

    // If no users are found
    if (staffs.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the list of users
    res.status(200).json(staffs);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};
