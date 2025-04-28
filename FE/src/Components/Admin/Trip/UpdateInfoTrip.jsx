import React, { useEffect, useState } from "react";

const UpdateInfoTrip = ({
  formData,
  handleEditCar,
  handleInputChange,
  setIsEditModalOpen,
  resetForm,
  loading,
  setFile,
  setFormData,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  // Available features for selection
  const availableFeatures = [
    "WiFi",
    "Cung cấp nước suối miễn phí",
    "Charger",
    "TV",
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFile(file);
    }
  };

  // Handle adding a feature
  const handleAddFeature = (e) => {
    const selectedFeature = e.target.value;
    if (selectedFeature && !formData.features.includes(selectedFeature)) {
      setFormData({
        ...formData,
        features: [...formData.features, selectedFeature],
      });
    }
    // Reset the select to default
    e.target.value = "";
  };

  // Handle removing a feature
  const handleRemoveFeature = (featureToRemove) => {
    setFormData({
      ...formData,
      features: formData.features.filter(
        (feature) => feature !== featureToRemove
      ),
    });
  };

  useEffect(() => {
    setImagePreview(formData.image);
  }, [formData.image]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-14">
      <div className="bg-white p-6 rounded-lg w-[800px]">
        <h3 className="text-xl font-bold mb-4">Sửa thông tin xe</h3>
        <form onSubmit={handleEditCar}>
          <div className="flex gap-4">
            <div className="mb-4 flex-1">
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
            <div className="mb-4 flex-1">
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
          </div>

          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">Ảnh xe</label>
              <input
                type="file"
                name="vehicleImage"
                className="w-full border px-3 py-2 rounded"
                onChange={handleImageChange}
              />
            </div>
            <div className="mb-4 flex-1 h-[200px] bg-gray-100 flex items-center justify-center overflow-hidden rounded">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-contain h-full w-full"
                />
              ) : (
                <span className="text-gray-500">
                  Chọn một ảnh cho xe của bạn
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">Loại xe</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">-- Chọn loại xe --</option>
                <option value="SIT">SIT</option>
                <option value="BED">BED</option>
              </select>
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

          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">Dịch vụ</label>
              <select
                onChange={handleAddFeature}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">-- Chọn các loại dịch vụ --</option>
                {availableFeatures
                  .filter((feature) => !formData.features.includes(feature))
                  .map((feature) => (
                    <option key={feature} value={feature}>
                      {feature}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Tiện ích đã chọn
              </label>
              <div className="border rounded p-2 min-h-[40px] flex flex-wrap gap-2">
                {formData.features.length > 0 ? (
                  formData.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center bg-blue-100 px-2 py-1 rounded"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500">
                    Chưa có tiện ích nào được chọn
                  </span>
                )}
              </div>
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

export default UpdateInfoTrip;
