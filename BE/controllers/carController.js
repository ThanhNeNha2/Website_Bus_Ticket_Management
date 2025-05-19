const mongoose = require("mongoose");
const Car = require("../models/Car");
const Trip = require("../models/Trip");

// Create a new car
const createCar = async (req, res) => {
  try {
    const { nameCar, licensePlate, features, seats, vehicleType, image } =
      req.body;
    const user = req.user;

    // Kiểm tra thông tin user
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    // Kiểm tra quyền: Chỉ USER hoặc ADMIN được tạo xe
    if (!["USER", "ADMIN"].includes(user.role)) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to create a car",
      });
    }

    // Kiểm tra dữ liệu đầu vào
    if (!nameCar || !licensePlate || !seats) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing required fields: nameCar, licensePlate, seats",
      });
    }

    // Kiểm tra seats hợp lệ
    if (!Number.isInteger(seats) || seats <= 0) {
      return res.status(400).json({
        errCode: 1,
        message: "Seats must be a positive integer",
      });
    }

    // Kiểm tra vehicleType hợp lệ
    if (vehicleType && !["SIT", "BED"].includes(vehicleType)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid vehicle type. Must be SIT or BED",
      });
    }

    // Kiểm tra biển số xe đã tồn tại
    const existingCar = await Car.findOne({ licensePlate }).lean();
    if (existingCar) {
      return res.status(400).json({
        errCode: 1,
        message: "License plate already exists",
      });
    }

    // Tạo xe mới
    const car = new Car({
      nameCar,
      licensePlate,
      features: Array.isArray(features) ? features : [],
      seats,
      vehicleType: vehicleType || "SIT",
      image: image || null,
      userId: user.id,
    });

    await car.save();

    // Populate userId
    const populatedCar = await Car.findById(car._id)
      .populate("userId", "username email")
      .lean();

    return res.status(201).json({
      errCode: 0,
      message: "Car created successfully",
      data: { car: populatedCar },
    });
  } catch (error) {
    console.error("Error creating car:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        errCode: 1,
        message: "Duplicate key error: License plate already exists",
      });
    }
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Get all cars with pagination and filtering
const getAllCars = async (req, res) => {
  try {
    const { page = 1, limit = 10, licensePlate, vehicleType } = req.query;
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
    if (user.role === "USER") {
      filter.userId = user.id; // Chỉ lấy xe của USER
    }
    if (licensePlate) {
      filter.licensePlate = { $regex: licensePlate, $options: "i" };
    }
    if (vehicleType) {
      const validVehicleTypes = ["SIT", "BED"];
      if (!validVehicleTypes.includes(vehicleType)) {
        return res.status(400).json({
          errCode: 1,
          message: "Invalid vehicle type. Must be SIT or BED",
        });
      }
      filter.vehicleType = vehicleType;
    }

    // Phân trang
    const cars = await Car.find(filter)
      .populate("userId", "username email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

    const total = await Car.countDocuments(filter);

    return res.status(200).json({
      errCode: 0,
      message: "Cars retrieved successfully",
      data: {
        cars,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Get all cars without pagination
const getAllCarsNoPage = async (req, res) => {
  try {
    const { licensePlate, vehicleType } = req.query;
    const user = req.user;

    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    const filter = {};
    if (user.role === "ADMIN") {
      filter.userId = user.id;
    }
    if (licensePlate) {
      filter.licensePlate = { $regex: licensePlate, $options: "i" };
    }
    if (vehicleType) {
      const validVehicleTypes = ["SIT", "BED"];
      if (!validVehicleTypes.includes(vehicleType)) {
        return res.status(400).json({
          errCode: 1,
          message: "Invalid vehicle type. Must be SIT or BED",
        });
      }
      filter.vehicleType = vehicleType;
    }

    const cars = await Car.find(filter)
      .select("nameCar licensePlate seats vehicleType")
      .populate("userId", "username email")
      .sort({ createdAt: -1 })
      .lean();

    const total = await Car.countDocuments(filter);

    return res.status(200).json({
      errCode: 0,
      message: "Cars retrieved successfully",
      data: {
        cars,
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Get a car by ID
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid car ID",
      });
    }

    const car = await Car.findById(id)
      .populate("userId", "username email")
      .lean();

    if (!car) {
      return res.status(404).json({
        errCode: 1,
        message: "Car not found",
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: "Car retrieved successfully",
      data: { car },
    });
  } catch (error) {
    console.error("Error fetching car:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Update a car
const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nameCar, licensePlate, features, seats, vehicleType, image } =
      req.body;
    const user = req.user;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid car ID",
      });
    }

    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    if (!["USER", "ADMIN"].includes(user.role)) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to update this car",
      });
    }

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({
        errCode: 1,
        message: "Car not found",
      });
    }

    const isOwner = car.userId.toString() === user.id;
    if (!isOwner && user.role !== "ADMIN") {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to update this car",
      });
    }

    if (
      !nameCar &&
      !licensePlate &&
      !features &&
      !seats &&
      !vehicleType &&
      image === undefined
    ) {
      return res.status(400).json({
        errCode: 1,
        message: "No fields provided for update",
      });
    }

    if (seats && (!Number.isInteger(seats) || seats <= 0)) {
      return res.status(400).json({
        errCode: 1,
        message: "Seats must be a positive integer",
      });
    }

    if (vehicleType && !["SIT", "BED"].includes(vehicleType)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid vehicle type. Must be SIT or BED",
      });
    }

    if (licensePlate && licensePlate !== car.licensePlate) {
      const existingCar = await Car.findOne({ licensePlate }).lean();
      if (existingCar) {
        return res.status(400).json({
          errCode: 1,
          message: "License plate already exists",
        });
      }
    }

    const updateFields = {};
    if (nameCar) updateFields.nameCar = nameCar;
    if (licensePlate) updateFields.licensePlate = licensePlate;
    if (features)
      updateFields.features = Array.isArray(features) ? features : [];
    if (seats) updateFields.seats = seats;
    if (vehicleType) updateFields.vehicleType = vehicleType;
    if (image !== undefined) updateFields.image = image || null;

    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .populate("userId", "username email")
      .lean();

    if (!updatedCar) {
      return res.status(404).json({
        errCode: 1,
        message: "Car not found",
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: "Car updated successfully",
      data: { car: updatedCar },
    });
  } catch (error) {
    console.error("Error updating car:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        errCode: 1,
        message: "Duplicate key error: License plate already exists",
      });
    }
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Delete a car
const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid car ID",
      });
    }

    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    if (!["USER", "ADMIN"].includes(user.role)) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to delete this car",
      });
    }

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({
        errCode: 1,
        message: "Car not found",
      });
    }

    const isOwner = car.userId.toString() === user.id;
    if (!isOwner && user.role !== "ADMIN") {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to delete this car",
      });
    }

    const activeTrips = await Trip.find({
      carId: id,
      status: { $nin: ["Đã đến", "Đã hủy"] },
    }).lean();
    if (activeTrips.length > 0) {
      return res.status(400).json({
        errCode: 1,
        message: "Cannot delete car because it is assigned to active trips",
      });
    }

    await Car.findByIdAndDelete(id);

    return res.status(200).json({
      errCode: 0,
      message: "Car deleted successfully",
      data: {},
    });
  } catch (error) {
    console.error("Error deleting car:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
  getAllCarsNoPage,
};
