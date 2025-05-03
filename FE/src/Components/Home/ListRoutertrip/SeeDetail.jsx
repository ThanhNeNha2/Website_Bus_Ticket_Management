import React, { useState } from "react";

const SeeDetail = ({ trips }) => {
  const [selectedTab, setSelectedTab] = useState("Giới thiệu");

  const tabs = [{ label: "Giới thiệu" }, { label: "Thông tin chuyến" }];

  return (
    <div className="bg-white rounded-xl shadow-lg w-full p-6 border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {trips?.userId?.username || "Nhà xe ..... "}
        </h2>
      </div>

      {/* Hình ảnh */}
      <div className="mb-6">
        <div className="w-full h-48 rounded-lg overflow-hidden shadow-md">
          {trips?.userId?.image ? (
            <img
              src={trips.userId.image}
              alt="Hình ảnh nhà xe"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">Hình ảnh nhà xe</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 mb-6 text-base border-b border-gray-200">
        {tabs.map((tab) => (
          <div
            key={tab.label}
            onClick={() => setSelectedTab(tab.label)}
            className={`cursor-pointer pb-3 font-medium transition-colors duration-200 ${
              selectedTab === tab.label
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-orange-500"
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Nội dung tab */}
      <div className="text-gray-700 text-sm">
        {selectedTab === "Giới thiệu" && (
          <div className="space-y-3">
            <p>
              <span className="font-semibold text-gray-900">Tên nhà xe:</span>{" "}
              {trips?.userId?.username || "Chưa có thông tin"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">
                Số điện thoại:
              </span>{" "}
              {trips?.userId?.phone || "Chưa có thông tin"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Email:</span>{" "}
              {trips?.userId?.email || "Chưa có thông tin"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Mô tả:</span>{" "}
              {trips?.userId?.description || "Chưa có mô tả"}
            </p>
          </div>
        )}

        {selectedTab === "Thông tin chuyến" && (
          <div className="space-y-3">
            <p>
              <span className="font-semibold text-gray-900">Loại xe:</span>{" "}
              {trips?.carId?.nameCar || "Chưa có thông tin"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Số ghế:</span>{" "}
              {trips?.carId?.seats || "Chưa có thông tin"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Điểm đón:</span>{" "}
              {trips?.pickupPoint || "Chưa có thông tin"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Điểm trả:</span>{" "}
              {trips?.dropOffPoint || "Chưa có thông tin"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Giá vé:</span>{" "}
              {trips?.ticketPrice
                ? `${trips.ticketPrice} VNĐ`
                : "Chưa có thông tin"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeeDetail;
