import { useEffect, useState } from "react";

export default function Admin() {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  // FETCH MENU
  const fetchMenu = async () => {
    const res = await fetch("http://localhost:5000/api/menu");
    const data = await res.json();
    setMenu(data);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // ADD ITEM
  const addItem = async () => {
    await fetch("http://localhost:5000/api/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price, category }),
    });

    setName("");
    setPrice("");
    setCategory("");
    fetchMenu();
  };

  // DELETE
  const deleteItem = async (id) => {
    await fetch(`http://localhost:5000/api/menu/${id}`, {
      method: "DELETE",
    });
    fetchMenu();
  };

  // TOGGLE AVAILABILITY
  const toggleAvailability = async (item) => {
    await fetch(`http://localhost:5000/api/menu/${item._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        available: !item.available,
      }),
    });
    fetchMenu();
  };

  // UPDATE PRICE
  const updatePrice = async (id, newPrice) => {
    await fetch(`http://localhost:5000/api/menu/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price: newPrice }),
    });
    fetchMenu();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

      {/* ADD ITEM */}
      <div className="flex gap-3 mb-6">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2"
        />

        <button
          onClick={addItem}
          className="bg-green-500 text-white px-4"
        >
          Add
        </button>
      </div>

      {/* MENU LIST */}
      {menu.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center border p-3 mb-2"
        >
          <div>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
            <p className="text-sm text-gray-500">
              {item.category}
            </p>
          </div>

          <div className="flex gap-2">
            {/* EDIT PRICE */}
            <button
              onClick={() => {
                const newPrice = prompt("New Price:");
                if (newPrice) updatePrice(item._id, newPrice);
              }}
              className="bg-blue-500 text-white px-2"
            >
              Edit
            </button>

            {/* TOGGLE */}
            <button
              onClick={() => toggleAvailability(item)}
              className="bg-yellow-500 text-white px-2"
            >
              {item.available ? "Disable" : "Enable"}
            </button>

            {/* DELETE */}
            <button
              onClick={() => deleteItem(item._id)}
              className="bg-red-500 text-white px-2"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}