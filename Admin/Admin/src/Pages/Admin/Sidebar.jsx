import React, { useEffect, useState } from "react";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { BiMenuAltLeft } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

// Đây là component giả lập cho NavLink vì không thể import từ react-router-dom
const NavLink = ({ to, className, children }) => {
  // Giả lập routing logic
  return (
    <a
      href={to}
      className={
        typeof className === "function"
          ? className({ isActive: to === "/info" })
          : className
      }
    >
      {children}
    </a>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState("/info");
  const [userData, setUserData] = useState({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
  });
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user) {
      setUserData({
        fullName: user?.username || "ADMIN",
        email: user?.email || "admin@gmail.com",
      });
    }
  }, []); // chạy một lần khi component mount

  function handleLogout() {
    // Xử lý đăng xuất
    console.log("Đã đăng xuất");
    // Trong thực tế, điều này sẽ gọi hàm navigate
  }
  const navigate = useNavigate();

  // Icons (giả lập)
  const icons = {
    FaUser: () => <span className="text-lg">👤</span>,
    IoTicketOutline: () => <span className="text-lg">🎟️</span>,
    RiMoneyDollarCircleLine: () => <span className="text-lg">💰</span>,
    RiFriendsFill: () => <span className="text-lg">👥</span>,
    FaBus: () => <span className="text-lg">🚌</span>,
    MdDiscount: () => <span className="text-lg">🏷️</span>,
    FaCarOn: () => <span className="text-lg">🚗</span>,
    FaUserGroup: () => <span className="text-lg">👪</span>,
    MdOutlineDescription: () => <span className="text-lg">📝</span>,
    TbLogout2: () => <span className="text-lg">🚪</span>,
  };

  // Phân nhóm các mục menu
  const menuGroups = [
    {
      title: "Thông tin cá nhân",
      items: [
        {
          name: "Thông tin cá nhân",
          icon: <icons.FaUser />,
          path: "/info",
        },

        {
          name: "Biến động tài khoản",
          icon: <icons.RiMoneyDollarCircleLine />,
          path: "/account-transactions",
        },
        {
          name: "Bạn bè",
          icon: <icons.RiFriendsFill />,
          path: "/friends",
        },
      ],
    },
    {
      title: "Quản lý hệ thống",
      items: [
        {
          name: "Quản lý chuyến xe",
          icon: <icons.FaBus />,
          path: "/trip-management",
        },
        {
          name: "Quản lý vé",
          icon: <icons.IoTicketOutline />,
          path: "/ticket-management",
        },
        {
          name: "Quản lý mã giảm giá",
          icon: <icons.MdDiscount />,
          path: "/promotion-management",
        },
        {
          name: "Quản lý xe",
          icon: <icons.FaCarOn />,
          path: "/car-management",
        },
        {
          name: "Quản lý người dùng",
          icon: <icons.FaUserGroup />,
          path: "/user-management",
        },
      ],
    },
    {
      title: "Khác",
      items: [
        {
          name: "Giới thiệu",
          icon: <icons.MdOutlineDescription />,
          path: "/introduction",
        },
        {
          name: "Đăng xuất",
          icon: <icons.TbLogout2 />,
          path: "/logout",
          className: "text-red-300 hover:bg-red-900/20 hover:text-red-200",
        },
      ],
    },
  ];

  return (
    <div
      className={`transition-all duration-300 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen ${
        collapsed ? "w-20" : "w-64"
      }`}
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
      <div className="px-2 pb-4 overflow-y-auto max-h-[calc(100vh-160px)] hide-scrollbar">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            {!collapsed && (
              <h2 className="text-xs uppercase text-blue-300 font-semibold px-4 mb-2">
                {group.title}
              </h2>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => {
                        if (item.path === "/logout") {
                          handleLogout();
                        } else {
                          setCurrentPath(item.path);
                          navigate(item.path); // <-- điều hướng đến trang mới
                        }
                      }}
                      className={`flex items-center ${
                        collapsed ? "justify-center" : "justify-start px-4"
                      } py-2 rounded-lg transition-all ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : item.className ||
                            "text-blue-100 hover:bg-blue-700/50"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {!collapsed && (
                        <span className="ml-3 truncate">{item.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
