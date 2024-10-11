const jwt = require("jsonwebtoken");

// AUTH MIDDLEWARE TO PROTECT ROUTES
exports.authMiddleware = (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header("Authorization");

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res
        .status(401)
        .json({ message: "Token verification failed, authorization denied" });
    }

    // Set the user id in the request object (req.user) for access in the next middleware/controller
    req.user = verified.id;

    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// module.exports = authMiddleware;
