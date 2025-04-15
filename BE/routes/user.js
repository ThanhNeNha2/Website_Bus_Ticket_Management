const {
  verifyToken,
  verifyTokenAndRoleAndID,
  verifyTokenAndRoleAuth,
} = require("../controllers/middlewareController");
const {
  getAllUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

const router = require("express").Router();

router.get("/", verifyToken, getAllUser);
router.delete("/:id", verifyTokenAndRoleAuth(["ADMIN", "GARAGE"]), deleteUser);
router.put("/:id", verifyTokenAndRoleAndID(["ADMIN", "GARAGE"]), updateUser);

module.exports = router;
