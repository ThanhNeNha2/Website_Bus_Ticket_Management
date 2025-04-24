const mongoose = require("mongoose");
const Promotion = require("../models/Promotion");
const Trip = require("../models/Trip");

// Create a new promotion
const createPromotion = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      applicableTrips,
      maxUses,
      status,
    } = req.body;
    const user = req.user; // Giả định req.user từ middleware xác thực

    // Kiểm tra dữ liệu đầu vào
    if (!code || !discountType || !discountValue || !startDate || !endDate) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing required fields",
      });
    }

    // Kiểm tra thông tin user
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    // Kiểm tra quyền: Chỉ ADMIN hoặc GARAGE được tạo
    if (!["ADMIN", "GARAGE"].includes(user.role)) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to create a promotion",
      });
    }

    // Kiểm tra mã code đã tồn tại
    const existingPromotion = await Promotion.findOne({ code });
    if (existingPromotion) {
      return res.status(400).json({
        errCode: 1,
        message: "Promotion code already exists",
      });
    }

    // Kiểm tra applicableTrips (nếu có)
    if (applicableTrips && applicableTrips.length > 0) {
      const trips = await Trip.find({ _id: { $in: applicableTrips } });
      if (trips.length !== applicableTrips.length) {
        return res.status(400).json({
          errCode: 1,
          message: "One or more trip IDs are invalid",
        });
      }
    }

    // Tạo promotion mới
    const promotion = new Promotion({
      code,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      applicableTrips: applicableTrips || [],
      maxUses: maxUses || 0,
      status: status || "Active",
      usedCount: 0,
    });

    await promotion.save();

    // Populate applicableTrips
    const populatedPromotion = await Promotion.findById(promotion._id).populate(
      "applicableTrips",
      "pickupPoint dropOffPoint departureTime"
    );

    return res.status(201).json({
      errCode: 0,
      message: "Promotion created successfully",
      promotion: populatedPromotion,
    });
  } catch (error) {
    console.error("Error creating promotion:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Get all promotions (hỗ trợ tìm kiếm)
const getAllPromotions = async (req, res) => {
  try {
    const {
      code,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Xây dựng bộ lọc
    const filter = {};
    if (code) filter.code = { $regex: code, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
    if (status) filter.status = status;
    if (startDate) filter.startDate = { $gte: new Date(startDate) };
    if (endDate) filter.endDate = { $lte: new Date(endDate) };

    // Phân trang
    const promotions = await Promotion.find(filter)
      .populate("applicableTrips", "pickupPoint dropOffPoint departureTime")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Promotion.countDocuments(filter);

    return res.status(200).json({
      errCode: 0,
      message: "Promotions retrieved successfully",
      data: {
        promotions,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error retrieving promotions:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Get a single promotion by ID
const getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid promotion ID",
      });
    }

    const promotion = await Promotion.findById(id).populate(
      "applicableTrips",
      "pickupPoint dropOffPoint departureTime"
    );

    if (!promotion) {
      return res.status(404).json({
        errCode: 1,
        message: "Promotion not found",
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: "Promotion retrieved successfully",
      promotion,
    });
  } catch (error) {
    console.error("Error retrieving promotion:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Update a promotion
const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      applicableTrips,
      maxUses,
      status,
    } = req.body;
    const user = req.user;

    // Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid promotion ID",
      });
    }

    // Kiểm tra dữ liệu đầu vào
    if (
      !code &&
      !description &&
      !discountType &&
      !discountValue &&
      !startDate &&
      !endDate &&
      !applicableTrips &&
      !maxUses &&
      !status
    ) {
      return res.status(400).json({
        errCode: 1,
        message: "No fields provided for update",
      });
    }

    // Kiểm tra thông tin user
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    // Kiểm tra quyền: Chỉ ADMIN hoặc GARAGE được cập nhật
    if (!["ADMIN", "GARAGE"].includes(user.role)) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to update this promotion",
      });
    }

    // Tìm promotion
    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({
        errCode: 1,
        message: "Promotion not found",
      });
    }

    // Kiểm tra mã code nếu được cập nhật
    if (code && code !== promotion.code) {
      const existingPromotion = await Promotion.findOne({ code });
      if (existingPromotion) {
        return res.status(400).json({
          errCode: 1,
          message: "Promotion code already exists",
        });
      }
    }

    // Kiểm tra applicableTrips nếu được cập nhật
    if (applicableTrips && applicableTrips.length > 0) {
      const trips = await Trip.find({ _id: { $in: applicableTrips } });
      if (trips.length !== applicableTrips.length) {
        return res.status(400).json({
          errCode: 1,
          message: "One or more trip IDs are invalid",
        });
      }
    }

    // Tạo object chứa các trường cần cập nhật
    const updateFields = {};
    if (code) updateFields.code = code;
    if (description) updateFields.description = description;
    if (discountType) updateFields.discountType = discountType;
    if (discountValue) updateFields.discountValue = discountValue;
    if (startDate) updateFields.startDate = startDate;
    if (endDate) updateFields.endDate = endDate;
    if (applicableTrips) updateFields.applicableTrips = applicableTrips;
    if (maxUses !== undefined) updateFields.maxUses = maxUses;
    if (status) updateFields.status = status;

    // Cập nhật promotion
    const updatedPromotion = await Promotion.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("applicableTrips", "pickupPoint dropOffPoint departureTime");

    if (!updatedPromotion) {
      return res.status(404).json({
        errCode: 1,
        message: "Promotion not found",
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: "Promotion updated successfully",
      promotion: updatedPromotion,
    });
  } catch (error) {
    console.error("Error updating promotion:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Delete a promotion
const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid promotion ID",
      });
    }

    // Kiểm tra thông tin user
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    // Kiểm tra quyền: Chỉ ADMIN hoặc GARAGE được xóa
    if (!["ADMIN", "GARAGE"].includes(user.role)) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to delete this promotion",
      });
    }

    // Tìm promotion
    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({
        errCode: 1,
        message: "Promotion not found",
      });
    }

    // Chỉ cho phép xóa nếu chưa sử dụng (usedCount = 0) hoặc trạng thái Inactive/Expired
    if (
      promotion.usedCount > 0 &&
      !["Inactive", "Expired"].includes(promotion.status)
    ) {
      return res.status(400).json({
        errCode: 1,
        message: "Cannot delete promotion that has been used or is active",
      });
    }

    // Xóa promotion
    await promotion.deleteOne();

    return res.status(200).json({
      errCode: 0,
      message: "Promotion deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
};
