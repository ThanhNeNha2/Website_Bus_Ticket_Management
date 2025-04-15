const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    nameCar: {
      type: String,
      required: true,
    },
    // biển số xe
    licensePlate: {
      type: String,
      required: true,
      unique: true,
    },
    // Tiên ích xe
    features: {
      type: [String], // Ví dụ: ["WiFi", "AC", "Charger"]
      default: [],
    },
    // chỗ ngồi
    seats: {
      type: Number,
      required: true,
    },
    vehicleTypeId: {
      type: String,
      default: "SIT",
    },
    image: {
      type: String, // Có thể là URL ảnh hoặc tên file
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);
