const {
  registerUser,
  loginUser,
  requestRefreshToken,
  userLogout,
} = require("../controllers/authController");
const { verifyToken } = require("../controllers/middlewareController");

const router = require("express").Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/refresh", requestRefreshToken);

router.post("/logout", verifyToken, userLogout);

module.exports = router;
