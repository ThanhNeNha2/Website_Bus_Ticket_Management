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
const updateUser = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    const userId = req.params.id;

    // Kiểm tra dữ liệu đầu vào
    if (!username && !email && !phone && !password) {
      return res.status(400).json({
        errCode: 1,
        message: "No fields provided for update",
      });
    }

    // Tạo object chứa các trường cần cập nhật
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    if (password) {
      const salt = await bcrypt.genSalt(12);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Cập nhật user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password"); // Loại bỏ password khỏi phản hồi

    if (!user) {
      return res.status(404).json({
        errCode: 1,
        message: "User not found",
      });
    }

    // Trả về phản hồi
    return res.status(200).json({
      errCode: 0,
      user,
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
module.exports = { getAllUser, deleteUser, updateUser };
