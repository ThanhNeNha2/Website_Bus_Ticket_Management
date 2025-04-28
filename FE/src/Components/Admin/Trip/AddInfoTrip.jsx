import React, { useEffect, useState } from "react";
import { api } from "../../../Util/axios";

const AddInfoTrip = ({
  handleAddTrip,
  formData,
  handleInputChange,
  addTripMutation,
  setIsAddModalOpen,
  resetForm,
}) => {
  const [cars, setCars] = useState([]);
  const [seatError, setSeatError] = useState(""); // State để lưu thông báo lỗi về số ghế

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await api.get("/carsnopage");

        setCars(res.data.data.cars);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      }
    };

    fetchCars();
  }, []);

  // Kiểm tra số ghế khi formData thay đổi
  useEffect(() => {
    if (formData.carId && formData.totalSeats) {
      const selectedCar = cars.find((car) => car._id === formData.carId);
      if (selectedCar) {
        const totalSeats = parseInt(formData.totalSeats);
        const carSeats = parseInt(selectedCar.seats);
        if (totalSeats > carSeats) {
          setSeatError(
            `Tổng số ghế (${totalSeats}) vượt quá số ghế của xe (${carSeats}).`
          );
        } else {
          setSeatError(""); // Xóa lỗi nếu hợp lệ
        }
      }
    } else {
      setSeatError(""); // Xóa lỗi nếu chưa chọn xe hoặc chưa nhập số ghế
    }
  }, [formData.carId, formData.totalSeats, cars]);

  // Xử lý submit form
  const onSubmit = (e) => {
    e.preventDefault();
    if (seatError) {
      return; // Ngăn submit nếu có lỗi về số ghế
    }
    handleAddTrip(e); // Gọi hàm submit nếu không có lỗi
  };

  const provinces = [
    "Hà Nội",
    "Đà Nẵng",
    "TP. Hồ Chí Minh",
    "Hải Phòng",
    "Cần Thơ",
    "Bình Dương",
    "Đồng Nai",
    "Quảng Ninh",
    "Thừa Thiên Huế",
    "Lâm Đồng",
    "Khánh Hòa",
    "Nghệ An",
    "Thanh Hóa",
    "Bình Định",
    "An Giang",
    "Vĩnh Long",
    "Sóc Trăng",
    "Kiên Giang",
    "Tây Ninh",
    "Phú Yên",
    "Bà Rịa - Vũng Tàu",
    "Gia Lai",
    "Đắk Lắk",
    "Quảng Nam",
    "Hậu Giang",
  ];

  const busStations = [
    "Bến xe Miền Đông ",
    "Bến xe Miền Tây ",
    "Bến xe Lương Yên",
    "Bến xe Gia Lâm ",
    "Bến xe Đà Nẵng",
    "Bến xe Nha Trang",
  ];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-14">
      <div className="bg-white p-6 rounded-lg w-[800px]">
        <h3 className="text-xl font-bold mb-4">Thêm chuyến xe mới</h3>
        <form onSubmit={onSubmit}>
          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">Điểm đón</label>
              <select
                name="pickupPoint"
                value={formData.pickupPoint}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">-- Chọn điểm đón --</option>
                {busStations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">Tỉnh đón</label>
              <select
                name="pickupProvince"
                value={formData.pickupProvince}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">-- Chọn tỉnh đón --</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">Điểm trả</label>
              <select
                name="dropOffPoint"
                value={formData.dropOffPoint}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">-- Chọn điểm trả --</option>
                {busStations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">Tỉnh trả</label>
              <select
                name="dropOffProvince"
                value={formData.dropOffProvince}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">-- Chọn tỉnh trả --</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Ngày khởi hành
              </label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Giờ khởi hành
              </label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Dự kiến ngày đến
              </label>
              <input
                type="date"
                name="arrivalDate"
                value={formData.arrivalDate}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Dự kiến giờ đến
              </label>
              <input
                type="time"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Tổng số ghế
              </label>
              <input
                type="number"
                name="totalSeats"
                placeholder="VD: 20"
                value={formData.totalSeats}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              {seatError && (
                <p className="text-red-500 text-sm mt-1">{seatError}</p>
              )}
            </div>
            <div className="mb-4 flex-1  ">
              <label className="block text-sm font-medium mb-1">
                Ghế còn trống
              </label>
              <input
                type="number"
                name="seatsAvailable"
                placeholder="VD: 20"
                value={formData.seatsAvailable}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">Giá vé</label>
              <input
                type="number"
                name="ticketPrice"
                placeholder="VD: 500000"
                value={formData.ticketPrice}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">-- Chọn trạng thái --</option>
                <option value="UPCOMING">Chưa xuất phát</option>
                <option value="IN_PROGRESS">Đã xuất phát</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">Chọn xe</label>
              <select
                name="carId"
                value={formData.carId}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">-- Chọn xe --</option>
                {cars.map((car) => (
                  <option key={car._id} value={car._id}>
                    {car.nameCar} - {car.licensePlate} ({car.seats} chỗ)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {addTripMutation.isError && (
            <p className="text-red-500 text-sm mb-4">
              {addTripMutation.error.message}
            </p>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={addTripMutation.isLoading || seatError !== ""}
            >
              {addTripMutation.isLoading ? "Đang xử lý..." : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInfoTrip;
