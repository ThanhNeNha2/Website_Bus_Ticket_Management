import React from "react";
import { useState } from "react";
import SeeDetail from "../../Components/Home/ListRoutertrip/SeeDetail";
const ListRoutertrip = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("2020-12-27");

  const handleSearch = () => {
    console.log("Tìm vé:", { departure, destination, date });
  };

  const routes = [
    {
      image:
        "https://i.pinimg.com/736x/ba/c0/cf/bac0cfc9e389668b93f60a046096e4a4.jpg",
      title: "TP.HCM - Cần Thơ",
      price: "Từ 120.000đ",
    },
    {
      image:
        "https://i.pinimg.com/736x/ba/c0/cf/bac0cfc9e389668b93f60a046096e4a4.jpg",
      title: "Hà Nội - Hải Phòng",
      price: "Từ 250.000đ",
    },
    {
      image:
        "https://i.pinimg.com/736x/ba/c0/cf/bac0cfc9e389668b93f60a046096e4a4.jpg",
      title: "Đà Nẵng - Huế",
      price: "Từ 180.000đ",
    },
  ];

  return (
    <div className="bg-black text-white py-12 mt-14">
      <div className="container mx-auto">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-center mb-8">
          Danh sách các tuyến xe phổ biến
        </h2>

        {/* SEARCH  */}
        <div className="  flex-col md:flex-row items-center gap-3 md:gap-4 mb-6 flex justify-center">
          {/* Điểm xuất phát */}
          <select
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="py-[6px] px-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="" disabled>
              Điểm xuất phát
            </option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="TP.HCM">TP.HCM</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>

          {/* Điểm đến */}
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="py-[6px] px-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="" disabled>
              Điểm đến
            </option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="TP.HCM">TP.HCM</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>

          {/* Ngày đi */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="py-[5px] px-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          {/* Nút Tìm vé */}
          <button
            onClick={handleSearch}
            className="py-2 px-5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition font-medium"
          >
            Tìm vé
          </button>
        </div>

        <div className="px-10 flex gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full flex-[4]">
            {routes.map((route, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden group shadow-lg h-[230px]"
              >
                {/* Hình ảnh */}
                <img
                  src={route.image}
                  alt={route.title}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end transition-all duration-300 group-hover:bg-opacity-70">
                  {/* Nội dung ở dưới cùng */}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-white">
                      {route.title}
                    </h3>
                    <p className="text-orange-400 font-bold">{route.price}</p>
                  </div>
                  {/* Xem chi tiết khi hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-lg font-semibold bg-orange-500 px-4 py-[6px] rounded-lg cursor-pointer">
                      Xem chi tiết
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-[2]">
            <SeeDetail />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListRoutertrip;
