const Order = require("../models/Order");

// ✅ CREATE ORDER
const createOrder = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const orderData = {
      items: req.body.items,
      subtotal: req.body.subtotal,
      gst: req.body.gst,
      total: req.body.total,
      paymentMethod: req.body.paymentMethod,
      orderType: req.body.orderType || "Dine-in", // 🔥 FORCE INCLUDE
    };

    console.log("FINAL DATA SAVED:", orderData);

    const order = await Order.create(orderData);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ORDERS (THIS MUST EXIST)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ EXPORT BOTH (VERY IMPORTANT)
module.exports = { createOrder, getOrders };