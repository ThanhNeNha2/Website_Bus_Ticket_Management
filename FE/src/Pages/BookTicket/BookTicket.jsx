import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../Util/axios";
import { format, parse } from "date-fns";
import SeeDetail from "../../Components/Home/ListRoutertrip/SeeDetail";
import ModelAcceptTicket from "../../Components/Home/ModelAcceptTicket/ModelAcceptTicket";

const fetchTrip = async (id) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");

  const res = await api.get(`/trips/${id}`);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể tải thông tin chuyến xe.");

  return res.data.trip || {};
};

const fetchPromotion = async (code) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");

  const res = await api.get(`/promotions?code=${code}`);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể tải thông tin khuyến mãi.");

  return res.data || {};
};

const createTicket = async (ticketData) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");

  const res = await api.post("/tickets", ticketData);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể đặt vé.");

  return res.data.ticket || {};
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

const BookTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Lấy userId từ localStorage
  let userId;
  try {
    userId = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    userId = {};
  }

  // Gọi useQuery và useMutation ở cấp độ top-level
  const {
    data: trip = {},
    isLoading: isTripLoading,
    error: tripError,
  } = useQuery({
    queryKey: ["trip", id],
    queryFn: () => fetchTrip(id),
    enabled: !!id,
  });

  const bookTicketMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(["trips"]);
      setSubmitStatus("success");
      setTimeout(() => {
        navigate("/ticket-history");
      }, 3000);
    },
    onError: (error) => {
      setErrors((prev) => ({
        ...prev,
        booking: error.message || "Đặt vé thất bại. Vui lòng thử lại.",
      }));
      setSubmitStatus("error");
    },
  });

  const [codeSale, setCodeSale] = useState("");
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [priceSale, setPriceSale] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Kiểm tra quyền truy cập sau khi gọi Hook
  const isAuthorized =
    localStorage.getItem("accessToken") && userId.role === "USER";
  if (!isAuthorized) {
    navigate("/login", { state: { from: window.location.pathname } });
    return null;
  }

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
    availableSeats: trip.seatsAvailable || 0,
    totalSeats: trip.totalSeats || 22,
    arrivalDate: trip.arrivalDate
      ? new Date(trip.arrivalDate).toLocaleDateString("vi-VN")
      : "20/10/2025",
  };

  // Validate trước khi đặt vé
  const validateBooking = () => {
    const newErrors = {};
    const today = new Date("2025-05-19"); // Hôm nay là 19/05/2025
    const departureDate = new Date(trip.departureDate);

    if (departureDate < today) {
      newErrors.departureDate = "Chuyến xe đã khởi hành. Không thể đặt vé.";
    }

    if (trip.seatsAvailable < numberOfTickets) {
      newErrors.seats = "Không đủ ghế trống để đặt vé.";
    }

    if (numberOfTickets <= 0) {
      newErrors.numberOfTickets = "Số lượng vé phải lớn hơn 0.";
    }

    if (codeSale && codeSale.length < 3) {
      newErrors.promoCode = "Mã khuyến mãi phải có ít nhất 3 ký tự.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCodeSale(value);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle number of tickets change
  const handleNumberOfTicketsChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setNumberOfTickets(value);
    if (errors.numberOfTickets) {
      setErrors((prev) => ({ ...prev, numberOfTickets: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateBooking()) return;

    try {
      let finalPrice = tripData.price * numberOfTickets;

      if (codeSale.trim()) {
        const res = await fetchPromotion(codeSale);
        if (res.errCode !== 0) {
          throw new Error(res.message || "Mã khuyến mãi không hợp lệ.");
        }
        if (res.data.promotions[0].discountType === "Percentage") {
          finalPrice *= 1 - res.data.promotions[0].discountValue / 100;
          setErrors((prev) => ({
            ...prev,
            promoCode: "Áp mã giảm giá thành công.",
          }));
        } else if (res.data.promotions[0].discountType === "Fixed") {
          finalPrice -= res.data.promotions[0].discountValue;
          setErrors((prev) => ({
            ...prev,
            promoCode: "Áp mã giảm giá thành công.",
          }));
        }
      }

      setPriceSale(finalPrice);
      setIsModalOpen(true); // Mở modal xác nhận
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khuyến mãi:", error.message);
      setErrors((prev) => ({
        ...prev,
        promoCode: "Mã code sai hoặc không tồn tại.",
      }));
    }
  };

  // Handle confirm booking
  const handleConfirmBooking = () => {
    const ticketData = {
      tripId: id,
      userId: userId._id,
      numberOfTickets,
      totalPrice: priceSale,
      promoCode: codeSale || null,
      status: "Đã đặt",
    };

    bookTicketMutation.mutate(ticketData);
    setIsModalOpen(false);
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Thông tin đặt vé
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Quay lại
          </button>
        </div>
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
                    {tripData.availableSeats}/{tripData.totalSeats}
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
                      value={userId.username || "Chưa có thông tin"}
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
                      value={userId.email || "Chưa có thông tin"}
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
                      value={userId.phone || "Chưa có thông tin"}
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
                      value={userId.address || "Chưa có thông tin"}
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

                  <div>
                    <label
                      htmlFor="numberOfTickets"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Số lượng vé
                    </label>
                    <input
                      type="number"
                      id="numberOfTickets"
                      name="numberOfTickets"
                      value={numberOfTickets}
                      onChange={handleNumberOfTicketsChange}
                      min="1"
                      max={trip.seatsAvailable}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.numberOfTickets
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm`}
                      required
                    />
                    {errors.numberOfTickets && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.numberOfTickets}
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
                        className={`mt-1 text-sm ${
                          errors.promoCode.includes("thành công")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {errors.promoCode}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="py-2 px-6 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                      disabled={bookTicketMutation.isLoading}
                    >
                      {bookTicketMutation.isLoading
                        ? "Đang xử lý..."
                        : "Đặt vé"}
                    </button>
                  </div>
                </div>
              </div>

              {errors.departureDate && (
                <p className="mt-4 text-sm text-red-600">
                  {errors.departureDate}
                </p>
              )}
              {errors.seats && (
                <p className="mt-4 text-sm text-red-600">{errors.seats}</p>
              )}
              {errors.booking && (
                <p className="mt-4 text-sm text-red-600">{errors.booking}</p>
              )}
              {submitStatus === "success" && (
                <p className="mt-4 text-sm text-green-600">
                  Đặt vé thành công! Đang chuyển hướng đến lịch sử đặt vé...
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
          numberOfTickets={numberOfTickets}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default BookTicket;
