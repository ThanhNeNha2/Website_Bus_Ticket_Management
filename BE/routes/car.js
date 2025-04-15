const express = require("express");
const {
  createCar,
  getCarById,
  getAllCars,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const {
  verifyTokenAndRoleAndID,
  verifyToken,
  verifyTokenAndRoleAuth,
} = require("../controllers/middlewareController");
const router = express.Router();

// Chỉ có nhà xe mới được tạo xe
router.post("/cars", verifyTokenAndRoleAuth(["GARAGE"]), createCar);

// Route: Lấy thông tin một xe
router.get("/cars/:id", verifyToken, getCarById);

// Route: Lấy danh sách tất cả xe ( USER và ADMIN thì được lấy tất cả ) ( Nhà xe thì chỉ đươc lấy của nhà xe )
router.get("/cars", verifyToken, getAllCars);

// Route: Cập nhật xe
router.put(
  "/cars/:id",
  verifyTokenAndRoleAndID(["ADMIN", "GARAGE"]),
  updateCar
);

// Route: Xóa xe ( chỉ có ADMIN VÀ GARAGE mới xóa được xe - đã check id )
router.delete(
  "/cars/:id",
  verifyTokenAndRoleAuth(["ADMIN", "GARAGE"]),
  deleteCar
);

module.exports = router;
