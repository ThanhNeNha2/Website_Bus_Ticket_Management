const express = require("express");
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");
const {
  verifyTokenAndRoleAndID,
  verifyToken,
  verifyTokenAndRoleAuth,
} = require("../controllers/middlewareController");
const router = express.Router();

// Chỉ có nhà xe mới được tạo xe
router.post(
  "/tickets",
  verifyTokenAndRoleAuth(["GARAGE", "USER"]),
  createTicket
);

// Route: Lấy thông tin một xe
router.get("/tickets/:id", verifyToken, getTicketById);

// Route: Lấy danh sách tất cả xe ( USER và ADMIN thì được lấy tất cả ) ( Nhà xe thì chỉ đươc lấy của nhà xe )
router.get("/tickets", verifyToken, getAllTickets);

// Route: Cập nhật xe
router.put("/tickets/:id", verifyTokenAndRoleAuth(["GARAGE"]), updateTicket);

// Route: Xóa xe ( chỉ có ADMIN VÀ GARAGE mới xóa được xe - đã check id )
router.delete(
  "/tickets/:id",
  verifyTokenAndRoleAuth(["ADMIN", "GARAGE"]),
  deleteTicket
);

module.exports = router;
