import React, { useEffect, useState } from "react";
import { api } from "../../../Util/axios";

const UpdateInfoPromotion = ({
  handleEditPromotion,
  formData,
  handleInputChange,
  updatePromotionMutation,
  setIsEditModalOpen,
  resetForm,
}) => {
  const [discountError, setDiscountError] = useState("");
  const [trips, setTrips] = useState([]);

  // Validate discount value based on discount type
  const validateDiscount = () => {
    const value = parseFloat(formData.discountValue);
    if (formData.discountType === "Percentage" && (value < 0 || value > 100)) {
      setDiscountError(
        "Giá trị giảm giá phần trăm phải nằm trong khoảng 0-100."
      );
      return false;
    }
    if (formData.discountType === "Fixed" && value <= 0) {
      setDiscountError("Giá trị giảm giá cố định phải lớn hơn 0.");
      return false;
    }
    setDiscountError("");
    return true;
  };

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateDiscount()) {
      return; // Prevent submission if discount validation fails
    }
    handleEditPromotion(e); // Call the submit handler if valid
  };

  // Fetch trips data
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get("/tripsNoPage");
        setTrips(res.data.data.trips);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      }
    };
    fetchTrips();
  }, []);

  // Handle trip selection
  const handleTripSelection = (e) => {
    const selectedTripId = e.target.value;
    if (
      selectedTripId &&
      !formData.applicableTrips.some((trip) => trip._id === selectedTripId)
    ) {
      handleInputChange({
        target: {
          name: "applicableTrips",
          value: [...formData.applicableTrips, { _id: selectedTripId }],
        },
      });
    }
    e.target.value = ""; // Reset dropdown
  };

  // Handle trip removal
  const handleRemoveTrip = (tripId) => {
    handleInputChange({
      target: {
        name: "applicableTrips",
        value: formData.applicableTrips.filter((trip) => trip._id !== tripId),
      },
    });
  };

  // Filter available trips (exclude selected ones)
  const availableTrips = trips.filter(
    (trip) =>
      !formData.applicableTrips.some(
        (selectedTrip) => selectedTrip._id === trip._id
      )
  );

  // Handle cancel action
  const handleCancel = () => {
    setIsEditModalOpen(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-14">
      <div className="bg-white p-6 rounded-lg w-[800px]">
        <h3 className="text-xl font-bold mb-4">Sửa mã giảm giá</h3>
        <form onSubmit={onSubmit}>
          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Mã giảm giá
              </label>
              <input
                type="text"
                name="code"
                placeholder="VD: SUMMER2025"
                value={formData.code}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Loại giảm giá
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">-- Chọn loại --</option>
                <option value="Percentage">Phần trăm</option>
                <option value="Fixed">Cố định</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Giá trị giảm
              </label>
              <input
                type="number"
                name="discountValue"
                placeholder="VD: 10 hoặc 50000"
                value={formData.discountValue}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              {discountError && (
                <p className="text-red-500 text-sm mt-1">{discountError}</p>
              )}
            </div>
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Số lần sử dụng tối đa
              </label>
              <input
                type="number"
                name="maxUses"
                placeholder="VD: 100"
                value={formData.maxUses}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
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
                <option value="Kích hoạt">Kích hoạt</option>
                <option value="Không kích hoạt">Không kích hoạt</option>
                <option value="Hết hạn">Hết hạn</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Ngày kết thúc
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              name="description"
              placeholder="VD: Giảm giá mùa hè cho tất cả các chuyến xe"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              rows="4"
            />
          </div>

          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Chọn chuyến xe áp dụng
              </label>
              <select
                name="applicableTrips"
                onChange={handleTripSelection}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">-- Chọn chuyến xe --</option>
                {availableTrips.map((trip) => (
                  <option key={trip._id} value={trip._id}>
                    {trip.pickupProvince} - {trip.dropOffProvince}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Các chuyến xe đã chọn
              </label>
              <div className="w-full border px-3 py-2 rounded h-24 overflow-y-auto">
                {formData.applicableTrips.length > 0 ? (
                  formData.applicableTrips.map((tripObj) => {
                    const trip = trips.find((t) => t._id === tripObj._id);
                    return (
                      <div
                        key={tripObj._id}
                        className="flex justify-between items-center text-sm mb-1"
                      >
                        <span>
                          {trip
                            ? `${trip.pickupProvince} - ${trip.dropOffProvince}`
                            : "Chuyến xe không xác định"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTrip(tripObj._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">
                    Chưa có chuyến xe nào được chọn
                  </p>
                )}
              </div>
            </div>
          </div>

          {updatePromotionMutation.isError && (
            <p className="text-red-500 text-sm mb-4">
              {updatePromotionMutation.error.message}
            </p>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={
                updatePromotionMutation.isLoading || discountError !== ""
              }
            >
              {updatePromotionMutation.isLoading ? "Đang xử lý..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInfoPromotion;
