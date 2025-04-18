import React, { useState } from "react";
import { FaBus, FaRegImage, FaRegUserCircle } from "react-icons/fa";
import { FaCarOn } from "react-icons/fa6";
import { GiLovers } from "react-icons/gi";
import { IoTicketOutline } from "react-icons/io5";
import { MdOutlineDescription } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";

const SidebarClient = () => {
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

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
        <li
          className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors duration-200 ${
            activeItem === "Thông tin tài khoản"
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200 hover:text-blue-600"
          }`}
          onClick={() => handleItemClick("Thông tin tài khoản")}
        >
          <FaRegUserCircle />
          <span>Thông tin tài khoản</span>
        </li>
        <li
          className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors duration-200 ${
            activeItem === "Bạn bè"
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200 hover:text-blue-600"
          }`}
          onClick={() => handleItemClick("Bạn bè")}
        >
          <GiLovers />
          <span>Bạn bè</span>
        </li>
        <li
          className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors duration-200 ${
            activeItem === "Vé của tôi"
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200 hover:text-blue-600"
          }`}
          onClick={() => handleItemClick("Vé của tôi")}
        >
          <IoTicketOutline />
          <span>Vé của tôi</span>
        </li>
        <li
          className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors duration-200 ${
            activeItem === "Biến động tài khoản"
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200 hover:text-blue-600"
          }`}
          onClick={() => handleItemClick("Biến động tài khoản")}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 00-8 4v12a10 10 0 008 4 10 10 0 008-4V6a10 10 0 00-8-4zm0 2a2 2 0 110 4 2 2 0 010-4z" />
          </svg>
          <span>Biến động tài khoản</span>
        </li>
        <li
          className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors duration-200 ${
            activeItem === "Đăng xuất"
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200 hover:text-blue-600"
          }`}
          onClick={() => handleItemClick("Đăng xuất")}
        >
          <TbLogout2 />
          <span>Đăng xuất</span>
        </li>
      </ul>
    </div>
  );
};

export default SidebarClient;
