const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");
const Promotion = require("../models/Promotion");

const Trip = require("../models/Trip");
const Car = require("../models/Car");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../service/nodeMailer");

// Create a new ticket
const createTicket = async (req, res) => {
  const session = await mongoose.startSession(); // Bắt đầu transaction
  session.startTransaction();

  try {
    const { tripId, ticketPrice, promotionCode, numberOfTickets } = req.body;
    const user = req.user; // Giả định req.user từ middleware xác thực

    // Kiểm tra dữ liệu đầu vào
    if (!tripId || !ticketPrice || !numberOfTickets || numberOfTickets < 1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        errCode: 1,
        message: "Thiếu trường bắt buộc hoặc số lượng vé không hợp lệ",
      });
    }

    // Kiểm tra thông tin user
    if (!user || !user.id || !user.role) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        errCode: 1,
        message: "Không có thông tin người dùng hoặc vai trò",
      });
    }

    // Kiểm tra tripId hợp lệ
    const trip = await Trip.findById(tripId).session(session);
    if (!trip) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        errCode: 1,
        message: "Không tìm thấy chuyến xe",
      });
    }

    // Kiểm tra carId từ trip
    const car = await Car.findById(trip.carId).session(session);
    if (!car) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        errCode: 1,
        message: "Không tìm thấy xe",
      });
    }

    // Kiểm tra và giảm số ghế còn lại
    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: tripId, seatsAvailable: { $gte: numberOfTickets } },
      { $inc: { seatsAvailable: -numberOfTickets } },
      { new: true, session }
    );
    if (!updatedTrip) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        errCode: 1,
        message: `Không đủ ${numberOfTickets} ghế trống cho chuyến xe này`,
      });
    }

    // Xử lý mã giảm giá (chỉ tăng usedCount nếu có)
    let appliedPromotion = null;
    if (promotionCode) {
      const promotion = await Promotion.findOne({
        code: promotionCode,
      }).session(session);
      if (promotion) {
        promotion.usedCount += 1;
        await promotion.save({ session });
        appliedPromotion = promotion;
      }
    }

    // Tạo nhiều vé theo numberOfTickets
    const tickets = [];
    for (let i = 0; i < numberOfTickets; i++) {
      const ticket = new Ticket({
        ticketCode: `TICKET-${uuidv4().slice(0, 8)}`,
        tripId,
        carId: trip.carId,
        userId: user.id,
        ticketPrice, // Sử dụng ticketPrice từ FE (đã tính giảm giá)
        promotionCode: appliedPromotion ? appliedPromotion.code : null,
        status: "Đã đặt",
      });
      await ticket.save({ session });
      tickets.push(ticket);
    }

    // Populate dữ liệu cho vé cuối cùng (hoặc tất cả vé nếu cần)
    const populatedTickets = await Ticket.find({
      _id: { $in: tickets.map((t) => t._id) },
    })
      .session(session)
      .populate({
        path: "tripId",
        select:
          "pickupPoint dropOffPoint departureTime arrivalDate pickupProvince dropOffProvince",
        populate: {
          path: "userId",
          select: "username email",
        },
      })
      .populate("carId", "nameCar licensePlate")
      .populate("userId", "username email");

    // Gửi email thông báo cho mỗi vé
    const tripName = `${populatedTickets[0].tripId.pickupProvince} đến ${populatedTickets[0].tripId.dropOffProvince}`;
    for (const populatedTicket of populatedTickets) {
      try {
        await sendEmail(
          populatedTicket.userId.username,
          populatedTicket.userId.username,
          tripName,
          populatedTicket.ticketCode,
          populatedTicket.ticketPrice,
          populatedTicket.tripId.arrivalDate,
          populatedTicket.tripId.departureTime,
          populatedTicket.userId.email
        );
      } catch (emailError) {
        console.error(
          `Lỗi gửi email cho vé ${populatedTicket.ticketCode}:`,
          emailError
        );
        // Không rollback transaction vì vé đã tạo thành công
      }
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Trả về phản hồi
    return res.status(201).json({
      errCode: 0,
      message: `Tạo ${numberOfTickets} vé thành công`,
      tickets: populatedTickets,
      appliedPromotion: appliedPromotion
        ? {
            code: appliedPromotion.code,
            discountType: appliedPromotion.discountType,
            discountValue: appliedPromotion.discountValue,
          }
        : null,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Lỗi khi tạo vé:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
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
    const userId = req.user.id; // Lấy user đang đăng nhập từ middleware
    const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
    const limit = parseInt(req.query.limit) || 10; // Mặc định 10 vé/trang
    const skip = (page - 1) * limit; // Tính số vé cần bỏ qua

    // Lấy vé với phân trang
    const myTickets = await Ticket.find({ userId })
      .populate({
        path: "tripId",
        select:
          "pickupProvince dropOffProvince departureDate departureTime arrivalTime pickupPoint dropOffPoint",
      })
      .populate({
        path: "carId",
        select: "nameCar licensePlate",
      })
      .sort({ createdAt: -1 }) // Mới nhất trước
      .skip(skip) // Bỏ qua các vé trước đó
      .limit(limit); // Giới hạn số vé trả về

    // Lấy tổng số vé để tính tổng số trang
    const totalTickets = await Ticket.countDocuments({ userId });
    const totalPages = totalTickets > 0 ? Math.ceil(totalTickets / limit) : 1;

    return res.status(200).json({
      errCode: 0,
      message: "Lấy vé thành công",
      tickets: myTickets,
      pagination: {
        currentPage: page,
        limit: limit,
        totalTickets: totalTickets,
        totalPages: totalPages,
      },
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
