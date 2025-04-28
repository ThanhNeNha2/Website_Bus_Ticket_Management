const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    // điểm đón
    pickupPoint: {
      type: String,
      required: true,
      trim: true,
      enum: ["Bến xe Miền Đông", "Bến xe Đà Nẵng", "Bến xe Nha Trang"],
    },
    // Điểm đến
    dropOffPoint: {
      type: String,
      required: true,
      trim: true,
    },

    //  Tỉnh xuất phát
    pickupProvince: {
      type: String,
      required: true,
      trim: true,
    },
    // Tỉnh đi đến
    dropOffProvince: {
      type: String,
      required: true,
      trim: true,
    },
    // Gía vé
    ticketPrice: {
      type: Number,
      required: true,
      min: 0, // Giá vé không được âm
    },
    // Thời gian xuất phát
    departureTime: {
      type: Date,
      required: true,
    },
    // Thời gian đến
    arrivalTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return this.departureTime < value; // arrivalTime phải sau departureTime
        },
        message: "Arrival time must be after departure time",
      },
    },
    // Ngày đi
    departureDate: {
      type: Date,
      required: true,
    },

    arrivalDate: {
      type: Date,
      required: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Canceled", "InProgress"],
      default: "Scheduled",
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1, // Số ghế tối thiểu là 1
    },
    seatsAvailable: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.totalSeats; // Số ghế còn lại không được vượt quá tổng số ghế
        },
        message: "Seats available cannot exceed total seats",
      },
    },
  },
  { timestamps: true }
);

// Thêm index để tối ưu truy vấn
tripSchema.index({ departureDate: 1, pickupPoint: 1, dropOffPoint: 1 });

module.exports = mongoose.model("Trip", tripSchema);
