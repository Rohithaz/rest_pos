const express = require("express");
const router = express.Router();

const {
  getMenu,
  getAllMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

// Billing (only available items)
router.get("/", getMenu);

// Admin (all items)
router.get("/all", getAllMenu);

// Add item
router.post("/", addMenuItem);

// Update item
router.put("/:id", updateMenuItem);

// Delete item
router.delete("/:id", deleteMenuItem);

module.exports = router;