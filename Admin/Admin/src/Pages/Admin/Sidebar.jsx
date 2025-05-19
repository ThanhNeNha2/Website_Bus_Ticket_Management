import React, { useState } from "react";
import { FaBus, FaRegImage } from "react-icons/fa";
import { FaCarOn, FaUser, FaUserGroup } from "react-icons/fa6";
import { IoTicketOutline } from "react-icons/io5";
import { MdDiscount, MdOutlineDescription } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const handleLogout = () => {
    // Xóa thông tin đăng nhập
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    // Chuyển hướng đến /login
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      name: "Thông tin cá nhân ",
      icon: <FaUser />,
      path: "/info",
    },
    {
      name: "Quản lý chuyến xe",
      icon: <IoTicketOutline />,
      path: "/trip-management",
    },
    {
      name: "Quản lý vé",
      icon: <FaBus />,
      path: "/ticket-management",
    },
    {
      name: "Quản lý mã giảm giá ",
      icon: <MdDiscount />,
      path: "/promotion-management",
    },
    { name: "Quản lý xe", icon: <FaCarOn />, path: "/car-management" },
    {
      name: "Quản Lý người dùng ",
      icon: <FaUserGroup />,
      path: "/user-management",
    },
    {
      name: "Giới thiệu",
      icon: <MdOutlineDescription />,
      path: "/introduction",
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
  ];

  return (
    <div className="w-64 h-screen bg-gray-100 text-gray-800 flex flex-col p-4">
      {/* Điểm tích lũy */}

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
        {/* Đăng xuất */}
        <li>
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors duration-200 w-full text-left ${
              activeItem === "Đăng xuất"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 hover:text-blue-600"
            }`}
          >
            <TbLogout2 />
            <span>Đăng xuất</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
