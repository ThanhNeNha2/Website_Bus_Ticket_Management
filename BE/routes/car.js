const express = require("express");
const {
  createCar,
  getCarById,
  getAllCars,
  updateCar,
  deleteCar,
  getAllCarsNoPage,
} = require("../controllers/carController");
const {
  verifyTokenAndRoleAndID,
  verifyToken,
  verifyTokenAndRoleAuth,
  verifyAdminOnly,
} = require("../controllers/middlewareController");
const router = express.Router();

// Chỉ có nhà xe mới được tạo xe
router.post("/cars", verifyAdminOnly(), createCar);

// Route: Lấy thông tin một xe
router.get("/cars/:id", verifyToken, getCarById);

// Route: Lấy danh sách tất cả xe ( USER và ADMIN thì được lấy tất cả ) ( Nhà xe thì chỉ đươc lấy của nhà xe )
router.get("/cars", verifyToken, getAllCars);

// Route: Lấy tất cả không phân trang
router.get("/carsnopage", verifyAdminOnly(), getAllCarsNoPage);

// Route: Cập nhật xe
router.put("/cars/:id", verifyAdminOnly(), updateCar);

// Route: Xóa xe ( chỉ có ADMIN VÀ GARAGE mới xóa được xe - đã check id )
router.delete("/cars/:id", verifyAdminOnly(), deleteCar);

module.exports = router;
