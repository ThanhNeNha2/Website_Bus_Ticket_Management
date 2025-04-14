import React from "react";

const Sidebar = () => {
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
      <ul className="space-y-4">
        <li className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 6h18v12H3V6zm2 2v8h14V8H5z" />
          </svg>
          <span>Quản lý vé</span>
        </li>
        <li className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 00-8 4v12a10 10 0 008 4 10 10 0 008-4V6a10 10 0 00-8-4zm-2 14h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2z" />
          </svg>
          <span>QL vé trung chuyển</span>
        </li>
        <li className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 00-8 4v12a10 10 0 008 4 10 10 0 008-4V6a10 10 0 00-8-4zm0 2a2 2 0 110 4 2 2 0 010-4zm-6 8h12v2H6v-2z" />
          </svg>
          <span>Quản lý chuyến xe</span>
        </li>
        <li className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h16v2H4v-2z" />
          </svg>
          <span>Thống kê</span>
        </li>
        <li className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h12v2H6V4zm0 4h12v2H6V8zm0 4h12v2H6v-2zm0 4h12v2H6v-2zM4 4h2v16H4V4zm14 0h2v16h-2V4z" />
          </svg>
          <span>Quản lý xe</span>
        </li>
        <li className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" />
          </svg>
          <span>Album ảnh</span>
        </li>
        <li className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 00-8 4v12a10 10 0 008 4 10 10 0 008-4V6a10 10 0 00-8-4zm0 2a2 2 0 110 4 2 2 0 010-4z" />
          </svg>
          <span>Giới thiệu</span>
        </li>
        <li className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 00-8 4v12a10 10 0 008 4 10 10 0 008-4V6a10 10 0 00-8-4zm0 2a2 2 0 110 4 2 2 0 010-4z" />
          </svg>
          <span>Thông tin tài khoản</span>
        </li>
        <li className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 00-8 4v12a10 10 0 008 4 10 10 0 008-4V6a10 10 0 00-8-4zm0 2a2 2 0 110 4 2 2 0 010-4z" />
          </svg>
          <span>Bạn bè</span>
        </li>
        <li className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 00-8 4v12a10 10 0 008 4 10 10 0 008-4V6a10 10 0 00-8-4zm0 2a2 2 0 110 4 2 2 0 010-4z" />
          </svg>
          <span>Vé của tôi</span>
        </li>
        <li className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 00-8 4v12a10 10 0 008 4 10 10 0 008-4V6a10 10 0 00-8-4zm0 2a2 2 0 110 4 2 2 0 010-4z" />
          </svg>
          <span>Biến động tài khoản</span>
        </li>
        <li className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 00-8 4v12a10 10 0 008 4 10 10 0 008-4V6a10 10 0 00-8-4zm0 2a2 2 0 110 4 2 2 0 010-4z" />
          </svg>
          <span>Đăng xuất</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
