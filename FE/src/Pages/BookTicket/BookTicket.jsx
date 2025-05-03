import React, { useState } from "react";
import SeeDetail from "../../Components/Home/ListRoutertrip/SeeDetail";
import { api } from "../../Util/axios";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const fetchTrips = async (id) => {
  console.log("check thong tin cua id kkk ", id);
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");

  const res = await api.get(`/trips/${id}`);
  console.log("check res.data.data.trips", res.data);

  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể tải danh sách chuyến xe.");

  return res.data.trip || [];
};
const BookTicket = () => {
  const { id } = useParams();

  const {
    data: trips = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trips", id],
    queryFn: () => fetchTrips(id),
  });

  console.log("check thông tin trip cấu đặt vé", trips);

  // Default trip data
  const tripData = {
    title: trips.title || "Chuyến Hà Nội đi Ninh Bình",
    operator: trips.operator || "Nhà xe Chí Thanh",
    price: trips.price || 200000,
    departureTime: trips.departureTime || "7:30PM",
    arrivalTime: trips.arrivalTime || "9:30PM",
    travelDate: trips.travelDate || "20/10/2025",
    pickupPoint: trips.pickupPoint || "Bến xe Miền Đông",
    dropOffPoint: trips.dropOffPoint || "Bến xe Miền Tây",
  };

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    promoCode: "",
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên là bắt buộc";
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
    }
    if (!formData.address.trim()) newErrors.address = "Địa chỉ là bắt buộc";
    if (
      formData.promoCode.trim() &&
      !/^[A-Za-z0-9]{6,12}$/.test(formData.promoCode)
    ) {
      newErrors.promoCode = "Mã khuyến mãi phải là 6-12 ký tự chữ hoặc số";
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus("error");
      return;
    }

    // Log form data (replace with API call in production)
    console.log("Booking submitted:", {
      trip: tripData,
      user: formData,
    });

    // Show success message
    setSubmitStatus("success");
    // Reset form
    setFormData({ name: "", email: "", phone: "", address: "", promoCode: "" });
    // Clear success message after 3 seconds
    setTimeout(() => setSubmitStatus(null), 3000);
  };

  return (
    <div className="mt-10 min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Thông tin đặt vé
        </h2>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Trip Details and Form Section */}
          <div className="flex-[4] space-y-6">
            {/* Trip Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-900">
                {tripData.title}
              </h3>
              <p className="text-lg text-gray-600 mt-1">{tripData.operator}</p>
            </div>

            {/* Trip Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Thông tin chuyến xe
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-32">
                    Giá vé:
                  </span>
                  <span className="text-gray-900">
                    {tripData.price.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-32">
                    Số ghế trống :
                  </span>
                  <span className="text-gray-900">20/22</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-32">
                    Giờ xuất phát:
                  </span>
                  <span className="text-gray-900">
                    {tripData.departureTime}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-32">
                    Giờ đến:
                  </span>
                  <span className="text-gray-900">{tripData.arrivalTime}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-32">
                    Ngày đi:
                  </span>
                  <span className="text-gray-900">{tripData.travelDate}</span>
                </div>{" "}
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-32">
                    Ngày đến:
                  </span>
                  <span className="text-gray-900">{tripData.travelDate}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-32">
                    Điểm đón:
                  </span>
                  <span className="text-gray-900">{tripData.pickupPoint}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-32">
                    Điểm trả:
                  </span>
                  <span className="text-gray-900">{tripData.dropOffPoint}</span>
                </div>
              </div>
            </div>

            {/* Booking Information Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  Thông tin người đặt
                </h4>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm`}
                      placeholder="Nhập họ và tên"
                      aria-required="true"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm`}
                      placeholder="Nhập email"
                      aria-required="true"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm`}
                      placeholder="Nhập số điện thoại"
                      aria-required="true"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm`}
                      placeholder="Nhập địa chỉ"
                      aria-required="true"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  Mã khuyến mãi
                </h4>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="promoCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mã code
                    </label>
                    <input
                      type="text"
                      id="promoCode"
                      name="promoCode"
                      value={formData.promoCode}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.promoCode ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm`}
                      placeholder="Nhập mã khuyến mãi (nếu có)"
                      aria-describedby={
                        errors.promoCode ? "promoCode-error" : undefined
                      }
                    />
                    {errors.promoCode && (
                      <p
                        id="promoCode-error"
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.promoCode}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="py-2 px-6 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                      Đặt vé
                    </button>
                  </div>
                </div>
              </div>

              {submitStatus === "success" && (
                <p className="mt-4 text-sm text-green-600">
                  Đặt vé thành công! Vui lòng kiểm tra email để xác nhận.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="mt-4 text-sm text-red-600">
                  Vui lòng kiểm tra lại thông tin.
                </p>
              )}
            </form>
          </div>

          {/* SeeDetail Section */}
          <div className="flex-[2]">
            <SeeDetail trips={trips} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;
