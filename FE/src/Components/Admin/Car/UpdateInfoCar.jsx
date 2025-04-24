import React from "react";

const UpdateInfoCar = ({
  formData,
  handleEditCar,
  handleInputChange,
  setIsEditModalOpen,
  resetForm,
  loading,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-14">
      <div className="bg-white p-6 rounded-lg w-[800px]">
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
            <label className="block text-sm font-medium mb-1">Biển số xe</label>
            <input
              type="text"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="flex gap-4 ">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">Loại xe</label>
              <input
                type="text"
                name="vehicleTypeId"
                value={formData.vehicleTypeId}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-4 flex-1">
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
          </div>
          <div className="flex gap-4 ">
            <div className="mb-4 flex-1">
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
            <div className="mb-4 flex-1">
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
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInfoCar;
