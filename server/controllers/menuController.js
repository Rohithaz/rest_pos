const Menu = require("../models/Menu");

// ✅ GET ALL MENU ITEMS (only available for billing)
const getMenu = async (req, res) => {
  try {
    const items = await Menu.find({ available: true });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL ITEMS (for admin panel)
const getAllMenu = async (req, res) => {
  try {
    const items = await Menu.find(); // includes disabled also
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ADD ITEM
const addMenuItem = async (req, res) => {
  try {
    const item = await Menu.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE ITEM (price / availability / name etc)
const updateMenuItem = async (req, res) => {
  try {
    const updated = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE ITEM
const deleteMenuItem = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMenu,
  getAllMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};