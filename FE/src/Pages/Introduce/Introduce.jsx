import React from "react";
import introduceImg from "../../images/introduce.jpg";
const Introduce = () => {
  return (
    <div className="bg-black text-white py-12 px-10 mt-14">
      <div className="container mx-auto flex flex-col md:flex-row items-center ">
        {/* Hình ảnh xe buýt */}
        <div className="md:w-1/2 mb-6 md:mb-0">
          <img
            src={introduceImg}
            alt="School Bus"
            className="w-full rounded-lg"
          />
        </div>

        {/* Nội dung văn bản */}
        <div className="md:w-1/2 md:pl-16 flex flex-col gap-6 ">
          <h2 className="text-3xl font-bold mb-6">
            Tại sao chọn Vé Xe Toàn Quốc?
          </h2>

          <div className="space-y-4 flex flex-col gap-6 ">
            <div className="flex flex-col gap-3 hover:bg-gray-500 p-4 rounded-lg">
              <h3 className="text-xl font-semibold">Đặt vé dễ dàng</h3>
              <p className="text-gray-300">
                Chỉ vài bước đơn giản, bạn có thể đặt vé mọi lúc mọi nơi.
              </p>
            </div>

            <div className="flex flex-col gap-3 hover:bg-gray-500 p-4 rounded-lg">
              <h3 className="text-xl font-semibold">Nhiều tuyến đường</h3>
              <p className="text-gray-300">
                Hơn 1000 tuyến xe khắp các tỉnh thành Việt Nam.
              </p>
            </div>

            <div className="flex flex-col gap-3 hover:bg-gray-500 p-4 rounded-lg">
              <h3 className="text-xl font-semibold">Hỗ trợ 24/7</h3>
              <p className="text-gray-300">
                Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn bất kỳ lúc
                nào.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
