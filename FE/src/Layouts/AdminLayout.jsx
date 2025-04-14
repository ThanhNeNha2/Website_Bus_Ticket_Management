import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Sidebar from "../Pages/Admin/Sidebar";

const AdminLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <div className="flex px-16">
          <Sidebar />
          <Outlet /> {/* Hiển thị các route con */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
