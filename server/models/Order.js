const mongoose = require("mongoose");

// 🔥 FORCE CLEAR OLD MODEL
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      qty: Number,
    },
  ],
  subtotal: Number,
  gst: Number,
  total: Number,
  paymentMethod: String,

  orderType: {
    type: String,
    default: "Dine-in",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);