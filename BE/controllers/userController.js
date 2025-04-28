const User = require("../models/User");

let getAllUser = async (req, res) => {
  try {
    let user = await User.find({});
    res.status(200).json({
      ErrCode: 0,
      user,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json(error);
  }
};
let getUserById = async (req, res) => {
  try {
    // Lấy id từ req.params
    const { id } = req.params;

    // Tìm kiếm user theo id, sử dụng findById hoặc findOne
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        ErrCode: 1,
        message: "User không tồn tại",
      });
    }

    res.status(200).json({
      ErrCode: 0,
      user,
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({
      ErrCode: 1,
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = req.user; // Giả định req.user từ middleware xác thực
    const updateFields = req.body;
    console.log(" check thong tin gui update ", updateFields);

    // Kiểm tra thông tin user
    if (!user || !user.id || !user.role) {
      return res.status(403).json({
        errCode: 1,
        message: "No user information or role provided",
      });
    }

    // Kiểm tra quyền: Chỉ chủ tài khoản hoặc ADMIN được cập nhật
    const isOwner = userId === user.id;
    const isAdmin = user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        errCode: 1,
        message: "You do not have permission to update this user",
      });
    }

    // 👉 Kiểm tra trùng email (nếu có gửi lên)
    if (updateFields.email) {
      const emailExists = await User.findOne({
        email: updateFields.email,
        _id: { $ne: userId }, // Trừ chính user đang cập nhật
      });

      if (emailExists) {
        return res.status(400).json({
          errCode: 1,
          message: "Email already exists",
        });
      }
    }

    // 👉 Kiểm tra trùng phone (nếu có gửi lên)
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

    // Tiến hành cập nhật
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
    let user = await User.deleteOne({ _id: req.params.id });
    res.status(201).json({
      ErrCode: 0,
      user,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json(error);
  }
};
module.exports = { getAllUser, deleteUser, updateUser, getUserById };
