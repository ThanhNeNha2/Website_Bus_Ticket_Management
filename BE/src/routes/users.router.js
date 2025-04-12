const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controller/users.controller");

const router = require("express").Router();

router.get("/user", getUser);

router.post("/user", createUser);
router.put("/user/id", updateUser);
router.delete("/user/id", deleteUser);

module.exports = router;
