import React, { useState } from "react";
import SeeDetail from "../../Components/Home/ListRoutertrip/SeeDetail";
import { api } from "../../Util/axios";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../Components/Pagination";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBus,
  FaEye,
  FaTicketAlt,
  FaFilter,
  FaTimes,
  FaRoute,
} from "react-icons/fa";
import { MdSwapHoriz } from "react-icons/md";

const fetchTrips = async ({ page = 1, limit = 5, searchParams = {} }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");

  const queryParams = { page, limit };
  if (searchParams.pickupProvince)
    queryParams.pickupProvince = searchParams.pickupProvince;
  if (searchParams.dropOffProvince)
    queryParams.dropOffProvince = searchParams.dropOffProvince;
  if (searchParams.departureDate)
    queryParams.departureDate = searchParams.departureDate;
  if (searchParams.carType) queryParams.carType = searchParams.carType;

  const query = new URLSearchParams(queryParams).toString();

  const res = await api.get(`/trips?${query}`);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể tải danh sách chuyến xe.");
  return {
    trips: res.data.data.trips || [],
    totalItems: res.data.data.total || 1,
  };
};

const ListRoutertrip = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [carType, setCarType] = useState("");
  const [searchParams, setSearchParams] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [infoTripDetail, setInfoTripDetail] = useState({});

  const {
    data: { trips = [], totalItems = 1 } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trips", currentPage, searchParams],
    queryFn: () =>
      fetchTrips({ page: currentPage, limit: itemsPerPage, searchParams }),
  });

  const handleSearch = () => {
    setSearchParams({
      pickupProvince: departure,
      dropOffProvince: destination,
      departureDate: date,
      carType: carType || undefined,
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setDeparture("");
    setDestination("");
    setDate("");
    setCarType("");
    setSearchParams({});
    setCurrentPage(1);
  };

  const handleSwapLocations = () => {
    const temp = departure;
    setDeparture(destination);
    setDestination(temp);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setCurrentPage(newPage);
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

  const carTypes = ["SIT", "BED"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Hero Section */}
      <div className="relative pt-20 pb-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Tìm chuyến xe phù hợp
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Khám phá các tuyến xe phổ biến với giá cả hợp lý và dịch vụ chất
              lượng
            </p>
          </div>

          {/* Enhanced Search Section */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                {/* Departure */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-green-400" />
                    Điểm xuất phát
                  </label>
                  <select
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="w-full py-3 px-4 bg-gray-800/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    disabled={isLoading}
                  >
                    <option value="" disabled>
                      Chọn điểm xuất phát
                    </option>
                    {provinces.map((province) => (
                      <option
                        key={province}
                        value={province}
                        className="bg-gray-800"
                      >
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center lg:order-3">
                  <button
                    onClick={handleSwapLocations}
                    className="p-3 bg-blue-500/20 hover:bg-blue-500/40 rounded-full border border-blue-500/50 transition-all duration-300 transform hover:scale-110"
                    disabled={isLoading}
                  >
                    <MdSwapHoriz className="text-blue-400 text-xl" />
                  </button>
                </div>

                {/* Destination */}
                <div className="relative lg:order-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-red-400" />
                    Điểm đến
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full py-3 px-4 bg-gray-800/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    disabled={isLoading}
                  >
                    <option value="" disabled>
                      Chọn điểm đến
                    </option>
                    {provinces.map((province) => (
                      <option
                        key={province}
                        value={province}
                        className="bg-gray-800"
                      >
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="relative lg:order-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-yellow-400" />
                    Ngày đi
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full py-3 px-4 bg-gray-800/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>

                {/* Car Type */}
                <div className="relative lg:order-5">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FaBus className="inline mr-2 text-purple-400" />
                    Loại xe
                  </label>
                  <select
                    value={carType}
                    onChange={(e) => setCarType(e.target.value)}
                    className="w-full py-3 px-4 bg-gray-800/80 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    disabled={isLoading}
                  >
                    <option value="" disabled>
                      Chọn loại xe
                    </option>
                    {carTypes.map((type) => (
                      <option key={type} value={type} className="bg-gray-800">
                        {type === "SIT" ? "Xe ghế ngồi" : "Xe giường nằm"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
                <button
                  onClick={handleSearch}
                  className="flex items-center justify-center gap-2 py-3 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  <FaSearch className="text-sm" />
                  Tìm chuyến
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 py-3 px-6 bg-gray-600/50 hover:bg-gray-600/70 rounded-xl font-medium transition-all duration-300 border border-gray-500"
                  disabled={isLoading}
                >
                  <FaTimes className="text-sm" />
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-12">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-lg text-gray-400">
              Đang tải dữ liệu...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-red-400 text-lg">Lỗi: {error.message}</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && trips.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-800/50 rounded-xl p-8 max-w-md mx-auto border border-gray-700">
              <FaRoute className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                Không tìm thấy chuyến xe nào.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Thử thay đổi điều kiện tìm kiếm của bạn
              </p>
            </div>
          </div>
        )}

        {/* Trip Results */}
        {!isLoading && !error && trips.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-8 mt-5">
            {/* Trip Grid */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Kết quả tìm kiếm
                </h2>
                <p className="text-gray-400">
                  Tìm thấy {totalItems} chuyến xe phù hợp
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <div
                    key={trip._id}
                    className="group bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src="https://i.pinimg.com/736x/ba/c0/cf/bac0cfc9e389668b93f60a046096e4a4.jpg"
                        alt={`${trip.pickupProvince} - ${trip.dropOffProvince}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      {/* Route Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          {trip.carId.vehicleType === "SIT"
                            ? "Ghế ngồi"
                            : "Giường nằm"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {trip.pickupProvince} → {trip.dropOffProvince}
                        </h3>
                        <div className="flex items-center text-gray-400 text-sm mb-3">
                          <FaRoute className="mr-2" />
                          <span>Tuyến đường phổ biến</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-400">
                          {trip.ticketPrice.toLocaleString("vi-VN")} VNĐ
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setInfoTripDetail(trip)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-sm font-medium transition-all duration-300"
                        >
                          <FaEye />
                          Chi tiết
                        </button>
                        <Link to={`/bookticket/${trip._id}`} className="flex-1">
                          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105">
                            <FaTicketAlt />
                            Đặt vé
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trip Detail Sidebar */}
            <div className="lg:w-96">
              <div className="sticky top-24">
                <SeeDetail trips={infoTripDetail} />
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && trips.length > 0 && (
          <div className="mt-12">
            <Pagination
              totalPages={totalPages}
              handlePageClick={handlePageClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListRoutertrip;
