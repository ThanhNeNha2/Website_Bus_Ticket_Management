import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Car,
  Users,
  CreditCard,
  Star,
  Badge,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
const SeeDetail = ({ trips }) => {
  const [selectedTab, setSelectedTab] = useState("Giới thiệu");

  const tabs = [
    {
      label: "Giới thiệu",
      icon: <Badge className="w-4 h-4" />,
      color: "from-blue-500 to-purple-600",
    },
    {
      label: "Thông tin chuyến",
      icon: <Car className="w-4 h-4" />,
      color: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 mt-20">
      {/* Header với gradient background */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">
              {trips?.userId?.username || "Nhà xe ...."}
            </h2>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white bg-opacity-5 rounded-full"></div>
      </div>

      {/* Container chính */}
      <div className="p-6">
        {/* Hình ảnh với hiệu ứng cao cấp */}
        <div className="mb-8">
          <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg group">
            {trips?.userId?.image ? (
              <>
                <img
                  src={trips.userId.image}
                  alt="Hình ảnh nhà xe"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">Nhà xe chất lượng cao</p>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Car className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <span className="text-gray-500 font-medium">
                    Hình ảnh nhà xe
                  </span>
                </div>
              </div>
            )}
            {/* Badge góc phải */}
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Đã xác thực
            </div>
          </div>
        </div>

        {/* Tabs với thiết kế hiện đại */}
        <div className="flex space-x-2 mb-8 bg-gray-50 p-1 rounded-xl">
          {tabs.map((tab) => (
            <div
              key={tab.label}
              onClick={() => setSelectedTab(tab.label)}
              className={`flex items-center space-x-2 px-4 py-1 rounded-lg cursor-pointer font-medium transition-all duration-300 flex-1 justify-center ${
                selectedTab === tab.label
                  ? "bg-white text-orange-600 shadow-md transform scale-105"
                  : "text-gray-600 hover:text-orange-500 hover:bg-white hover:bg-opacity-50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </div>
          ))}
        </div>

        {/* Nội dung tab với animation */}
        <div className="transition-all duration-500 ease-in-out">
          {selectedTab === "Giới thiệu" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid gap-4">
                <div className="flex items-start space-x-4 p-2 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors duration-300">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Badge className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      Tên nhà xe
                    </p>
                    <p className="text-gray-700">
                      {trips?.userId?.username || "Chưa có thông tin"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-2 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-colors duration-300">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      Số điện thoại
                    </p>
                    <p className="text-gray-700">
                      {trips?.userId?.phone || "Chưa có thông tin"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-2 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors duration-300">
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Email</p>
                    <p className="text-gray-700">
                      {trips?.userId?.email || "Chưa có thông tin"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-2 bg-orange-50 rounded-xl border border-orange-100 hover:bg-orange-100 transition-colors duration-300">
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Mô tả</p>
                    <p className="text-gray-700">
                      {trips?.userId?.description ||
                        "Nhà xe uy tín, chất lượng dịch vụ tốt, đảm bảo an toàn cho hành khách."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === "Thông tin chuyến" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid gap-4">
                <div className="flex items-start space-x-4 p-2 bg-indigo-50 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors duration-300">
                  <div className="bg-indigo-500 p-2 rounded-lg">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Loại xe</p>
                    <p className="text-gray-700">
                      {trips?.carId?.nameCar || "Xe khách cao cấp"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-2 bg-teal-50 rounded-xl border border-teal-100 hover:bg-teal-100 transition-colors duration-300">
                  <div className="bg-teal-500 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Số ghế</p>
                    <p className="text-gray-700">
                      {trips?.carId?.seats || "Chưa có thông tin"} ghế
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-2 bg-emerald-50 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors duration-300">
                  <div className="bg-emerald-500 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Điểm đón</p>
                    <p className="text-gray-700">
                      {trips?.pickupPoint || "Chưa có thông tin"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-2 bg-pink-50 rounded-xl border border-pink-100 hover:bg-pink-100 transition-colors duration-300">
                  <div className="bg-pink-500 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Điểm trả</p>
                    <p className="text-gray-700">
                      {trips?.dropOffPoint || "Chưa có thông tin"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-2 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors duration-300">
                  <div className="bg-red-500 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Ngày đi</p>
                    <p className="text-gray-700">
                      {trips?.departureDate
                        ? format(new Date(trips.departureDate), "dd/MM/yyyy")
                        : "Chưa có thông tin"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-2 bg-yellow-50 rounded-xl border border-yellow-100 hover:bg-yellow-100 transition-colors duration-300">
                  <div className="bg-yellow-500 p-2 rounded-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Giá vé</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {trips?.ticketPrice
                        ? `${trips.ticketPrice.toLocaleString()} VNĐ`
                        : "Liên hệ"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeeDetail;
