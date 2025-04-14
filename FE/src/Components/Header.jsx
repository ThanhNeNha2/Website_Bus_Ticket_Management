import React from "react";
import logo from "../images/Logo1.png";

const Header = () => {
  return (
    <nav className="bg-black text-white   fixed top-0 right-0 left-0 z-[999]  px-4 border-b border-gray-600">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Title */}
        <div className="text-lg font-bold w-[60px] h-[60px]">
          {/* Vé Xe Toàn Quốc */}
          <img src={logo} alt="Logo" className="  object-cover" />
        </div>

        {/* Menu Items */}
        <ul className="flex space-x-6">
          <li>
            <a href="#" className="hover:text-gray-300">
              Trang chủ
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Giới thiệu
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Tuyến xe
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Đăng nhập
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Liên hệ
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Tuyển đặc biệt
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Tin tức
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
