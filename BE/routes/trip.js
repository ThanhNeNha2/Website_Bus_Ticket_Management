const express = require("express");
const {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getAllTripNoPage,
} = require("../controllers/tripController");
const {
  verifyTokenAndRoleAndID,
  verifyToken,
  verifyTokenAndRoleAuth,
} = require("../controllers/middlewareController");
const router = express.Router();

// Chỉ có nhà xe mới được tạo xe
router.post("/trips", verifyTokenAndRoleAuth(["GARAGE"]), createTrip);

// Route: Lấy thông tin một xe
router.get("/trips/:id", verifyToken, getTripById);

// Route: Lấy danh sách tất cả xe ( USER và ADMIN thì được lấy tất cả ) ( Nhà xe thì chỉ đươc lấy của nhà xe )
router.get("/trips", verifyToken, getAllTrips);
router.get(
  "/tripsNoPage",
  // verifyTokenAndRoleAuth(["GARAGE"]),
  getAllTripNoPage
);

// Route: Cập nhật xe
router.put("/trips/:id", verifyTokenAndRoleAuth(["GARAGE"]), updateTrip);

// Route: Xóa xe ( chỉ có ADMIN VÀ GARAGE mới xóa được xe - đã check id )
router.delete(
  "/trips/:id",
  verifyTokenAndRoleAuth(["ADMIN", "GARAGE"]),
  deleteTrip
);

module.exports = router;
