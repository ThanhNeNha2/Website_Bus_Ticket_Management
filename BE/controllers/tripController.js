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
      !carId
    ) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing required fields",
      });
    }

    // Kiểm tra carId hợp lệ
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        errCode: 1,
        message: "Car not found",
      });
    }

    // Kiểm tra quyền sở hữu hoặc vai trò
    const user = req.user; // Giả định req.user từ middleware xác thực
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    const isOwner = car.userId.toString() === user.id;
    const hasPermission = user.role === "GARAGE";
    if (!isOwner && !hasPermission) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to create this trip",
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
      status: status || "Scheduled",
      totalSeats: car.seats,
      seatsAvailable: car.seats,
    });

    await trip.save();

    // Populate carId
    const populatedTrip = await Trip.findById(trip._id).populate(
      "carId",
      "nameCar licensePlate seats"
    );

    return res.status(201).json({
      errCode: 0,
      message: "Trip created successfully",
      trip: populatedTrip,
    });
  } catch (error) {
    console.error("Error creating trip:", error);
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
      departureDate,
      page = 1,
      limit = 2,
    } = req.query;

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

    // Phân trang
    const trips = await Trip.find(filter)
      .populate("carId", "nameCar licensePlate seats")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ departureDate: 1 });

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

    const trip = await Trip.findById(id).populate(
      "carId",
      "nameCar licensePlate seats"
    );
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
      ticketPrice,
      departureTime,
      arrivalTime,
      departureDate,
      arrivalDate,
      carId,
      status,
    } = req.body;

    // Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid trip ID",
      });
    }

    // Kiểm tra dữ liệu đầu vào
    if (
      !pickupPoint &&
      !dropOffPoint &&
      !ticketPrice &&
      !departureTime &&
      !arrivalTime &&
      !departureDate &&
      !arrivalDate &&
      !carId &&
      !status
    ) {
      return res.status(400).json({
        errCode: 1,
        message: "No fields provided for update",
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

    const car = await Car.findById(carId || trip.carId);
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
        message: "You do not have permission to update this trip",
      });
    }

    // Tạo object chứa các trường cần cập nhật
    const updateFields = {};
    if (pickupPoint) updateFields.pickupPoint = pickupPoint;
    if (dropOffPoint) updateFields.dropOffPoint = dropOffPoint;
    if (ticketPrice) updateFields.ticketPrice = ticketPrice;
    if (departureTime) updateFields.departureTime = departureTime;
    if (arrivalTime) updateFields.arrivalTime = arrivalTime;
    if (departureDate) updateFields.departureDate = departureDate;
    if (arrivalDate) updateFields.arrivalDate = arrivalDate;
    if (carId) {
      updateFields.carId = carId;
      updateFields.totalSeats = car.seats;
      updateFields.seatsAvailable = car.seats; // Reset seatsAvailable khi đổi xe
    }
    if (status) updateFields.status = status;

    // Cập nhật trip
    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("carId", "nameCar licensePlate seats");

    if (!updatedTrip) {
      return res.status(404).json({
        errCode: 1,
        message: "Trip not found",
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: "Trip updated successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    console.error("Error updating trip:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
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
    if (!["Scheduled", "Canceled"].includes(trip.status)) {
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

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};
