import { useState, useEffect } from "react";

export default function Billing() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showInvoice, setShowInvoice] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [orders, setOrders] = useState([]);
  const [orderType, setOrderType] = useState("Dine-in");
  const [discount, setDiscount] = useState(0);
const [discountType, setDiscountType] = useState("flat");
const [menu, setMenu] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/orders", {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
});
    const data = await res.json();
    setOrders(data);
  };

 useEffect(() => {
  fetchOrders();

  const fetchMenu = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/menu");
    const data = await res.json();
    setMenu(data);
  };

  fetchMenu();
}, []);

  // const dummyMenu = [
  //   { id: 1, name: "Burger", price: 120, category: "Fast Food" },
  //   { id: 2, name: "Pizza", price: 250, category: "Fast Food" },
  //   { id: 3, name: "Pasta", price: 180, category: "Fast Food" },
  //   { id: 4, name: "Coke", price: 40, category: "Drinks" },
  // ];

  const addToCart = (item) => {
    const existing = cart.find((i) => i._id === item._id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (id, type) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: type === "inc" ? item.qty + 1 : item.qty - 1,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const filteredMenu = menu.filter((item) => {
    return (
      (selectedCategory === "All" ||
        item.category === selectedCategory) &&
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  return (
    <>
      {/* HEADER */}
      <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
        {/* <h1 className="text-xl font-bold">🍽 POS System</h1> */}
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 h-[calc(100vh-60px)] bg-gray-100">

        {/* SIDEBAR */}
        <div className="col-span-2 bg-white p-4 border-r">
          <h2 className="font-bold text-lg mb-4">Categories</h2>
          {["All", "Fast Food", "Drinks"].map((cat) => (
            <div
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-2 rounded-lg mb-2 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* MENU */}
        <div className="col-span-6 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Menu</h2>

          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-6 p-3 rounded-xl border shadow-sm"
          />

          <div className="grid grid-cols-3 gap-5">
            {filteredMenu.map((item) => (
              <div
                key={item._id}
                onClick={() => addToCart(item)}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition cursor-pointer border"
              >
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-500 mt-2">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CART */}
        <div className="col-span-2 bg-white p-5 border-l flex flex-col">
          <h2 className="text-xl font-bold mb-4">Cart</h2>

          <div className="flex-1 overflow-y-auto space-y-3">
            {cart.length === 0 && (
              <p className="text-gray-400 text-sm">No items</p>
            )}

            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 p-3 rounded-xl flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    ₹{item.price} × {item.qty}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, "dec")} className="px-2 bg-gray-200 rounded">-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, "inc")} className="px-2 bg-gray-200 rounded">+</button>
                </div>
              </div>
            ))}
          </div>

          {/* BILL */}
          <div className="border-t pt-4 mt-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>GST</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => setShowInvoice(true)}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl"
            >
              Checkout
            </button>
          </div>
        </div>

        {/* ORDERS */}
        <div className="col-span-2 bg-gray-50 p-4 overflow-y-auto border-l">
          <h2 className="font-bold text-lg mb-4">Orders</h2>

          {orders.map((order) => (
            <div key={order._id} className="bg-white p-3 rounded-xl mb-3 shadow-sm">
              <div className="flex justify-between">
                <span className="font-semibold">₹{order.total.toFixed(2)}</span>
                <span className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </div>

<div className="text-xs text-gray-500">
  <p>{order.paymentMethod}</p>
  <p className="text-indigo-600 font-medium">
    {order.orderType || "Dine-in"}
  </p>
</div>

              {order.items.map((i, idx) => (
                <p key={idx} className="text-sm text-gray-600">
                  {i.name} × {i.qty}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* INVOICE MODAL */}
      {showInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          
          {/* PRINT AREA */}
          <div className="print-area bg-white p-6 rounded-xl w-80 text-sm">

            <h2 className="text-center font-bold mb-2">🍽 POS SYSTEM</h2>
            <hr />

            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x{item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}

            <hr className="my-2" />

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>GST</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <hr className="my-2" />

            <p>Payment: {paymentMethod}</p>
            <p>{new Date().toLocaleString()}</p>


            {/* ORDER TYPE */}
<div className="mt-3">
  <p className="text-sm font-medium mb-1">Order Type</p>

  <div className="flex gap-2">
    {["Dine-in", "Takeaway", "Delivery"].map((type) => (
      <button
        key={type}
        onClick={() => setOrderType(type)}
        className={`flex-1 py-2 rounded ${
          orderType === type
            ? "bg-indigo-600 text-white"
            : "bg-gray-200"
        }`}
      >
        {type}
      </button>
    ))}
  </div>
</div>

            <p className="text-center mt-2">Thank You!</p>

            {/* BUTTONS */}
            <button
              onClick={() => window.print()}
              className="w-full mt-3 bg-green-600 text-white py-2 rounded"
            >
              Print Receipt
            </button>

            <button
              onClick={async () => {
                const newOrder = {
                  items: cart,
                  subtotal,
                  gst,
                  total,
                  paymentMethod,
                  orderType,
                };

                 console.log("ORDER SENT:", newOrder);

               await fetch("http://127.0.0.1:5000/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
  body: JSON.stringify(newOrder),
});

                await fetchOrders();
                setShowInvoice(false);
                setCart([]);
              }}
              className="w-full mt-2 bg-blue-600 text-white py-2 rounded"
            >
              Complete Order
            </button>

            <button
              onClick={() => setShowInvoice(false)}
              className="w-full mt-2 bg-gray-300 py-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
}