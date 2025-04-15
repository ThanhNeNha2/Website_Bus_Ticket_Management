const jwt = require("jsonwebtoken");
// kiem tra dang nhap chua
let verifyToken = (req, res, next) => {
  const token = req.headers.token;
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

let verifyTokenAndAdminAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id == req.params.id || req.user.admin) {
      next();
    } else {
      return res.status(403).json("Khong co quyen xoa nguoi khac ");
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAdminAuth };
