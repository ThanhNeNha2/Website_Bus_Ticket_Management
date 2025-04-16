const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: Number,
      required: true,
      maxlength: 12,
      minlength: 8,
      unique: true,
    },
    address: {
      type: String,
      minlength: 6,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "GARAGE"],
      default: "USER",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
