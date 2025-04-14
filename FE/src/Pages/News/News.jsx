import React from "react";

const News = () => {
  return (
    <div className="bg-black text-white py-12">
      <div className="container mx-auto">
        {/* Grid chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cột 1: Mẹo đặt vé xe ngày lễ */}
          <div className="grid grid-cols-1 gap-6">
            <div className="relative rounded-lg overflow-hidden">
              {/* Hình ảnh */}
              <img
                src="https://i.pinimg.com/736x/81/27/ed/8127ed6c76e1e6fbf4227fd991416b3c.jpg"
                alt="Mẹo đặt vé xe ngày lễ"
                className="w-full h-64 object-cover rounded-lg"
              />
              {/* Nội dung */}
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">
                  Mẹo đặt vé xe ngày lễ
                </h3>
                <p className="text-gray-300">
                  Cách tránh hết vé và mua đúng giờ không căng thẳng mùa.
                </p>
              </div>
            </div>
          </div>

          {/* Cột 2: Xu hướng xe khách 2025 và Tuyến xe mới ra mắt */}
          <div className="grid grid-cols-1 gap-6">
            {/* Xu hướng xe khách 2025 */}
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/81/27/ed/8127ed6c76e1e6fbf4227fd991416b3c.jpg"
                alt="Xu hướng xe khách 2025"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">
                  Xu hướng xe khách 2025
                </h3>
                <p className="text-gray-300">
                  Xe giường đôi, xe điện, tiện ích trên xe được nâng cấp.
                </p>
              </div>
            </div>

            {/* Tuyến xe mới ra mắt */}
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/81/27/ed/8127ed6c76e1e6fbf4227fd991416b3c.jpg"
                alt="Tuyến xe mới ra mắt"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">Tuyến xe mới ra mắt</h3>
                <p className="text-gray-300">
                  Giới thiệu tuyến TP.HCM - Phú Quốc qua tram trung chuyển Hà
                  Tiên.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
