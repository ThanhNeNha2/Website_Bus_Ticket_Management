const Car = require("../models/Car");

const createCar = async (req, res) => {
  try {
    const { nameCar, licensePlate, features, seats, vehicleTypeId, image } =
      req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!nameCar || !licensePlate || !seats) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing required fields",
      });
    }

    // Kiểm tra biển số xe đã tồn tại
    const existingCar = await Car.findOne({ licensePlate });
    if (existingCar) {
      return res.status(400).json({
        errCode: 1,
        message: "License plate already exists",
      });
    }

    // Tạo xe với userId từ req.user (đã xác thực)
    const car = await Car.create({
      nameCar,
      licensePlate,
      features: features || [],
      seats,
      vehicleTypeId,
      image,
      userId: req.user.id, // Gán userId từ token
    });

    return res.status(201).json({
      errCode: 0,
      car,
    });
  } catch (error) {
    console.error("Error creating car:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

const getCarById = async (req, res) => {
  try {
    const carId = req.params.id;

    // Tìm xe theo ID và populate userId (nếu cần)
    const car = await Car.findById(carId).populate("userId", "username email");

    if (!car) {
      return res.status(404).json({
        errCode: 1,
        message: "Car not found",
      });
    }

    return res.status(200).json({
      errCode: 0,
      car,
    });
  } catch (error) {
    console.error("Error fetching car:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

const getAllCars = async (req, res) => {
  try {
    const user = req.user; // Lấy thông tin user từ middleware verifyTokenAndRoleAndID

    // Kiểm tra user và role
    if (!user || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "Không có thông tin người dùng hoặc vai trò",
      });
    }

    let cars;

    // Nếu role là GARAGE, chỉ lấy xe của user đăng nhập
    if (user.role === "GARAGE") {
      cars = await Car.find({ userId: user.id }).populate(
        "userId",
        "username email"
      );
    } else {
      // Nếu role là ADMIN hoặc USER, lấy tất cả xe
      cars = await Car.find().populate("userId", "username email");
    }

    return res.status(200).json({
      errCode: 0,
      cars,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

const updateCar = async (req, res) => {
  try {
    const carId = req.params.id;
    const { nameCar, licensePlate, features, seats, vehicleTypeId, image } =
      req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!nameCar && !licensePlate && !features && !seats && !vehicleTypeId) {
      return res.status(400).json({
        errCode: 1,
        message: "No fields provided for update",
      });
    }

    // Kiểm tra biển số xe nếu được cập nhật
    if (licensePlate) {
      const existingCar = await Car.findOne({
        licensePlate,
        _id: { $ne: carId },
      });
      if (existingCar) {
        return res.status(400).json({
          errCode: 1,
          message: "License plate already exists",
        });
      }
    }

    // Tạo object chứa các trường cần cập nhật
    const updateFields = {};
    if (nameCar) updateFields.nameCar = nameCar;
    if (licensePlate) updateFields.licensePlate = licensePlate;
    if (features) updateFields.features = features;
    if (seats) updateFields.seats = seats;
    if (vehicleTypeId) updateFields.vehicleTypeId = vehicleTypeId;
    if (image) updateFields.image = image;

    // Check xem người dùng có quyền xóa không

    const user = req.user; // Lấy thông tin user từ middleware

    // Kiểm tra thông tin user
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "Không có thông tin người dùng hoặc vai trò",
      });
    }

    // Tìm xe theo ID
    const carSearch = await Car.findById(carId);

    if (!carSearch) {
      return res.status(404).json({
        errCode: 1,
        message: "Car not found",
      });
    }

    // Kiểm tra quyền xóa
    const isOwner = carSearch.userId.toString() === user.id; // So sánh userId của xe với req.user.id
    const hasPermission = user.role === "GARAGE";

    if (!isOwner && !hasPermission) {
      return res.status(403).json({
        errCode: 1,
        message: "Bạn không có quyền xóa xe này",
      });
    }

    // Cập nhật xe
    const car = await Car.findByIdAndUpdate(
      carId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("userId", "username email");

    if (!car) {
      return res.status(404).json({
        errCode: 1,
        message: "Car not found",
      });
    }

    return res.status(200).json({
      errCode: 0,
      car,
    });
  } catch (error) {
    console.error("Error updating car:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

const deleteCar = async (req, res) => {
  try {
    const carId = req.params.id;
    const user = req.user; // Lấy thông tin user từ middleware

    // Kiểm tra thông tin user
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "Không có thông tin người dùng hoặc vai trò",
      });
    }

    // Tìm xe theo ID
    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({
        errCode: 1,
        message: "Car not found",
      });
    }

    // Kiểm tra quyền xóa
    const isOwner = car.userId.toString() === user.id; // So sánh userId của xe với req.user.id
    const hasPermission =
      user.role !== "USER" && ["ADMIN", "GARAGE"].includes(user.role);

    if (!isOwner && !hasPermission) {
      return res.status(403).json({
        errCode: 1,
        message: "Bạn không có quyền xóa xe này",
      });
    }

    // Xóa xe
    await Car.findByIdAndDelete(carId);

    return res.status(200).json({
      errCode: 0,
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting car:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

module.exports = { getAllCars, createCar, getCarById, updateCar, deleteCar };
