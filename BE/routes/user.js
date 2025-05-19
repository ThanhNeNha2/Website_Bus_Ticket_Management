const {
  verifyToken,
  verifyTokenAndRoleAndID,
  verifyTokenAndRoleAuth,
  verifyAdminOnly,
  verifyToken_ADMIN_ID,
} = require("../controllers/middlewareController");
const {
  getAllUser,
  deleteUser,
  updateUser,
  getUserById,
} = require("../controllers/userController");

const router = require("express").Router();
router.get("/", verifyAdminOnly(), getAllUser);
router.get("/:id", verifyToken_ADMIN_ID(), getUserById);

router.delete("/:id", verifyAdminOnly(), deleteUser);
router.put("/:id", verifyAdminOnly(), updateUser);

module.exports = router;
