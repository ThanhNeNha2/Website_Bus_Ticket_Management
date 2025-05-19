const mongoose = require("mongoose");
const User = require("../models/User");

let getAllUser = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Chuyển đổi page và limit thành số nguyên
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Kiểm tra page và limit hợp lệ
    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({
        errCode: 1,
        message: "Page and limit must be positive integers",
      });
    }

    // Lấy danh sách người dùng với phân trang
    const users = await User.find({})
      .select("-password") // Loại bỏ trường password
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    // Đếm tổng số người dùng
    const total = await User.countDocuments({});

    res.status(200).json({
      errCode: 0,
      message: "Users retrieved successfully",
      data: {
        users,
        total,
        page: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

let getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        errCode: 1,
        message: "User không tồn tại",
      });
    }

    res.status(200).json({
      errCode: 0,
      user,
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      errCode: 1,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = req.user;
    const updateFields = req.body;
    console.log("check thong tin gui update", updateFields);
    console.log("user", user);

    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    const isOwner = userId === user.id;
    const isAdmin = user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to update this user",
      });
    }

    if (updateFields.email) {
      const emailExists = await User.findOne({
        email: updateFields.email,
        _id: { $ne: userId },
      });

      if (emailExists) {
        return res.status(400).json({
          errCode: 1,
          message: "Email already exists",
        });
      }
    }

    if (updateFields.phone) {
      const phoneExists = await User.findOne({
        phone: updateFields.phone,
        _id: { $ne: userId },
      });

      if (phoneExists) {
        return res.status(400).json({
          errCode: 1,
          message: "Phone number already exists",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        errCode: 1,
        message: "User not found",
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: "User updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

let deleteUser = async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        errCode: 1,
        message: "User not found",
      });
    }
    res.status(200).json({
      errCode: 0,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

module.exports = { getAllUser, deleteUser, updateUser, getUserById };
