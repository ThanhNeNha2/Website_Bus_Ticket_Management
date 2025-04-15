const {
  verifyToken,
  verifyTokenAndAdminAuth,
} = require("../controllers/middlewareController");
const { getAllUser, deleteUser } = require("../controllers/userController");

const router = require("express").Router();

router.get("/", verifyToken, getAllUser);
router.delete("/:id", verifyTokenAndAdminAuth, deleteUser);

module.exports = router;
