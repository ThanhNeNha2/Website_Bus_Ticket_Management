import React from "react";
import logo from "../../images/Logo1.png";
import { Link } from "react-router-dom";
import { CgMail } from "react-icons/cg";
import { FaBell } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <nav className="bg-gray-500 text-black fixed top-0 right-0 left-0 z-[999] px-4 border-b border-gray-600">
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
              VN
            </Link>
          </li>
          <li>
            <Link to="/introduce" className="hover:text-gray-300 text-xl">
              <CgMail />
            </Link>
          </li>
          <li>
            <Link to="/ListRoutertrip" className="hover:text-gray-300">
              <FaBell />
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-300">
              <IoSettings />
            </Link>
          </li>

          {user.username ? (
            <li className="relative">
              <div className="flex items-center space-x-2 cursor-pointer">
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
            </li>
          ) : (
            <li>
              <Link to="/login" className="hover:text-gray-300">
                Đăng nhập
              </Link>
            </li>
          )}
          <li>
            <Link to="/news" className="hover:text-gray-300">
              <GiHamburgerMenu />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
