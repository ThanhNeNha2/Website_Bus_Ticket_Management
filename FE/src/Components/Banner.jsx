import React from "react";

const Banner = () => {
  return (
    <div
      className="relative h-[450px] bg-cover bg-center mt-14"
      style={{
        backgroundImage: `url(https://images.pexels.com/photos/7252040/pexels-photo-7252040.jpeg)`,
      }}
    >
      {/* Overlay để làm mờ nền (tùy chọn) */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Nội dung banner */}
      <div className="relative container mx-auto h-full flex flex-col justify-center items-start p-6">
        <h1 className="text-4xl font-bold text-white mb-2">
          Đặt Vé Xe Nhanh Chóng, Dễ Dàng
        </h1>
        <p className="text-lg text-white mb-4">
          Hơn 1000 chuyến xe mỗi ngày - Phủ khắp các tỉnh thành
        </p>
        <button className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600">
          Đặt vé ngay
        </button>
      </div>
    </div>
  );
};

export default Banner;
