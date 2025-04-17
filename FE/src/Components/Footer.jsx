import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Cột 1: Thông tin giới thiệu */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-yellow-400">
            Vé Xe Toàn Quốc
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Hệ thống đặt vé xe khách toàn quốc - nhanh chóng, thuận tiện, uy
            tín. Đặt vé dễ dàng chỉ với vài cú click chuột!
          </p>
        </div>

        {/* Cột 2: Thông tin liên hệ */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-yellow-400">
            Liên hệ
          </h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt /> 123 Đường Lớn, Quận 1, TP.HCM
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt /> 1900 9999
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope /> support@vexe.vn
            </li>
          </ul>
        </div>

        {/* Cột 3: Navigation */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-yellow-400">
            Liên kết nhanh
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Tuyến xe
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Tin tức
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Liên hệ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Đăng nhập
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Vé Xe Toàn Quốc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
