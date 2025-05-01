const mongoose = require("mongoose");
const Promotion = require("../models/Promotion");
const Trip = require("../models/Trip");
const Car = require("../models/Car");

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
    const user = req.user;

    // Kiểm tra thông tin user
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    // Kiểm tra quyền: Chỉ GARAGE hoặc ADMIN được tạo
    if (!["GARAGE", "ADMIN"].includes(user.role)) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to create a promotion",
      });
    }

    // Kiểm tra dữ liệu đầu vào
    const validDiscountTypes = ["Percentage", "Fixed"];
    const validStatuses = ["Không kích hoạt", "Kích hoạt", "Hết hạn"];
    if (
      !code ||
      !discountType ||
      !validDiscountTypes.includes(discountType) ||
      !discountValue ||
      discountValue <= 0 ||
      !startDate ||
      isNaN(new Date(startDate)) ||
      !endDate ||
      isNaN(new Date(endDate)) ||
      (status && !validStatuses.includes(status))
    ) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid or missing required fields",
      });
    }

    // Kiểm tra endDate sau startDate
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        errCode: 1,
        message: "End date must be after start date",
      });
    }

    // Kiểm tra mã code đã tồn tại
    const existingPromotion = await Promotion.findOne({ code }).lean();
    if (existingPromotion) {
      return res.status(400).json({
        errCode: 1,
        message: "Promotion code already exists",
      });
    }

    // Kiểm tra applicableTrips
    let validatedTrips = [];
    if (applicableTrips && applicableTrips.length > 0) {
      if (
        !Array.isArray(applicableTrips) ||
        applicableTrips.some((id) => !mongoose.isValidObjectId(id))
      ) {
        return res.status(400).json({
          errCode: 1,
          message: "Invalid trip IDs in applicableTrips",
        });
      }

      const trips = await Trip.find({ _id: { $in: applicableTrips } }).lean();
      const invalidTripIds = applicableTrips.filter(
        (id) => !trips.some((trip) => trip._id.equals(id))
      );
      if (invalidTripIds.length > 0) {
        return res.status(400).json({
          errCode: 1,
          message: `Invalid trip IDs: ${invalidTripIds.join(", ")}`,
        });
      }

      // Kiểm tra xe của chuyến thuộc nhà xe
      const carIds = trips.map((trip) => trip.carId);
      console.log("Danh sách carIds từ trips:", carIds);

      const cars = await Car.find({
        _id: { $in: carIds },
        userId: user.id,
      }).lean();
      console.log("Danh sách xe tìm được thuộc user:", cars);

      const invalidCarIds = carIds.filter(
        (carId) => !cars.some((car) => car._id.equals(carId))
      );
      console.log("Các carId không hợp lệ (không thuộc user):", invalidCarIds);

      const invalidTrips = trips
        .filter((trip) =>
          invalidCarIds.some((carId) => carId.equals(trip.carId))
        )
        .map((trip) => trip._id);
      console.log(
        "Các trip không hợp lệ (không thuộc xe trong garage):",
        invalidTrips
      );

      if (cars.length !== carIds.length && user.role !== "ADMIN") {
        return res.status(403).json({
          errCode: 1,
          message: `Một số chuyến đi không thuộc xe trong garage của bạn: ${invalidTrips.join(
            ", "
          )}`,
        });
      }

      validatedTrips = applicableTrips;
    }

    // Tạo promotion mới
    const promotion = new Promotion({
      code,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      applicableTrips: validatedTrips,
      maxUses: maxUses || 0,
      status: status || "Kích hoạt",
      usedCount: 0,
      garageId: user.id,
    });

    await promotion.save();

    // Populate applicableTrips
    const populatedPromotion = await Promotion.findById(promotion._id)
      .populate("applicableTrips", "pickupPoint dropOffPoint departureTime")
      .lean();

    return res.status(201).json({
      errCode: 0,
      message: "Promotion created successfully",
      data: { promotion: populatedPromotion },
    });
  } catch (error) {
    console.error("Error creating promotion:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        errCode: 1,
        message: "Duplicate key error: Promotion code already exists",
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({
        errCode: 1,
        message: `Validation error: ${Object.values(error.errors)
          .map((e) => e.message)
          .join(", ")}`,
      });
    }
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Get all promotions
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
    const user = req.user;

    // Kiểm tra thông tin user
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    // Xây dựng bộ lọc
    const filter = {};
    if (code) filter.code = { $regex: code, $options: "i" };
    if (status) filter.status = status;
    if (startDate) filter.startDate = { $gte: new Date(startDate) };
    if (endDate) filter.endDate = { $lte: new Date(endDate) };
    if (user.role === "GARAGE") {
      filter.garageId = user.id; // Chỉ lấy mã của nhà xe
    }

    // Phân trang
    const promotions = await Promotion.find(filter)
      .populate(
        "applicableTrips",
        "pickupPoint dropOffPoint departureTime dropOffProvince pickupProvince"
      )
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

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

    // Tìm promotion
    const filter = { _id: id };
    if (user.role === "GARAGE") {
      filter.garageId = user.id;
    }

    const promotion = await Promotion.findOne(filter)
      .populate(
        "applicableTrips",
        "pickupProvince dropOffProvince pickupPoint dropOffPoint departureTime"
      )
      .lean();

    if (!promotion) {
      return res.status(404).json({
        errCode: 1,
        message: "Promotion not found or you do not have permission",
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: "Promotion retrieved successfully",
      data: { promotion },
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
    console.log(" check thong tin ", req.body);

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

    // Kiểm tra quyền
    if (!["GARAGE", "ADMIN"].includes(user.role)) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to update this promotion",
      });
    }

    // Tìm promotion
    const filter = { _id: id };
    if (user.role === "GARAGE") {
      filter.garageId = user.id;
    }
    const promotion = await Promotion.findOne(filter);
    if (!promotion) {
      return res.status(404).json({
        errCode: 1,
        message: "Promotion not found or you do not have permission",
      });
    }

    // Kiểm tra mã code nếu được cập nhật
    if (code && code !== promotion.code) {
      const existingPromotion = await Promotion.findOne({ code }).lean();
      if (existingPromotion) {
        return res.status(400).json({
          errCode: 1,
          message: "Promotion code already exists",
        });
      }
    }

    // Kiểm tra applicableTrips nếu được cập nhật
    let validatedTrips = promotion.applicableTrips;
    if (applicableTrips && applicableTrips.length > 0) {
      const trips = await Trip.find({ _id: { $in: applicableTrips } }).lean();
      if (trips.length !== applicableTrips.length) {
        return res.status(400).json({
          errCode: 1,
          message: "One or more trip IDs are invalid",
        });
      }

      // Kiểm tra xe của chuyến thuộc nhà xe
      const carIds = trips.map((trip) => trip.carId);
      const cars = await Car.find({
        _id: { $in: carIds },
        userId: user.id,
      }).lean();
      if (cars.length !== carIds.length && user.role !== "ADMIN") {
        return res.status(403).json({
          errCode: 1,
          message: "Some trips are not associated with your garage's cars",
        });
      }
      validatedTrips = applicableTrips;
    }

    // Tạo object chứa các trường cần cập nhật
    const updateFields = {};
    if (code) updateFields.code = code;
    if (description) updateFields.description = description;
    if (discountType) updateFields.discountType = discountType;
    if (discountValue) updateFields.discountValue = discountValue;
    if (startDate) updateFields.startDate = startDate;
    if (endDate) updateFields.endDate = endDate;
    if (applicableTrips) updateFields.applicableTrips = validatedTrips;
    if (maxUses !== undefined) updateFields.maxUses = maxUses;
    if (status) updateFields.status = status;

    // Cập nhật promotion
    const updatedPromotion = await Promotion.findOneAndUpdate(
      filter,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .populate("applicableTrips", "pickupPoint dropOffPoint departureTime")
      .lean();

    if (!updatedPromotion) {
      return res.status(404).json({
        errCode: 1,
        message: "Promotion not found or you do not have permission",
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: "Promotion updated successfully",
      data: { promotion: updatedPromotion },
    });
  } catch (error) {
    console.error("Error updating promotion:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        errCode: 1,
        message: "Duplicate key error: Promotion code already exists",
      });
    }
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

    // Kiểm tra quyền
    if (!["GARAGE", "ADMIN"].includes(user.role)) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to delete this promotion",
      });
    }

    // Tìm promotion
    const filter = { _id: id };
    if (user.role === "GARAGE") {
      filter.garageId = user.id;
    }
    const promotion = await Promotion.findOne(filter);
    if (!promotion) {
      return res.status(404).json({
        errCode: 1,
        message: "Promotion not found or you do not have permission",
      });
    }

    // Chỉ cho phép xóa nếu chưa sử dụng hoặc trạng thái Inactive/Expired
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
    await Promotion.deleteOne({ _id: id });

    return res.status(200).json({
      errCode: 0,
      message: "Promotion deleted successfully",
      data: {},
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
