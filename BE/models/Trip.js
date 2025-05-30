const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    // điểm đón
    pickupPoint: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Bến xe Miền Đông",
        "Bến xe Miền Tây",
        "Bến xe Lương Yên",
        "Bến xe Gia Lâm",
        "Bến xe Đà Nẵng",
        "Bến xe Nha Trang",
      ],
    },
    // Điểm đến
    dropOffPoint: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Bến xe Miền Đông",
        "Bến xe Miền Tây",
        "Bến xe Lương Yên",
        "Bến xe Gia Lâm",
        "Bến xe Đà Nẵng",
        "Bến xe Nha Trang",
      ],
    },

    //  Tỉnh xuất phát
    pickupProvince: {
      type: String,
      required: true,
      enum: [
        "Hà Nội",
        "Đà Nẵng",
        "TP. Hồ Chí Minh",
        "Hải Phòng",
        "Cần Thơ",
        "Bình Dương",
        "Đồng Nai",
        "Quảng Ninh",
        "Thừa Thiên Huế",
        "Lâm Đồng",
        "Khánh Hòa",
        "Nghệ An",
        "Thanh Hóa",
        "Bình Định",
        "An Giang",
        "Vĩnh Long",
        "Sóc Trăng",
        "Kiên Giang",
        "Tây Ninh",
        "Phú Yên",
        "Bà Rịa - Vũng Tàu",
        "Gia Lai",
        "Đắk Lắk",
        "Quảng Nam",
        "Hậu Giang",
      ],
      trim: true,
    },
    // Tỉnh đi đến
    dropOffProvince: {
      type: String,
      required: true,
      enum: [
        "Hà Nội",
        "Đà Nẵng",
        "TP. Hồ Chí Minh",
        "Hải Phòng",
        "Cần Thơ",
        "Bình Dương",
        "Đồng Nai",
        "Quảng Ninh",
        "Thừa Thiên Huế",
        "Lâm Đồng",
        "Khánh Hòa",
        "Nghệ An",
        "Thanh Hóa",
        "Bình Định",
        "An Giang",
        "Vĩnh Long",
        "Sóc Trăng",
        "Kiên Giang",
        "Tây Ninh",
        "Phú Yên",
        "Bà Rịa - Vũng Tàu",
        "Gia Lai",
        "Đắk Lắk",
        "Quảng Nam",
        "Hậu Giang",
      ],
      trim: true,
    },
    // Gía vé
    ticketPrice: {
      type: Number,
      required: true,
      min: 0, // Giá vé không được âm
    },

    // Thời gian đến
    arrivalTime: { type: String, required: true },
    // Thời gian đi
    departureTime: { type: String, required: true },

    // Ngày đến
    arrivalDate: {
      type: Date,
      required: true,
    },
    // Ngày di
    departureDate: {
      type: Date,
      required: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Đã đến", "Đã xuất phát", "Chưa xuất phát", "Đã hủy"],
      default: "Chưa xuất phát",
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
    },
  },
  { timestamps: true }
);

// Thêm index để tối ưu truy vấn
tripSchema.index({ _id: 1, departureDate: 1, pickupPoint: 1, dropOffPoint: 1 });

module.exports = mongoose.model("Trip", tripSchema);
