import React, { useState } from "react";
import { FaBus, FaRegImage } from "react-icons/fa";
import { FaCarOn } from "react-icons/fa6";
import { IoTicketOutline } from "react-icons/io5";
import { MdOutlineDescription } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const menuItems = [
    {
      name: "Quản lý vé",
      icon: <IoTicketOutline />,
      path: "/ticket-management",
    },
    {
      name: "Quản lý chuyến xe",
      icon: <FaBus />,
      path: "/trip-management",
    },
    {
      name: "Thống kê",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h16v2H4v-2z" />
        </svg>
      ),
      path: "/statistics",
    },
    { name: "Quản lý xe", icon: <FaCarOn />, path: "/vehicle-management" },
    { name: "Album ảnh", icon: <FaRegImage />, path: "/photo-album" },
    {
      name: "Giới thiệu",
      icon: <MdOutlineDescription />,
      path: "/introduction",
    },
    {
      name: "Thông tin tài khoản",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 00-8 4v12a10 10 0 008 4 10 10 0 008-4V6a10 10 0 00-8-4zm0 2a2 2 0 110 4 2 2 0 010-4z" />
        </svg>
      ),
      path: "/account-information",
    },
    {
      name: "Bạn bè",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 00-8 4v12a10 10 0 008 4 10 10 0 008-4V6a10 10 0 00-8-4zm0 2a2 2 0 110 4 2 2 0 010-4z" />
        </svg>
      ),
      path: "/friends",
    },
    { name: "Vé của tôi", icon: <IoTicketOutline />, path: "/my-tickets" },
    {
      name: "Biến động tài khoản",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 00-8 4v12a10 10 0 008 4 10 10 0 008-4V6a10 10 0 00-8-4zm0 2a2 2 0 110 4 2 2 0 010-4z" />
        </svg>
      ),
      path: "/account-transactions",
    },
    { name: "Đăng xuất", icon: <TbLogout2 />, path: "/logout" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-100 text-gray-800 flex flex-col p-4">
      {/* Điểm tích lũy */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-2">
          <span className="text-white">★</span>
        </div>
        <span className="font-semibold">100 điểm</span>
      </div>

      {/* Menu */}
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                  isActive || activeItem === item.name
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200 hover:text-blue-600"
                }`
              }
              onClick={() => handleItemClick(item.name)}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
