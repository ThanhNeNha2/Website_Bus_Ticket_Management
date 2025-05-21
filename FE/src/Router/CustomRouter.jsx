import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import MainLayout from "../Layouts/MainLayout";
import Introduce from "../Pages/Introduce/Introduce";
import ListRoutertrip from "../Pages/ListRoutertrip/ListRoutertrip";
import News from "../Pages/News/News";
import Register from "../Pages/Register/Register";
import ClientLayout from "../Layouts/ClientLayout";
import InfoUser from "../Components/InfoUser";
import BookTicket from "../Pages/BookTicket/BookTicket";
import InfoTicket from "../Components/InfoTicket";
import InfoPromotion from "../Components/InfoPromotion";

// Component ProtectedRoute để kiểm tra token và vai trò
const ProtectedRoute = ({ children, allowedRoles, requireAuth = true }) => {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // Kiểm tra token hợp lệ (giả định có API verify)
  if (requireAuth && !token) {
    return <Navigate to="/login" replace />;
  }
  // Kiểm tra vai trò
  const hasRole = user?.role ? allowedRoles?.includes(user.role) : false;
  if (requireAuth && allowedRoles && !hasRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const CustomRouter = () => {
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
            <ProtectedRoute allowedRoles={["USER"]}>
              <Introduce />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ListRoutertrip"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <ListRoutertrip />
            </ProtectedRoute>
          }
        />

        <Route
          path="/news"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <News />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookticket/:id"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <BookTicket />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ClientLayout routes for USER */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/info" element={<InfoUser />} />
        <Route path="/infoTicket" element={<InfoTicket />} />
        <Route path="/infoPromotion" element={<InfoPromotion />} />
      </Route>

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <Navigate
            to={localStorage.getItem("accessToken") ? "/" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
};

export default CustomRouter;
