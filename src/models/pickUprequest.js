const mongoose = require("mongoose");

const pickUpRequestSchema = new mongoose.Schema(
  {
    capacity: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: ["organic", "recyclable", "hazardous"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const PickUpRequest = mongoose.model("PickUpRequest", pickUpRequestSchema);
module.exports = PickUpRequest;
