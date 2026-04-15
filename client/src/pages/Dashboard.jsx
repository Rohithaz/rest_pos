import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // FETCH ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        // 🔐 Redirect if no token
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/orders", {
          headers: {
            Authorization: token, // ✅ FIX
          },
        });

        // 🔐 Handle unauthorized
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await res.json();

        // ✅ Prevent crash
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }

      } catch (err) {
        console.error(err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  // 🔥 CALCULATIONS

  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);

  const totalOrders = orders.length;

  const avgOrderValue =
    totalOrders > 0 ? totalSales / totalOrders : 0;

  // 💳 PAYMENT BREAKDOWN
  const paymentStats = orders.reduce((acc, order) => {
    acc[order.paymentMethod] =
      (acc[order.paymentMethod] || 0) + order.total;
    return acc;
  }, {});

  // 🍔 TOP ITEMS
  const itemStats = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!itemStats[item.name]) {
        itemStats[item.name] = 0;
      }
      itemStats[item.name] += item.qty;
    });
  });

  const topItems = Object.entries(itemStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📊 Dashboard</h1>
        <p className="text-gray-500">
          {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Total Sales</p>
          <h2 className="text-xl font-bold mt-2">
            ₹{totalSales.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Total Orders</p>
          <h2 className="text-xl font-bold mt-2">
            {totalOrders}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">Avg Order Value</p>
          <h2 className="text-xl font-bold mt-2">
            ₹{avgOrderValue.toFixed(2)}
          </h2>
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="grid grid-cols-2 gap-6">

        {/* 💳 PAYMENT BREAKDOWN */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-bold mb-4">💳 Payment Breakdown</h2>

          {Object.keys(paymentStats).length === 0 && (
            <p className="text-gray-400 text-sm">
              No data available
            </p>
          )}

          {Object.entries(paymentStats).map(([method, amount]) => (
            <div
              key={method}
              className="flex justify-between mb-2 text-sm"
            >
              <span>{method}</span>
              <span>₹{amount.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* 🍔 TOP ITEMS */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-bold mb-4">🍔 Top Selling Items</h2>

          {topItems.length === 0 && (
            <p className="text-gray-400 text-sm">
              No items yet
            </p>
          )}

          {topItems.map(([name, qty]) => (
            <div
              key={name}
              className="flex justify-between mb-2 text-sm"
            >
              <span>{name}</span>
              <span>{qty} sold</span>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white p-5 rounded-2xl shadow mt-6">
        <h2 className="font-bold mb-4">🧾 Recent Orders</h2>

        {orders.slice(0, 5).map((order) => (
          <div
            key={order._id}
            className="flex justify-between border-b py-2 text-sm"
          >
            <div>
              <p className="font-medium">
                ₹{order.total.toFixed(2)}
              </p>
              <p className="text-gray-500">
                {order.paymentMethod} •{" "}
                {order.orderType || "Dine-in"}
              </p>
            </div>

            <p className="text-gray-400 text-xs">
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}