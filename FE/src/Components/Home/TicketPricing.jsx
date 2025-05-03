import React from "react";

const TicketPricing = () => {
  return (
    <div className="bg-black text-white py-12 px-10">
      <div className="container mx-auto">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-center mb-8">
          Bảng giá vé tham khảo
        </h2>

        {/* Grid cho các thẻ giá vé */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thẻ 1: TP.HCM - Cần Thơ */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              TUYẾN TP.HCM - Cần Thơ
            </h3>
            <p className="text-2xl font-bold text-orange-500 mb-4">
              Từ 120.000đ
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">✔</span>
                Xe giường nằm chất lượng cao
              </li>
              <li className nước="flex items-center">
                <span className="text-orange-500 mr-2">✔</span>
                Khởi hành mỗi giờ
              </li>
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">✔</span>
                Miễn phí nước và khăn lạnh
              </li>
            </ul>
          </div>

          {/* Thẻ 2: Hà Nội - Hải Phòng */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              TUYẾN Hà Nội - Hải Phòng
            </h3>
            <p className="text-2xl font-bold text-orange-500 mb-4">
              Từ 250.000đ
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">✔</span>
                Xe limousine 9 chỗ sang trọng
              </li>
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">✔</span>
                Wifi, nước uống, điều hòa
              </li>
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">✔</span>
                Đưa đón tận nơi nội thành
              </li>
            </ul>
          </div>
          {/* Thẻ 1: TP.HCM - Cần Thơ */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              TUYẾN TP.HCM - Cần Thơ
            </h3>
            <p className="text-2xl font-bold text-orange-500 mb-4">
              Từ 120.000đ
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">✔</span>
                Xe giường nằm chất lượng cao
              </li>
              <li className nước="flex items-center">
                <span className="text-orange-500 mr-2">✔</span>
                Khởi hành mỗi giờ
              </li>
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">✔</span>
                Miễn phí nước và khăn lạnh
              </li>
            </ul>
          </div>

          {/* Thẻ 2: Hà Nội - Hải Phòng */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              TUYẾN Hà Nội - Hải Phòng
            </h3>
            <p className="text-2xl font-bold text-orange-500 mb-4">
              Từ 250.000đ
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">✔</span>
                Xe limousine 9 chỗ sang trọng
              </li>
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">✔</span>
                Wifi, nước uống, điều hòa
              </li>
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">✔</span>
                Đưa đón tận nơi nội thành
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPricing;
