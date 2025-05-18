import React, { useState } from "react";
import SeeDetail from "../../Components/Home/ListRoutertrip/SeeDetail";
import { api } from "../../Util/axios";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parse } from "date-fns";
import ModelAcceptTicket from "../../Components/Home/ModelAcceptTicket/ModelAcceptTicket";

const fetchTrip = async (id) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");

  const res = await api.get(`/trips/${id}`);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể tải thông tin chuyến xe.");

  return res.data.trip || {};
};

// Hàm định dạng giờ sang AM/PM
const formatTimeTo12Hour = (time) => {
  if (!time) return "";
  try {
    const date = parse(time, "HH:mm", new Date());
    return format(date, "h:mm a");
  } catch {
    return time;
  }
};

const fetchPromotion = async (code) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");

  const res = await api.get(`/promotions?code=${code}`);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể tải thông tin khuyến mãi.");

  return res.data || {};
};

const BookTicket = () => {
  const { id } = useParams();
  const [codeSale, setCodeSale] = useState("");
  const [priceSale, setPriceSale] = useState(0);
  // Lấy userId từ localStorage
  let userId;
  try {
    userId = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    userId = {};
  }

  // Lấy dữ liệu chuyến xe
  const {
    data: trip = {},
    isLoading: isTripLoading,
    error: tripError,
  } = useQuery({
    queryKey: ["trip", id],
    queryFn: () => fetchTrip(id),
    enabled: !!id,
  });

  // Map API response to tripData
  const tripData = {
    title:
      trip.pickupProvince && trip.dropOffProvince
        ? `${trip.pickupProvince} đi ${trip.dropOffProvince}`
        : "Chuyến Hà Nội đi Ninh Bình",
    operator: trip.operator || "Nhà xe Chí Thanh",
    price: trip.ticketPrice || 200000,
    departureTime: formatTimeTo12Hour(trip.departureTime),
    arrivalTime: formatTimeTo12Hour(trip.arrivalTime),
    travelDate: trip.departureDate
      ? new Date(trip.departureDate).toLocaleDateString("vi-VN")
      : "20/10/2025",
    pickupPoint: trip.pickupPoint || "Bến xe Miền Đông",
    dropOffPoint: trip.dropOffPoint || "Bến xe Miền Tây",
    availableSeats:
      trip.status === "Đã đầy" ? "0/22" : `${trip.seats || 22}/22`,
    arrivalDate: trip.arrivalDate
      ? new Date(trip.arrivalDate).toLocaleDateString("vi-VN")
      : "20/10/2025",
  };

  // Form state
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCodeSale(value); // Simplified to directly set codeSale as a string
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!codeSale.trim()) {
        // No promo code provided, use original price
        setPriceSale(tripData.price);
        setIsModalOpen(true); // Open modal directly
        return;
      }

      // Fetch promotion if code is provided
      const res = await fetchPromotion(codeSale);
      if (res.errCode !== 0) {
        throw new Error(res.message || "Mã khuyến mãi không hợp lệ.");
      }
      if (res.data.promotions[0].discountType === "Percentage") {
        setPriceSale(
          tripData.price * (1 - res.data.promotions[0].discountValue / 100)
        );
      } else if (res.data.promotions[0].discountType === "Fixed") {
        setPriceSale(tripData.price - res.data.promotions[0].discountValue);
      }

      setIsModalOpen(true); // Open modal after processing promo code
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khuyến mãi:", error.message);
      setErrors((prev) => ({
        ...prev,
        promoCode: "Mã code sai hoặc không tồn tại ",
      }));
    }
  };

  // Handle confirm booking
  const handleConfirmBooking = () => {
    setSubmitStatus("success");
    setIsModalOpen(false);
    setTimeout(() => setSubmitStatus(null), 3000);
  };

  // Handle cancel modal
  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  if (isTripLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải thông tin...</div>
      </div>
    );
  }

  if (tripError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">
          Lỗi: {tripError?.message || "Không thể tải thông tin."}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <style>
        {`
          input:disabled {
            color: #1f2937;
            background-color: #f3f4f6;
            opacity: 1;
          }
        `}
      </style>
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
                    Số ghế trống:
                  </span>
                  <span className="text-gray-900">
                    {tripData.availableSeats}
                  </span>
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
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-32">
                    Ngày đến:
                  </span>
                  <span className="text-gray-900">{tripData.arrivalDate}</span>
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
                      value={userId.username}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-100 disabled:opacity-100`}
                      placeholder="Nhập họ và tên"
                      disabled
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
                      value={userId.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-100 disabled:opacity-100`}
                      placeholder="Nhập email"
                      disabled
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
                      value={userId.phone}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-100 disabled:opacity-100`}
                      placeholder="Nhập số điện thoại"
                      disabled
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
                      value={userId.address}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-100 disabled:opacity-100`}
                      placeholder="Nhập địa chỉ"
                      disabled
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
                      htmlFor="codeSale"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mã code
                    </label>
                    <input
                      type="text"
                      id="codeSale"
                      name="codeSale"
                      value={codeSale}
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
            <SeeDetail trips={trip} />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ModelAcceptTicket
          tripData={tripData}
          onCancel={handleCancelModal}
          priceSale={priceSale}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default BookTicket;
