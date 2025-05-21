import React, { useState } from "react";
import logo from "../images/Logo1.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaChevronDown,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
    setIsDropdownOpen(false);
  };

  const navItems = [
    { path: "/", label: "Trang chủ" },
    { path: "/introduce", label: "Giới thiệu" },
    { path: "/ListRoutertrip", label: "Tuyến xe" },
    { path: "/contact", label: "Liên hệ" },
    { path: "/news", label: "Tin tức" },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white fixed top-0 right-0 left-0 z-[999] shadow-2xl backdrop-blur-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-blue-400 transition-all duration-300 transform group-hover:scale-105">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              BusLine
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
                  isActivePath(item.path)
                    ? "text-blue-400 bg-blue-400/10"
                    : "hover:text-blue-300 hover:bg-white/5"
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {isActivePath(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {user.username ? (
              <div className="relative">
                <div
                  className="flex items-center space-x-3 cursor-pointer p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="relative">
                    <img
                      src={
                        user.image ||
                        "https://i.pinimg.com/736x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg"
                      }
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-600 group-hover:border-blue-400 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-sm font-medium group-hover:text-blue-300 transition-colors duration-300">
                      {user.username}
                    </span>
                  </div>
                  <FaChevronDown
                    className={`text-xs text-gray-400 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isDropdownOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            user.image ||
                            "https://i.pinimg.com/736x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg"
                          }
                          alt="User"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-white">
                            {user.username}
                          </p>
                          <p className="text-xs text-gray-400">
                            Khách hàng thân thiết
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/info"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors duration-200 group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaUser className="text-blue-400 group-hover:text-blue-300" />
                        <span className="group-hover:text-blue-300">
                          Thông tin cá nhân
                        </span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-red-500/20 transition-colors duration-200 group text-left"
                      >
                        <FaSignOutAlt className="text-red-400 group-hover:text-red-300" />
                        <span className="group-hover:text-red-300">
                          Đăng xuất
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Đăng nhập
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-700">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActivePath(item.path)
                      ? "text-blue-400 bg-blue-400/10"
                      : "hover:text-blue-300 hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
