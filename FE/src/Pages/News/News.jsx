import React from "react";

const News = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 py-16 mt-16 px-10">
      {/* Bài viết 1 */}
      <div className="flex items-start space-x-4">
        <img
          src="https://i.pinimg.com/736x/0a/c9/05/0ac9050c5f6cac02257aa9b162559726.jpg"
          alt="Mẹo đặt vé"
          className="w-40 h-28 object-cover rounded-xl"
        />
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-black">
            Mẹo đặt vé xe ngày lễ
          </h3>
          <p className="text-gray-300 text-sm mt-1">
            Cách tránh hết vé và mua đúng giờ khởi hành mong muốn.
          </p>
        </div>
      </div>

      {/* Bài viết 2 */}
      <div className="flex items-start space-x-4">
        <img
          src="https://i.pinimg.com/736x/0a/c9/05/0ac9050c5f6cac02257aa9b162559726.jpg"
          alt="Xu hướng"
          className="w-40 h-28 object-cover rounded-xl"
        />
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-black">
            Xu hướng xe khách 2025
          </h3>
          <p className="text-gray-300 text-sm mt-1">
            Xe giường đôi, xe điện, tiện ích trên xe được nâng cấp.
          </p>
        </div>
      </div>

      {/* Bài viết 3 */}
      <div className="flex items-start space-x-4">
        <img
          src="https://i.pinimg.com/736x/0a/c9/05/0ac9050c5f6cac02257aa9b162559726.jpg"
          alt="Tuyến mới"
          className="w-40 h-28 object-cover rounded-xl"
        />
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-black">
            Tuyến xe mới ra mắt
          </h3>
          <p className="text-gray-300 text-sm mt-1">
            Giới thiệu tuyến TP.HCM - Phú Quốc qua trạm trung chuyển Hà Tiên.
          </p>
        </div>
      </div>
    </div>
  );
};

export default News;
