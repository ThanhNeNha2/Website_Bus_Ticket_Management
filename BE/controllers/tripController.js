const mongoose = require("mongoose");
const Trip = require("../models/Trip");
const Car = require("../models/Car");

// Create a new trip
const createTrip = async (req, res) => {
  try {
    const {
      pickupPoint,
      dropOffPoint,
      ticketPrice,
      departureTime,
      arrivalTime,
      departureDate,
      arrivalDate,
      carId,
      status,
      dropOffProvince,
      pickupProvince,
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (
      !pickupPoint ||
      !dropOffPoint ||
      !ticketPrice ||
      !departureTime ||
      !arrivalTime ||
      !departureDate ||
      !arrivalDate ||
      !carId ||
      !dropOffProvince ||
      !pickupProvince
    ) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing required fields",
      });
    }
    console.log("req.body", req.body);

    // Kiểm tra carId hợp lệ
    const car = await Car.findById(carId).lean();
    if (!car) {
      return res.status(404).json({
        errCode: 1,
        message: "Car not found",
      });
    }

    // Kiểm tra quyền sở hữu hoặc vai trò
    const user = req.user;
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    const isOwner = car.userId.toString() === user.id;
    const hasPermission = user.role === "GARAGE" || user.role === "ADMIN";
    if (!isOwner && !hasPermission) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to create this trip",
      });
    }

    // Kiểm tra status hợp lệ
    const validStatuses = [
      "Đã đến",
      "Đã xuất phát",
      "Chưa xuất phát",
      "Đã hủy",
    ];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid status",
      });
    }

    // Tạo trip mới
    const trip = new Trip({
      pickupPoint,
      dropOffPoint,
      ticketPrice,
      departureTime,
      arrivalTime,
      departureDate,
      arrivalDate,
      carId,
      userId: user.id,
      status: status || "Chưa xuất phát",
      dropOffProvince,
      pickupProvince,
      totalSeats: car.seats,
      seatsAvailable: car.seats,
    });

    await trip.save();

    // Populate carId và userId
    const populatedTrip = await Trip.findById(trip._id)
      .populate("carId", "nameCar licensePlate seats")
      .populate("userId", "username email")
      .lean();

    return res.status(201).json({
      errCode: 0,
      message: "Trip created successfully",
      trip: populatedTrip,
    });
  } catch (error) {
    console.error("Error creating trip:", error);
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

// Get all trips (hỗ trợ tìm kiếm)
const getAllTrips = async (req, res) => {
  try {
    const {
      pickupPoint,
      dropOffPoint,
      pickupProvince,
      dropOffProvince,
      departureDate,
      carType,
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
    if (pickupPoint)
      filter.pickupPoint = { $regex: pickupPoint, $options: "i" };
    if (dropOffPoint)
      filter.dropOffPoint = { $regex: dropOffPoint, $options: "i" };
    if (pickupProvince)
      filter.pickupProvince = { $regex: pickupProvince, $options: "i" };
    if (dropOffProvince)
      filter.dropOffProvince = { $regex: dropOffProvince, $options: "i" };
    if (departureDate) {
      const startOfDay = new Date(departureDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(departureDate);
      endOfDay.setHours(23, 59, 59, 999);
      filter.departureDate = { $gte: startOfDay, $lte: endOfDay };
    }

    // Lọc theo vehicleType (SIT hoặc BED)
    let carIds = [];
    if (carType) {
      const validCarTypes = ["SIT", "BED"];
      if (!validCarTypes.includes(carType)) {
        return res.status(400).json({
          errCode: 1,
          message: "Invalid car type. Must be SIT or BED",
        });
      }
      const carsByType = await Car.find({ vehicleType: carType })
        .select("_id")
        .lean();
      carIds = carsByType.map((car) => car._id);
      if (carIds.length === 0) {
        return res.status(404).json({
          errCode: 1,
          message: `No cars found with vehicle type ${carType}`,
        });
      }
    }

    // Nếu là GARAGE, chỉ lấy chuyến đi thuộc xe của nhà xe
    // if (user.role === "GARAGE") {
    //   const carsByUser = await Car.find({ userId: user.id })
    //     .select("_id")
    //     .lean();
    //   const userCarIds = carsByUser.map((car) => car._id);
    //   // Kết hợp carIds từ vehicleType (nếu có) và userCarIds
    //   carIds =
    //     carIds.length > 0
    //       ? carIds.filter((id) => userCarIds.includes(id))
    //       : userCarIds;
    //   if (carIds.length === 0) {
    //     return res.status(404).json({
    //       errCode: 1,
    //       message: "No cars found for this garage",
    //     });
    //   }
    // }

    // Áp dụng carIds vào bộ lọc
    if (carIds.length > 0) {
      filter.carId = { $in: carIds };
    }

    // Phân trang
    const trips = await Trip.find(filter)
      .populate("carId", "nameCar licensePlate seats vehicleType")
      .populate("userId", "username phone address image description email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ departureDate: 1 })
      .lean();

    const total = await Trip.countDocuments(filter);

    return res.status(200).json({
      errCode: 0,
      message: "Trips retrieved successfully",
      data: {
        trips,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error retrieving trips:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Get a single trip by ID
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid trip ID",
      });
    }

    const trip = await Trip.findById(id)
      .populate("carId", "nameCar licensePlate seats")
      .populate("userId", "username phone address image description email");
    if (!trip) {
      return res.status(404).json({
        errCode: 1,
        message: "Trip not found",
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: "Trip retrieved successfully",
      trip,
    });
  } catch (error) {
    console.error("Error retrieving trip:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Update a trip
const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      pickupPoint,
      dropOffPoint,
      pickupProvince,
      dropOffProvince,
      ticketPrice,
      departureTime,
      arrivalTime,
      departureDate,
      arrivalDate,
      carId,
      status,
      totalSeats,
      seatsAvailable,
    } = req.body;

    console.log("Thông tin update truyền về:", req.body);

    // Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        errCode: 1,
        message: "ID chuyến xe không hợp lệ",
      });
    }

    // Kiểm tra dữ liệu đầu vào
    if (
      !pickupPoint &&
      !dropOffPoint &&
      !pickupProvince &&
      !dropOffProvince &&
      !ticketPrice &&
      !departureTime &&
      !arrivalTime &&
      !departureDate &&
      !arrivalDate &&
      !carId &&
      !status &&
      totalSeats === undefined &&
      seatsAvailable === undefined
    ) {
      return res.status(400).json({
        errCode: 1,
        message: "Không có trường nào được cung cấp để cập nhật",
      });
    }

    // Tìm chuyến xe hiện tại
    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({
        errCode: 1,
        message: "Không tìm thấy chuyến xe",
      });
    }

    // Kiểm tra quyền cập nhật
    const user = req.user;
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "Không có thông tin người dùng hoặc vai trò",
      });
    }

    const car = await Car.findById(carId || trip.carId);
    if (!car) {
      return res.status(404).json({
        errCode: 1,
        message: "Không tìm thấy xe",
      });
    }

    const isOwner = car.userId.toString() === user.id;
    const hasPermission = user.role === "GARAGE";
    if (!isOwner && !hasPermission) {
      return res.status(403).json({
        errCode: 1,
        message: "Bạn không có quyền cập nhật chuyến xe này",
      });
    }

    // Chuẩn bị object cập nhật
    const updateFields = {};

    if (pickupPoint) updateFields.pickupPoint = pickupPoint;
    if (dropOffPoint) updateFields.dropOffPoint = dropOffPoint;
    if (pickupProvince) updateFields.pickupProvince = pickupProvince;
    if (dropOffProvince) updateFields.dropOffProvince = dropOffProvince;
    if (ticketPrice) updateFields.ticketPrice = ticketPrice;
    if (departureTime) updateFields.departureTime = departureTime;
    if (arrivalTime) updateFields.arrivalTime = arrivalTime;

    // FIX: Properly handle dates without modifying their format
    if (departureDate) {
      updateFields.departureDate = new Date(departureDate);
    }
    if (arrivalDate) {
      updateFields.arrivalDate = new Date(arrivalDate);
    }

    if (status) updateFields.status = status;

    // Xử lý carId và số ghế
    if (carId) {
      updateFields.carId = carId;
      updateFields.totalSeats = car.seats;
      updateFields.seatsAvailable = car.seats;
    }

    // FIX: Store the currentTotalSeats to use in validation
    const currentTotalSeats =
      totalSeats !== undefined ? parseInt(totalSeats, 10) : trip.totalSeats;

    if (totalSeats !== undefined) {
      updateFields.totalSeats = parseInt(totalSeats, 10);
    }

    if (seatsAvailable !== undefined) {
      updateFields.seatsAvailable = parseInt(seatsAvailable, 10);

      // FIX: Check against the correct total seats value
      if (updateFields.seatsAvailable > currentTotalSeats) {
        return res.status(400).json({
          errCode: 1,
          message: `Số ghế còn trống (${updateFields.seatsAvailable}) không được vượt quá tổng số ghế (${currentTotalSeats})`,
        });
      }
    }

    // Thực hiện cập nhật
    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("carId", "nameCar licensePlate seats");

    if (!updatedTrip) {
      return res.status(404).json({
        errCode: 1,
        message: "Không tìm thấy chuyến xe sau cập nhật",
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: "Cập nhật chuyến xe thành công",
      trip: updatedTrip,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật chuyến xe:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Lỗi máy chủ nội bộ",
      error: error.message, // Add this to provide more details about the error
    });
  }
};

// Delete a trip
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid trip ID",
      });
    }

    // Tìm trip
    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({
        errCode: 1,
        message: "Trip not found",
      });
    }

    // Kiểm tra quyền sở hữu hoặc vai trò
    const user = req.user;
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    const car = await Car.findById(trip.carId);
    if (!car) {
      return res.status(404).json({
        errCode: 1,
        message: "Car not found",
      });
    }

    const isOwner = car.userId.toString() === user.id;
    const hasPermission = user.role === "GARAGE";
    if (!isOwner && !hasPermission) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to delete this trip",
      });
    }

    // Chỉ cho phép xóa nếu trạng thái là Scheduled hoặc Canceled
    if (!["Chưa xuất phát", "Đã hủy", "Đã đến"].includes(trip.status)) {
      return res.status(400).json({
        errCode: 1,
        message: "Cannot delete trip in progress or completed",
      });
    }

    await trip.deleteOne();

    return res.status(200).json({
      errCode: 0,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

//  Ngoài pham vi của trip

// Lấy Trip cho promotion
const getAllTripNoPage = async (req, res) => {
  try {
    const { pickupPoint, dropOffPoint, departureDate } = req.query;
    const user = req.user; // Giả định req.user từ middleware xác thực

    // Kiểm tra thông tin user
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    // Kiểm tra quyền: Chỉ GARAGE hoặc ADMIN được truy cập
    if (!["GARAGE", "ADMIN"].includes(user.role)) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to view trips",
      });
    }

    // Xây dựng bộ lọc
    const filter = {};
    if (pickupPoint) filter.pickupPoint = pickupPoint;
    if (dropOffPoint) filter.dropOffPoint = dropOffPoint;
    if (departureDate) {
      const startOfDay = new Date(departureDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(departureDate);
      endOfDay.setHours(23, 59, 59, 999);
      filter.departureDate = { $gte: startOfDay, $lte: endOfDay };
    }

    // Nếu là GARAGE, chỉ lấy chuyến đi thuộc xe của nhà xe
    if (user.role === "GARAGE") {
      // Tìm các xe thuộc nhà xe
      const cars = await Car.find({ userId: user.id }).select("_id").lean();
      const carIds = cars.map((car) => car._id);
      if (carIds.length === 0) {
        return res.status(200).json({
          errCode: 0,
          message: "No trips found for your garage",
          data: { trips: [] },
        });
      }
      filter.carId = { $in: carIds };
    }

    // Lấy tất cả chuyến đi với dropOffProvince, pickupProvince, _id
    const trips = await Trip.find(filter)
      .select("dropOffProvince pickupProvince _id")
      .sort({ departureDate: 1 })
      .lean();

    return res.status(200).json({
      errCode: 0,
      message: "Trips retrieved successfully",
      data: { trips },
    });
  } catch (error) {
    console.error("Error retrieving trips:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getAllTripNoPage,
};
