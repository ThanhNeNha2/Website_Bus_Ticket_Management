const mongoose = require("mongoose");
const ticketSchema = new mongoose.Schema(
  {
    ticketCode: { type: String, required: true, unique: true },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Đã đặt", "Đã hủy", "Hết hiệu lực"],
      default: "Đã đặt",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
