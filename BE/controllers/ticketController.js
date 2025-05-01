const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");
const Trip = require("../models/Trip");
const Car = require("../models/Car");
const { v4: uuidv4 } = require("uuid");

// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const { tripId, ticketPrice, promotionCode } = req.body;
    const user = req.user; // Giả định req.user từ middleware xác thực

    // Kiểm tra dữ liệu đầu vào
    if (!tripId || !ticketPrice) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing required fields",
      });
    }

    // Kiểm tra thông tin user
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    // Kiểm tra tripId hợp lệ
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        errCode: 1,
        message: "Trip not found",
      });
    }

    // Kiểm tra carId từ trip
    const car = await Car.findById(trip.carId);
    if (!car) {
      return res.status(404).json({
        errCode: 1,
        message: "Car not found",
      });
    }

    // Kiểm tra số ghế còn lại
    if (trip.seatsAvailable <= 0) {
      return res.status(400).json({
        errCode: 1,
        message: "No seats available for this trip",
      });
    }

    // Xử lý mã giảm giá
    let finalTicketPrice = ticketPrice;
    let appliedPromotion = null;
    if (promotionCode) {
      const promotion = await Promotion.findOne({ code: promotionCode });
      if (!promotion) {
        return res.status(400).json({
          errCode: 1,
          message: "Invalid promotion code",
        });
      }

      // Kiểm tra trạng thái và thời gian hiệu lực
      const now = new Date();
      if (
        promotion.status !== "Active" ||
        now < promotion.startDate ||
        now > promotion.endDate
      ) {
        return res.status(400).json({
          errCode: 1,
          message: "Promotion is not active or has expired",
        });
      }

      // Kiểm tra maxUses
      if (promotion.maxUses > 0 && promotion.usedCount >= promotion.maxUses) {
        return res.status(400).json({
          errCode: 1,
          message: "Promotion has reached maximum usage",
        });
      }

      // Kiểm tra applicableTrips
      if (
        promotion.applicableTrips.length > 0 &&
        !promotion.applicableTrips.includes(tripId)
      ) {
        return res.status(400).json({
          errCode: 1,
          message: "Promotion is not applicable to this trip",
        });
      }

      // Tính giá vé sau giảm giá
      if (promotion.discountType === "Percentage") {
        finalTicketPrice = ticketPrice * (1 - promotion.discountValue / 100);
      } else if (promotion.discountType === "Fixed") {
        finalTicketPrice = ticketPrice - promotion.discountValue;
        if (finalTicketPrice < 0) finalTicketPrice = 0; // Đảm bảo giá không âm
      }

      // Tăng usedCount
      promotion.usedCount += 1;
      await promotion.save();
      appliedPromotion = promotion;
    }

    // Tạo ticket mới
    const ticket = new Ticket({
      ticketCode: `TICKET-${uuidv4().slice(0, 8)}`,
      tripId,
      carId: trip.carId,
      userId: user.id,
      ticketPrice: finalTicketPrice,
      status: "Booked",
    });

    // Giảm seatsAvailable
    trip.seatsAvailable -= 1;
    await trip.save();

    // Lưu ticket
    await ticket.save();

    // Populate dữ liệu
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("tripId", "pickupPoint dropOffPoint departureTime arrivalTime")
      .populate("carId", "nameCar licensePlate")
      .populate("userId", "username email");

    return res.status(201).json({
      errCode: 0,
      message: "Ticket created successfully",
      ticket: populatedTicket,
      appliedPromotion: appliedPromotion
        ? {
            code: appliedPromotion.code,
            discountType: appliedPromotion.discountType,
            discountValue: appliedPromotion.discountValue,
          }
        : null,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Get all tickets (hỗ trợ tìm kiếm)
const getAllTickets = async (req, res) => {
  try {
    const { userId, tripId, status, page = 1, limit = 10 } = req.query;
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
        message: "You do not have permission to view tickets",
      });
    }

    // Xây dựng bộ lọc
    const filter = {};
    if (userId && mongoose.isValidObjectId(userId)) {
      filter.userId = userId;
    }
    if (tripId && mongoose.isValidObjectId(tripId)) {
      filter.tripId = tripId;
    }
    if (status) {
      filter.status = status;
    }

    // Nếu là GARAGE, chỉ lấy vé của các chuyến xe thuộc xe do nhà xe quản lý
    if (user.role === "GARAGE") {
      // Tìm các xe thuộc nhà xe
      const cars = await Car.find({ userId: user.id }).select("_id").lean();
      const carIds = cars.map((car) => car._id);

      // Tìm các chuyến xe sử dụng các xe này
      const trips = await Trip.find({ carId: { $in: carIds } })
        .select("_id")
        .lean();
      const tripIds = trips.map((trip) => trip._id);

      // Chỉ lấy vé thuộc các chuyến xe này
      filter.tripId = { $in: tripIds };
    }

    // Phân trang
    const tickets = await Ticket.find(filter)
      .populate(
        "tripId",
        "pickupPoint dropOffPoint departureTime arrivalTime pickupProvince dropOffProvince departureDate"
      )
      .populate("carId", "nameCar licensePlate")
      .populate("userId", "username email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

    const total = await Ticket.countDocuments(filter);

    return res.status(200).json({
      errCode: 0,
      message: "Tickets retrieved successfully",
      data: {
        tickets,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error retrieving tickets:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Get a single ticket by ID
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid ticket ID",
      });
    }

    const ticket = await Ticket.findById(id)
      .populate("tripId", "pickupPoint dropOffPoint departureTime arrivalTime")
      .populate("carId", "nameCar licensePlate")
      .populate("userId", "username email");

    if (!ticket) {
      return res.status(404).json({
        errCode: 1,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: "Ticket retrieved successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error retrieving ticket:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

//  vé mà chính mình đã đặt
const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id; // lấy user đang đăng nhập từ middleware

    const myTickets = await Ticket.find({ userId })
      .populate({
        path: "tripId",
        select: "pickupProvince dropOffProvince departureDate departureTime",
      })
      .populate({
        path: "carId",
        select: "nameCar licensePlate",
      })
      .sort({ createdAt: -1 }); // mới nhất trước

    return res.status(200).json({
      errCode: 0,
      message: "Lấy vé thành công",
      tickets: myTickets,
    });
  } catch (error) {
    console.error("Lỗi khi lấy vé:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

// Update a ticket
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { ticketPrice, status } = req.body;
    const user = req.user;

    // Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid ticket ID",
      });
    }

    // Kiểm tra dữ liệu đầu vào
    if (!ticketPrice && !status) {
      return res.status(400).json({
        errCode: 1,
        message: "No fields provided for update",
      });
    }

    // Kiểm tra thông tin user
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    // Tìm ticket
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        errCode: 1,
        message: "Ticket not found",
      });
    }

    // Kiểm tra quyền: Chỉ chủ vé (userId) hoặc GARAGE/ADMIN được cập nhật
    const isOwner = ticket.userId.toString() === user.id;
    const hasPermission = ["GARAGE", "ADMIN"].includes(user.role);
    if (!isOwner && !hasPermission) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to update this ticket",
      });
    }

    // Tạo object chứa các trường cần cập nhật
    const updateFields = {};
    if (ticketPrice) updateFields.ticketPrice = ticketPrice;
    if (status) updateFields.status = status;

    // Cập nhật ticket
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .populate("tripId", "pickupPoint dropOffPoint departureTime arrivalTime")
      .populate("carId", "nameCar licensePlate")
      .populate("userId", "username email");

    if (!updatedTicket) {
      return res.status(404).json({
        errCode: 1,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

// Delete a ticket
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid ticket ID",
      });
    }

    // Kiểm tra thông tin user
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    // Tìm ticket
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        errCode: 1,
        message: "Ticket not found",
      });
    }

    // Kiểm tra quyền: Chỉ chủ vé hoặc GARAGE/ADMIN được xóa
    const isOwner = ticket.userId.toString() === user.id;
    const hasPermission = ["GARAGE", "ADMIN"].includes(user.role);
    if (!isOwner && !hasPermission) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to delete this ticket",
      });
    }

    // Chỉ cho phép xóa nếu trạng thái là Booked hoặc Canceled
    if (!["Booked", "Canceled"].includes(ticket.status)) {
      return res.status(400).json({
        errCode: 1,
        message: "Cannot delete ticket in Confirmed or Used status",
      });
    }

    // Tăng seatsAvailable trong Trip
    const trip = await Trip.findById(ticket.tripId);
    if (trip) {
      trip.seatsAvailable += 1;
      await trip.save();
    }

    // Xóa ticket
    await ticket.deleteOne();

    return res.status(200).json({
      errCode: 0,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getMyTickets,
};
