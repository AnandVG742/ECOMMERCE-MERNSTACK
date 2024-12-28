import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from "./context/authContext";
import RequiredAuth from "./util/authRoutes";
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AddProductPage from './pages/AddProductPage';
import UpdateProductPage from './pages/UpdateProductPage';
import AdminPage from './pages/AdminPage';
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";

function App() {
  const [userLoggedData, setUserLoggedData] = useState({
    token: null,
    userId: null,
    isAdmin: false,
  });

  useEffect(() => {
    // Initialize the userLoggedData from localStorage only once
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const isAdmin = JSON.parse(localStorage.getItem("isAdmin")) || false;

    setUserLoggedData({
      token,
      userId,
      isAdmin,
    });
  }, []);

  const login = (token, userId, isAdmin) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
    setUserLoggedData({ token, userId, isAdmin });
  };

  const logout = () => {
    setUserLoggedData({ token: null, userId: null, isAdmin: false });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider
      value={{
        token: userLoggedData.token,
        userId: userLoggedData.userId,
        isAdmin: userLoggedData.isAdmin,
        login,
        logout,
      }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/addProduct"
          element={
            <RequiredAuth>
              <AddProductPage />
            </RequiredAuth>
          }
        />
        <Route
          path="/update/:id"
          element={
            <RequiredAuth>
              <UpdateProductPage />
            </RequiredAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequiredAuth>
              <AdminPage />
            </RequiredAuth>
          }
        />
        <Route
          path="/orders"
          element={
            <RequiredAuth>
              <OrdersPage />
            </RequiredAuth>
          }
        />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
