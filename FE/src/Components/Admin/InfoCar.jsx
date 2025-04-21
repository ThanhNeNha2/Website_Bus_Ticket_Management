import React, { useEffect, useState } from "react";
import { api } from "../../Util/axios";

const InfoCar = () => {
  const [cars, setCars] = useState([]);
  const loading = false;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [formData, setFormData] = useState({
    nameCar: "",
    licensePlate: "",
    seats: "",
    vehicleTypeId: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    const res = api.get("/cars");
    console.log(res);
  }, []);

  const handleAddCar = async (e) => {
    e.preventDefault();
  };

  const handleEditCar = async (e) => {
    e.preventDefault();
    try {
      const updatedCar = {
        ...currentCar,
        nameCar: formData.nameCar,
        licensePlate: formData.licensePlate,
        seats: parseInt(formData.seats),
        vehicleTypeId: formData.vehicleTypeId,
        userId: {
          ...currentCar.userId,
          username: formData.username,
          email: formData.email,
        },
        updatedAt: new Date().toISOString(),
      };
      setCars(
        cars.map((car) => (car._id === currentCar._id ? updatedCar : car))
      );
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to edit car:", error);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (window.confirm("Bạn có chắc muốn xóa xe này?")) {
      try {
        setCars(cars.filter((car) => car._id !== carId));
      } catch (error) {
        console.error("Failed to delete car:", error);
      }
    }
  };

  const openEditModal = (car) => {
    setCurrentCar(car);
    setFormData({
      nameCar: car.nameCar,
      licensePlate: car.licensePlate,
      seats: car.seats.toString(),
      vehicleTypeId: car.vehicleTypeId,
      username: car.userId.username,
      email: car.userId.email,
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nameCar: "",
      licensePlate: "",
      seats: "",
      vehicleTypeId: "",
      username: "",
      email: "",
    });
    setCurrentCar(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="flex justify-between items рівні mb-4">
        <h2 className="text-2xl font-bold">Quản lý xe</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm xe
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Tên xe</th>
              <th className="py-2 px-4 border-b text-left">Biển số xe</th>
              <th className="py-2 px-4 border-b text-left">Loại xe</th>
              <th className="py-2 px-4 border-b text-left">Tổng ghế</th>
              <th className="py-2 px-4 border-b text-left">Chủ xe</th>
              <th className="py-2 px-4 border-b text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-blue-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : cars.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-red-500">
                  Dữ liệu chưa được cập nhật
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr key={car._id}>
                  <td className="py-2 px-4 border-b font-semibold">
                    {car.nameCar}
                  </td>
                  <td className="py-2 px-4 border-b">{car.licensePlate}</td>
                  <td className="py-2 px-4 border-b">
                    {car.vehicleTypeId || "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">{car.seats}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="font-medium">{car.userId.username}</div>
                    <div className="text-sm text-gray-600">
                      {car.userId.email}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => openEditModal(car)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteCar(car._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Car Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Thêm xe mới</h3>
            <form onSubmit={handleAddCar}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tên xe</label>
                <input
                  type="text"
                  name="nameCar"
                  value={formData.nameCar}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Biển số xe
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Loại xe
                </label>
                <input
                  type="text"
                  name="vehicleTypeId"
                  value={formData.vehicleTypeId}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Số ghế</label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Tên chủ xe
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Email chủ xe
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
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
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Car Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Sửa thông tin xe</h3>
            <form onSubmit={handleEditCar}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tên xe</label>
                <input
                  type="text"
                  name="nameCar"
                  value={formData.nameCar}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Biển số xe
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Loại xe
                </label>
                <input
                  type="text"
                  name="vehicleTypeId"
                  value={formData.vehicleTypeId}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Số ghế</label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Tên chủ xe
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Email chủ xe
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                  className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoCar;
