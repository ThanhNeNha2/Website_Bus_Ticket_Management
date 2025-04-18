import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

import SidebarClient from "../Pages/Client/SidebarClient";

const ClientLayout = () => {
  return (
    <div className="mt-14">
      <Header />
      <main>
        <div className="flex px-16">
          <SidebarClient />
          <Outlet /> {/* Hiển thị các route con */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;
