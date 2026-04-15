const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { createOrder, getOrders } = require("../controllers/orderController");

router.post("/", protect, createOrder); // 🔐 protected
router.get("/", protect, getOrders);    // 🔐 protected

module.exports = router;