const express = require("express");
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getMyTickets,
} = require("../controllers/ticketController");
const {
  verifyTokenAndRoleAndID,
  verifyToken,
  verifyTokenAndRoleAuth,
  verifyToken_ADMIN_ID,
  verifyAdminOnly,
} = require("../controllers/middlewareController");
const router = express.Router();

// Chỉ có nhà xe mới được tạo xe
router.post("/tickets", verifyToken, createTicket);

// Route: Lấy thông tin một xe
router.get("/tickets/:id", verifyToken, getTicketById);

// Route: Lấy danh sách tất cả xe ( USER và ADMIN thì được lấy tất cả ) ( Nhà xe thì chỉ đươc lấy của nhà xe )
router.get("/tickets", verifyToken, getAllTickets);
router.get("/myTickets", verifyToken, getMyTickets);

// Route: Cập nhật xe
router.put("/tickets/:id", verifyAdminOnly(), updateTicket);

// Route: Xóa xe ( chỉ có ADMIN VÀ GARAGE mới xóa được xe - đã check id )
router.delete("/tickets/:id", verifyToken, deleteTicket);

module.exports = router;
