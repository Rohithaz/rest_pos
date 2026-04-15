const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const Order = require("./models/Order");

// Load env variables
dotenv.config();

// Create app FIRST ✅
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes ✅ (AFTER app creation)
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

app.get("/test-login", async (req, res) => {
  const User = require("./models/User");
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");

  const user = await User.findOne({ email: "admin@test.com" });

  if (!user) {
    return res.send("User not found");
  }

  const token = jwt.sign({ id: user._id }, "SECRET_KEY");

  res.send(`Login success ✅ Token: ${token}`);
});



app.get("/create-user", async (req, res) => {
  const User = require("./models/User");
  const bcrypt = require("bcryptjs");

  const existing = await User.findOne({ email: "admin@test.com" });

  if (existing) {
    return res.send("User already exists ✅");
  }

  const hashed = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Admin",
    email: "admin@test.com",
    password: hashed,
  });

  res.send("User created successfully ✅");
});







// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Reset orders (dev only)
app.get("/reset-orders", async (req, res) => {
  await Order.deleteMany({});
  res.send("All orders deleted");
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



const Menu = require("./models/Menu");

app.get("/seed-menu", async (req, res) => {
  try {
    await Menu.deleteMany({}); // optional reset

    await Menu.insertMany([
      { name: "Burger", price: 120, category: "Fast Food" },
      { name: "Pizza", price: 250, category: "Fast Food" },
      { name: "Pasta", price: 180, category: "Fast Food" },
      { name: "Coke", price: 40, category: "Drinks" },
    ]);

    res.send("Menu seeded ✅");
  } catch (error) {
    res.status(500).send(error.message);
  }
});