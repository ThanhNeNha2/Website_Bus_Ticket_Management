import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import MainLayout from "../Layouts/MainLayout";
import Introduce from "../Pages/Introduce/Introduce";
import ListRoutertrip from "../Pages/ListRoutertrip/ListRoutertrip";
import News from "../Pages/News/News";
import AdminLayout from "../Layouts/AdminLayout";
import InfoTicket from "../Components/Admin/InfoTicket";
import Register from "../Pages/Register/Register";
import ClientLayout from "../Layouts/ClientLayout";
import InfoUser from "../Components/InfoUser";

const CustomRouter = () => {
  return (
    <Routes>
      {/* Các trang dùng chung layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/introduce" element={<Introduce />} />
        <Route path="/ListRoutertrip" element={<ListRoutertrip />} />
        <Route path="/news" element={<News />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ADMIN  */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/ticket" element={<InfoTicket />} />
        <Route path="/admin/info" element={<InfoUser />} />
      </Route>

      {/* CLIENT */}
      <Route element={<ClientLayout />}>
        <Route path="/info" element={<InfoUser />} />
      </Route>

      {/* Trang không dùng layout */}
    </Routes>
  );
};

export default CustomRouter;
