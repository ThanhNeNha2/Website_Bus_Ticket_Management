import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Register from "../Pages/Register/Register";
import Login from "../Pages/Login/Login";
import AdminLayout from "../Layout/AdminLayout";
import Home from "../Pages/Home/Home";
import InfoUser from "../Pages/InfoUser/InfoUser";
import TripManagement from "../Pages/Trip/InfoTrip";
import BookTicket from "../Pages/Ticket/InfoTicket";
import InfoPromotion from "../Pages/InfoPromotion/InfoPromotion";
import InfoCar from "../Pages/Car/InfoCar";
import ManagerUser from "../Pages/User/ManagerUser";

// Component ProtectedRoute để kiểm tra token và vai trò
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Nếu không có token, chuyển hướng đến login
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  // Kiểm tra vai trò (chỉ cho phép ADMIN)
  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
    alert(
      "Người dùng vừa đăng nhập không có quyền truy cập. Vui lòng đăng nhập với tài khoản ADMIN."
    );
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return children;
};

const CustomRouter = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<InfoUser />} />
        <Route path="/trip-management" element={<TripManagement />} />
        <Route path="/ticket-management" element={<BookTicket />} />
        <Route path="/promotion-management" element={<InfoPromotion />} />
        <Route path="/car-management" element={<InfoCar />} />
        <Route path="/user-management" element={<ManagerUser />} />
      </Route>

      {/* Fallback 404 */}
      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
            state={{ from: window.location.pathname }}
          />
        }
      />
    </Routes>
  );
};

export default CustomRouter;
