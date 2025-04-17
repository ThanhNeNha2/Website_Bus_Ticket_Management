import React from "react";

const FAQ = () => {
  return (
    <div className="bg-black text-white py-12 px-52">
      <div className="container mx-auto">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-center mb-11">
          Câu hỏi thường gặp
        </h2>

        {/* Grid cho các câu hỏi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          {/* Câu hỏi 1 */}
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Tôi có thể đổi vé sau khi đã đặt không?
            </h3>
            <p className="text-gray-300">
              Bạn có thể đổi vé trước giờ khởi hành tối thiểu 2 tiếng, tùy thuộc
              vào chính sách nhà xe.
            </p>
          </div>

          {/* Câu hỏi 2 */}
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Làm thế nào để biết giờ xe chạy chính xác?
            </h3>
            <p className="text-gray-300">
              Bạn có thể xem thông tin chi tiết, chuyến xe trong phần Lịch trình
              hoặc gọi tổng đài 1900 9999.
            </p>
          </div>

          {/* Câu hỏi 3 */}
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Tôi thanh toán bằng hình thức nào?
            </h3>
            <p className="text-gray-300">
              Chúng tôi hỗ trợ thanh toán qua ví điện tử, thẻ ATM, và chuyển
              khoản ngân hàng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
