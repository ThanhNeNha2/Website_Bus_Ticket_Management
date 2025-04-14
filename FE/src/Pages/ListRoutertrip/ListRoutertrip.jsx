import React from "react";

const ListRoutertrip = () => {
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
    <div className="bg-black text-white py-12">
      <div className="container mx-auto">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-center mb-8">
          Danh sách các tuyến xe phổ biến
        </h2>

        {/* Grid cho các thẻ tuyến xe */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden">
              {/* Hình ảnh */}
              <img
                src={route.image}
                alt={route.title}
                className="w-full h-64 object-cover"
              />
              {/* Overlay và thông tin */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <h3 className="text-xl font-semibold">{route.title}</h3>
                <p className="text-orange-500 font-bold">{route.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListRoutertrip;
