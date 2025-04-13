import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
const MainLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet /> {/* Hiển thị các route con */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
