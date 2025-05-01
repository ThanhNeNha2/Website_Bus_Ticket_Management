import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import MainLayout from "../Layouts/MainLayout";
import Introduce from "../Pages/Introduce/Introduce";
import ListRoutertrip from "../Pages/ListRoutertrip/ListRoutertrip";
import News from "../Pages/News/News";
import GarageLayout from "../Layouts/AdminLayout";
import InfoTicket from "../Components/Admin/InfoTicket";
import Register from "../Pages/Register/Register";
import ClientLayout from "../Layouts/ClientLayout";
import InfoUser from "../Components/InfoUser";
import InfoTrip from "../Components/Admin/InfoTrip";
import InfoCar from "../Components/Admin/InfoCar";
import InfoPromotion from "../Components/Admin/InfoPromotion";

// Component ProtectedRoute để kiểm tra token và vai trò
const ProtectedRoute = ({ children, allowedRoles, requireAuth = true }) => {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Nếu yêu cầu xác thực nhưng không có token, chuyển hướng đến login
  if (requireAuth && !token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có allowedRoles và vai trò không khớp, chuyển hướng đến trang chính
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const CustomRouter = () => {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  return (
    <Routes>
      {/* MainLayout public routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/introduce"
          element={
            <ProtectedRoute>
              <Introduce />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ListRoutertrip"
          element={
            <ProtectedRoute>
              <ListRoutertrip />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* GarageLayout routes */}
      {role === "GARAGE" && (
        <Route
          element={
            <ProtectedRoute allowedRoles={["GARAGE"]}>
              <GarageLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/ticket-management" element={<InfoTicket />} />
          <Route path="/trip-management" element={<InfoTrip />} />
          <Route path="/user-management" element={<InfoUser />} />
          <Route path="/vehicle-management" element={<InfoCar />} />
          <Route path="/promotion-management" element={<InfoPromotion />} />

          <Route path="/info" element={<InfoUser />} />
        </Route>
      )}

      {/* ClientLayout routes */}
      {role === "USER" && (
        <Route
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/info" element={<InfoUser />} />
        </Route>
      )}

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          token ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

export default CustomRouter;
