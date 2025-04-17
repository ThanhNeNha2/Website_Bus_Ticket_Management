import React, { useState } from "react";

const SeeDetail = () => {
  const [selectedTab, setSelectedTab] = useState("Giới thiệu");

  const tabs = [
    { label: "Giới thiệu" },
    { label: "Số điện thoại / Địa chỉ" },
    { label: "Đánh giá" },
  ];

  return (
    <div className="  bg-white rounded-lg shadow-md w-full p-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black">Nhà xe Phú Xuyên</h2>
      </div>

      {/* Hình ảnh */}
      <div className="flex space-x-2 mb-4">
        <div className="w-2/3 h-32 bg-gray-200 rounded-md flex items-center justify-center">
          <span className="text-gray-500">Hình ảnh xe</span>
        </div>
        <div className="w-1/3 h-32 bg-gray-200 rounded-md flex items-center justify-center">
          <span className="text-gray-500">Hình ảnh xe</span>
        </div>
      </div>

      {/* Thông tin */}
      <div className="flex space-x-4 mb-4 text-sm border-b border-gray-300">
        {tabs.map((tab) => (
          <div
            key={tab.label}
            onClick={() => setSelectedTab(tab.label)}
            className={`cursor-pointer pb-2 text-orange-600 ${
              selectedTab === tab.label
                ? "border-b-2 border-orange-600 font-semibold"
                : ""
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Đang cập nhật thông tin */}
      <p className="text-gray-600">Đang cập nhật thông tin</p>
    </div>
  );
};

export default SeeDetail;
