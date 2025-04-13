import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import MainLayout from "../Layouts/MainLayout";

const CustomRouter = () => {
  return (
    <Routes>
      {/* Các trang dùng chung layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Trang không dùng layout */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default CustomRouter;
