import React, { useState } from "react";
import logo from "../images/Logo1.png";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    // Xóa thông tin đăng nhập
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    // Chuyển hướng đến /login
    navigate("/login", { replace: true });
    setIsDropdownOpen(false); // Đóng dropdown
  };

  return (
    <nav className="bg-black text-white fixed top-0 right-0 left-0 z-[999] px-4 border-b border-gray-600">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Title */}
        <Link to="/">
          <div className="text-lg font-bold w-[60px] h-[60px]">
            <img src={logo} alt="Logo" className="object-cover" />
          </div>
        </Link>

        {/* Menu Items */}
        <ul className="flex space-x-6 items-center">
          <li>
            <Link to="/" className="hover:text-gray-300">
              Trang chủ
            </Link>
          </li>
          <li>
            <Link to="/introduce" className="hover:text-gray-300">
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link to="/ListRoutertrip" className="hover:text-gray-300">
              Tuyến xe
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-300">
              Liên hệ
            </Link>
          </li>
          <li>
            <Link to="/special-routes" className="hover:text-gray-300">
              Tuyến đặc biệt
            </Link>
          </li>
          <li>
            <Link to="/news" className="hover:text-gray-300">
              Tin tức
            </Link>
          </li>
          {user.username ? (
            <li className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onMouseEnter={() => setIsDropdownOpen(true)}
              >
                <img
                  src={
                    user.image ||
                    "https://i.pinimg.com/736x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg"
                  }
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hover:text-gray-300">{user.username}</span>
              </div>
              {isDropdownOpen && (
                <ul
                  className="absolute top-full right-0 mt-4 w-48 bg-black border border-gray-600 rounded-md shadow-lg"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <li>
                    <Link
                      to="/info"
                      className="block px-4 py-2 hover:bg-gray-700 hover:text-gray-300"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Thông tin cá nhân
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700 hover:text-gray-300"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              )}
            </li>
          ) : (
            <li>
              <Link to="/login" className="hover:text-gray-300">
                Đăng nhập
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
