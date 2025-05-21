import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaBus } from "react-icons/fa";
import { FaCarOn, FaUser, FaUserGroup } from "react-icons/fa6";
import { IoTicketOutline } from "react-icons/io5";
import { MdDiscount, MdOutlineDescription } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { BiMenuAltLeft } from "react-icons/bi";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        setUserData(JSON.parse(user));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Phân nhóm các mục menu
  const menuGroups = [
    {
      title: "Thông tin cá nhân",
      items: [
        {
          name: "Thông tin cá nhân",
          icon: <FaUser />,
          path: "/info",
        },
        {
          name: "Vé của tôi",
          icon: <IoTicketOutline />,
          path: "/my-tickets",
        },
        {
          name: "Biến động tài khoản",
          icon: <RiMoneyDollarCircleLine />,
          path: "/account-transactions",
        },
        {
          name: "Bạn bè",
          icon: <RiMoneyDollarCircleLine />,
          path: "/friends",
        },
      ],
    },
    {
      title: "Quản lý hệ thống",
      items: [
        {
          name: "Quản lý chuyến xe",
          icon: <FaBus />,
          path: "/trip-management",
        },
        {
          name: "Quản lý vé",
          icon: <IoTicketOutline />,
          path: "/ticket-management",
        },
        {
          name: "Quản lý mã giảm giá",
          icon: <MdDiscount />,
          path: "/promotion-management",
        },
        {
          name: "Quản lý xe",
          icon: <FaCarOn />,
          path: "/car-management",
        },
        {
          name: "Quản lý người dùng",
          icon: <FaUserGroup />,
          path: "/user-management",
        },
      ],
    },
    {
      title: "Khác",
      items: [
        {
          name: "Giới thiệu",
          icon: <MdOutlineDescription />,
          path: "/introduction",
        },
      ],
    },
  ];

  return (
    <div
      className={`transition-all duration-300 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen ${
        collapsed ? "w-20" : "w-64"
      } relative`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold">Bus Admin</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <BiMenuAltLeft size={24} />
        </button>
      </div>

      {/* User info */}
      {!collapsed && userData && (
        <div className="mx-4 mb-6 p-3 bg-blue-700/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold">
              {userData.fullName
                ? userData.fullName.charAt(0).toUpperCase()
                : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate">
                {userData.fullName || "User"}
              </p>
              <p className="text-xs text-blue-200 truncate">
                {userData.email || ""}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="px-2 pb-4 overflow-y-auto h-[calc(100%-160px)]">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            {!collapsed && (
              <h2 className="text-xs uppercase text-blue-300 font-semibold px-4 mb-2">
                {group.title}
              </h2>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={`flex items-center ${
                        collapsed ? "justify-center" : "justify-start px-4"
                      } py-2 rounded-lg transition-all ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-blue-100 hover:bg-blue-700/50"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {!collapsed && (
                        <span className="ml-3 truncate">{item.name}</span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            collapsed ? "justify-center" : "justify-start px-4"
          } py-2 text-red-300 hover:bg-red-900/20 hover:text-red-200 rounded-lg transition-all`}
        >
          <TbLogout2 size={20} />
          {!collapsed && <span className="ml-3">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
