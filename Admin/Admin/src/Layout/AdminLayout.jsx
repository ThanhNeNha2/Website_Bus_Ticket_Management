import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header";
import Sidebar from "../Pages/Admin/Sidebar";

// import SidebarClient from "../Pages/Client/SidebarClient";

const AdminLayout = () => {
  return (
    <div className="">
      <Header />
      <main>
        <div className="flex mt-16 ">
          <Sidebar />
          <Outlet /> {/* Hiển thị các route con */}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
