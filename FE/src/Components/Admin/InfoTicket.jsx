import React from "react";

const InfoTicket = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Tiêu đề */}
      <h2 className="text-2xl font-bold mb-4">Vé xe </h2>

      {/* Bảng */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Thông tin xe</th>
              <th className="py-2 px-4 border-b text-left">Khách đặt vé</th>
              <th className="py-2 px-4 border-b text-left">Điểm đón/Trả</th>
              <th className="py-2 px-4 border-b text-left">Ngày đi</th>
              <th className="py-2 px-4 border-b text-left">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {/* Dữ liệu trống */}
            <tr>
              <td colSpan="4" className="py-4 px-4 text-center text-red-500">
                Dữ liệu chưa được cập nhật
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfoTicket;
