const jwt = require("jsonwebtoken");
// kiem tra dang nhap chua
let verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        // het han
        return res.status(403).json("Token not valid");
      }
      // truyen req.user  xuong du dung
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
};

const validRoles = ["ADMIN", "GARAGE", "USER"];

const verifyTokenAndRoleAndID = (allowedRoles) => (req, res, next) => {
  verifyToken(req, res, () => {
    const user = req.user;
    console.log("user", user);

    if (!user || !user.role) {
      return res
        .status(403)
        .json({ message: "Không có thông tin người dùng hoặc vai trò" });
    }

    // Nếu người dùng là chính họ (id trùng), cho phép luôn
    if (user.id === req.params.id) {
      return next();
    }

    // Nếu không phải chính họ, kiểm tra vai trò
    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền thực hiện chức năng này" });
    }

    next(); // Nếu có role hợp lệ
  });
};

const verifyTokenAndRoleAuth = (allowedRoles) => (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Không có thông tin người dùng hoặc vai trò" });
    }

    // Kiểm tra role hợp lệ
    if (!validRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Vai trò không hợp lệ" });
    }

    // Kiểm tra quyền
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền thực hiện chức năng này" });
    }
  });
};

const verifyToken_ADMIN_ID = () => (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user || !req.user.role || !req.user.id) {
      return res
        .status(403)
        .json({ message: "Không có thông tin người dùng hoặc vai trò" });
    }

    // Nếu là admin thì cho phép
    if (req.user.role === "ADMIN") {
      return next();
    }

    // Nếu là chính người dùng (giả sử bạn truyền ID người dùng qua params hoặc body)
    const userIdFromRequest = req.params.id || req.body.id;
    if (req.user.id === userIdFromRequest) {
      return next();
    }

    // Trường hợp còn lại: không có quyền
    return res
      .status(403)
      .json({ message: "Bạn không có quyền thực hiện chức năng này" });
  });
};

const verifyAdminOnly = () => (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user || !req.user.role) {
      console.log("req ", req);

      return res
        .status(403)
        .json({ message: "Không có thông tin người dùng hoặc vai trò" });
    }

    if (req.user.role === "ADMIN") {
      return next();
    }

    return res.status(403).json({
      message: "Chỉ quản trị viên mới có quyền thực hiện chức năng này",
    });
  });
};
module.exports = {
  verifyToken,
  verifyTokenAndRoleAuth,
  verifyTokenAndRoleAndID,
  verifyAdminOnly,
  verifyToken_ADMIN_ID,
};
