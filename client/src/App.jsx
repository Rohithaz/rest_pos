import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Billing from "./pages/Billing/Billing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 🔥 keep token in sync
  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  return (
    <BrowserRouter>

      {/* NAVBAR */}
      {token && (
        <div className="bg-white shadow px-6 py-3 flex justify-between">
          <h1 className="font-bold text-lg">🍽 POS System</h1>

          <div className="flex gap-6">
            <Link to="/" className="hover:text-blue-600">Billing</Link>
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/admin" className="hover:text-blue-600">Admin</Link>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                setToken(null); // 🔥 IMPORTANT
              }}
              className="text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* ROUTES */}
      <Routes>

        {/* 🔥 Protected Routes */}
        <Route
          path="/"
          element={token ? <Billing /> : <Navigate to="/login" />}
        />

        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin"
          element={token ? <Admin /> : <Navigate to="/login" />}
        />

        {/* 🔥 Login Route */}
        <Route
          path="/login"
          element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;