import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import MainLayout from "../Layouts/MainLayout";
import Introduce from "../Pages/Introduce/Introduce";
import ListRoutertrip from "../Pages/ListRoutertrip/ListRoutertrip";
import News from "../Pages/News/News";

const CustomRouter = () => {
  return (
    <Routes>
      {/* Các trang dùng chung layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/introduce" element={<Introduce />} />
        <Route path="/ListRoutertrip" element={<ListRoutertrip />} />
        <Route path="/news" element={<News />} />
      </Route>

      {/* Trang không dùng layout */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default CustomRouter;
