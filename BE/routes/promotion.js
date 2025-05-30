const express = require("express");
const router = express.Router();

const {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
  findUsablePromotions,
} = require("../controllers/promotionController");
const {
  verifyTokenAndRoleAuth,
  verifyToken,
  verifyAdminOnly,
} = require("../controllers/middlewareController");

router.post("/promotions", verifyAdminOnly(), createPromotion);
router.get("/promotions", verifyToken, getAllPromotions);
router.post("/findUsablePromotions", verifyToken, findUsablePromotions);
router.get("/promotions/:id", verifyToken, getPromotionById);
router.put("/promotions/:id", verifyAdminOnly(), updatePromotion);
router.delete("/promotions/:id", verifyAdminOnly(), deletePromotion);

module.exports = router;
