const express = require("express");
const router = express.Router();

const {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
} = require("../controllers/promotionController");
const {
  verifyTokenAndRoleAuth,
  verifyToken,
} = require("../controllers/middlewareController");

router.post("/promotions", verifyTokenAndRoleAuth(["GARAGE"]), createPromotion);
router.get("/promotions", verifyToken, getAllPromotions);
router.get("/promotions/:id", verifyToken, getPromotionById);
router.put(
  "/promotions/:id",
  verifyTokenAndRoleAuth(["GARAGE"]),
  updatePromotion
);
router.delete(
  "/promotions/:id",
  verifyTokenAndRoleAuth(["GARAGE"]),
  deletePromotion
);

module.exports = router;
