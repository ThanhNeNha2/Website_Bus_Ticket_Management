import React, { useState } from "react";
import { FaBus, FaRegImage, FaRegUserCircle } from "react-icons/fa";
import { FaCarOn } from "react-icons/fa6";
import { GiLovers } from "react-icons/gi";
import { IoTicketOutline } from "react-icons/io5";
import {
  MdOutlineDescription,
  MdAccountBalanceWallet,
  MdDiscount,
} from "react-icons/md";
import { TbLogout2, TbChevronRight } from "react-icons/tb";
import { Link } from "react-router-dom";

const SidebarClient = () => {
  const [activeItem, setActiveItem] = useState("Thông tin tài khoản");

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const menuItems = [
    {
      id: "Thông tin tài khoản",
      label: "Thông tin tài khoản",
      icon: FaRegUserCircle,
      color: "text-blue-500",
      path: "/info",
    },
    {
      id: "Mã giảm giá",
      label: "Mã giảm giá",
      icon: MdDiscount,
      color: "text-pink-500",
      path: "/infoPromotion",
    },
    {
      id: "Vé của tôi",
      label: "Vé của tôi",
      icon: IoTicketOutline,
      color: "text-green-500",
      path: "/infoTicket",
    },
  ];

  return (
    <div className="w-72 h-screen bg-gradient-to-b from-white to-gray-50 shadow-xl border-r border-gray-100 flex flex-col">
      {/* Header với avatar */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <FaRegUserCircle className="text-white text-lg" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Xin chào!</h3>
            <p className="text-sm text-gray-500">Khách hàng thân thiết</p>
          </div>
        </div>

        {/* Điểm tích lũy với thiết kế đẹp hơn */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Điểm tích lũy</p>
              <p className="text-2xl font-bold">100</p>
            </div>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <Link to={item.path} key={item.id}>
                <div
                  className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 mb-4 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                      : "hover:bg-gray-100 hover:shadow-md hover:transform hover:scale-102"
                  }`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isActive
                          ? "bg-white bg-opacity-20"
                          : "bg-gray-100 group-hover:bg-white"
                      }`}
                    >
                      <Icon
                        className={`text-lg ${
                          isActive
                            ? "text-white"
                            : `${item.color} group-hover:${item.color}`
                        }`}
                      />
                    </div>
                    <span
                      className={`font-medium ${
                        isActive
                          ? "text-white"
                          : "text-gray-700 group-hover:text-gray-800"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  <TbChevronRight
                    className={`transition-transform duration-200 ${
                      isActive
                        ? "text-white transform rotate-90"
                        : "text-gray-400 group-hover:text-gray-600 group-hover:transform group-hover:translate-x-1"
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <Link to="/login">
          <div
            className="flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-red-50 hover:shadow-md group"
            onClick={() => handleItemClick("Đăng xuất")}
          >
            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200">
              <TbLogout2 className="text-lg text-red-500" />
            </div>
            <span className="font-medium text-gray-700 group-hover:text-red-600">
              Đăng xuất
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SidebarClient;
