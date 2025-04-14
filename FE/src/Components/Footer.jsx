import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cột 1: Thông tin giới thiệu */}
        <div>
          <h3 className="text-xl font-bold mb-4">Vé Xe Toàn Quốc</h3>
          <p className="text-gray-300">
            Hệ thống đặt vé xe khách toàn quốc - nhanh chóng, thuận tiện, uy
            tín.
          </p>
        </div>

        {/* Cột 2: Navigation */}
        <div>
          <h3 className="text-xl font-bold mb-4">Navigation</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-300 hover:text-white">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white">
                Tuyến xe
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white">
                Đăng nhập
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white">
                Liên hệ
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white">
                Tuyển đặc biệt
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white">
                Tin tức
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
