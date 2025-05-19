import React from "react";
import { Route, Routes } from "react-router-dom";
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

const CustomRouter = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<InfoUser />} />
        <Route path="/trip-management" element={<TripManagement />} />
        <Route path="/ticket-management" element={<BookTicket />} />
        <Route path="/promotion-management" element={<InfoPromotion />} />
        <Route path="/car-management" element={<InfoCar />} />
        <Route path="/user-management" element={<ManagerUser />} />
      </Route>
    </Routes>
  );
};

export default CustomRouter;
