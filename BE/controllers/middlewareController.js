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

const validRoles = ["ADMIN", "GARAGE"];

const verifyTokenAndRoleAndID = (allowedRoles) => (req, res, next) => {
  verifyToken(req, res, () => {
    const user = req.user;

    if (!user || !user.role) {
      return res
        .status(403)
        .json({ message: "Không có thông tin người dùng hoặc vai trò" });
    }

    // Nếu người dùng là chính họ (id trùng), cho phép luôn
    if (user.id === req.params.id) {
      console.log("da vao day ");
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

module.exports = {
  verifyToken,
  verifyTokenAndRoleAuth,
  verifyTokenAndRoleAndID,
};
