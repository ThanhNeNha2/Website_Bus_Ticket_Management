import React from "react";

const UpdateInfoTicket = ({
  formData,
  handleEditTicket,
  handleInputChange,
  setIsEditModalOpen,
  loading,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-14">
      <div className="bg-white p-6 rounded-lg w-[600px]">
        <h3 className="text-xl font-bold mb-4">Sửa thông tin vé</h3>

        <form onSubmit={handleEditTicket}>
          {/* Thông tin người dùng */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Người đặt vé
            </label>
            <input
              type="text"
              value={`${formData.userId.username} (${formData.userId.email})`}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          {/* Thông tin chuyến đi */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Chuyến đi</label>
            <input
              type="text"
              value={`${formData.tripId.pickupProvince} - ${formData.tripId.dropOffProvince} (${formData.tripId.departureTime} → ${formData.tripId.arrivalTime})`}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          {/* Giá vé */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Giá vé</label>
            <input
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Trạng thái vé */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">-- Chọn trạng thái --</option>
              <option value="Booked">Đã đặt</option>
              <option value="Confirmed">Đã xác nhận</option>
              <option value="Canceled">Đã hủy</option>
              <option value="Used">Đã sử dụng</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInfoTicket;
