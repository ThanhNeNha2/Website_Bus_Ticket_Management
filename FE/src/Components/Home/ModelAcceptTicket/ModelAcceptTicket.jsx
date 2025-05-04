import React from "react";

const ModelAcceptTicket = ({ tripData, onCancel, onConfirm, priceSale }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Xác nhận đặt vé
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Chuyến xe:</p>
            <p className="text-base font-medium text-gray-900">
              {tripData.title}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Nhà xe:</p>
            <p className="text-base font-medium text-gray-900">
              {tripData.operator}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Giờ xuất phát:</p>
            <p className="text-base font-medium text-gray-900">
              {tripData.departureTime} - {tripData.travelDate}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Giá gốc:</p>
            <p className="text-base font-medium text-gray-900">
              {tripData.price.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Giá sau mã khuyến mãi:</p>
            <p className="text-base font-medium text-green-600">
              {Math.round(priceSale).toLocaleString("vi-VN")} VNĐ
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition font-medium"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition font-medium"
          >
            Xác nhận đặt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelAcceptTicket;
