const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ms = require("ms");
var refreshTokens = [];

const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password || !phone) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing required fields",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid email format",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        errCode: 1,
        message: "Password must be at least 6 characters",
      });
    }

    // Kiểm tra trùng lặp
    const existingUser = await User.findOne({
      $or: [{ username }, { phone }, { email }],
    });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({
          errCode: 1,
          message: "Username already exists",
        });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({
          errCode: 1,
          message: "Phone already exists",
        });
      }
      if (existingUser.email === email) {
        return res.status(400).json({
          errCode: 1,
          message: "Email already exists",
        });
      }
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);

    // Tạo user
    const user = await User.create({
      username,
      email,
      password: hashed,
      phone,
    });

    // Trả về phản hồi
    return res.status(200).json({
      errCode: 0,
      user: {
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

let generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      admin: user.admin,
    },
    process.env.JWT_ACCESS_KEY,
    {
      // het han trong bao laau
      expiresIn: "60d",
    }
  );
};

let generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      admin: user.admin,
    },
    process.env.JWT_REFRESH_KEY,
    {
      // het han trong bao laau
      expiresIn: "365d",
    }
  );
};

let loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json("Wrong username");
    }
    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatePassword) {
      return res.status(404).json("Wrong password");
    }
    if (user && validatePassword) {
      let accessToken = generateAccessToken(user);
      let refreshToken = generateRefreshToken(user);
      refreshTokens.push(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      // loai bo password
      const { password, ...other } = user._doc;
      return res.status(200).json({ ...other, accessToken });
    }
  } catch (error) {
    console.log("ErrCode", error);
    return res.status(500).json(error);
  }
};

//REFRESH TOKEN
let requestRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json("Ban chua dang nhap ");
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Ma nay khong phai cua tui ");
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      console.log(err);
    }
    // loai bo cai refresh cu de nhan cai moi
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    // nhan cai moi
    refreshTokens.push(newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    return res.status(200).json({ accessToken: newAccessToken });
  });
};

// LOGOUT
let userLogout = async (req, res) => {
  res.clearCookie("refreshToken");
  refreshTokens = refreshTokens.filter(
    (token) => token !== req.cookies.refreshToken
  );
  return res.status(200).json("Logout success! ");
};
module.exports = { registerUser, loginUser, requestRefreshToken, userLogout };
