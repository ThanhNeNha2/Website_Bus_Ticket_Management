import React from "react";

const Header = () => {
  return (
    <nav className="bg-black text-white p-4  fixed top-0 right-0 left-0 z-[999]   border-b border-gray-600">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Title */}
        <div className="text-lg font-bold">Vé Xe Toàn Quốc</div>

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
