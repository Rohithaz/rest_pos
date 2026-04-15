const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  available: {
    type: Boolean,
    default: true,
  },
});

module.exports =
  mongoose.models.Menu || mongoose.model("Menu", menuSchema);