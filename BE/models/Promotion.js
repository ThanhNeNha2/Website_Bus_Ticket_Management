const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    discountType: {
      type: String,
      enum: ["Percentage", "Fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    applicableTrips: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
      },
    ],
    maxUses: {
      type: Number,
      min: 0,
      default: 0, // 0 nghĩa là không giới hạn
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Không kích hoạt", "Kích hoạt", "Hết hạn"],
      default: "Kích hoạt",
    },
    garageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Bắt buộc để liên kết với nhà xe
    },
  },
  { timestamps: true }
);

promotionSchema.index({ code: 1 }, { unique: true });
promotionSchema.index({ garageId: 1 });

module.exports = mongoose.model("Promotion", promotionSchema);
