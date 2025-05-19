import React, { useState } from "react";
import SeeDetail from "../../Components/Home/ListRoutertrip/SeeDetail";
import { api } from "../../Util/axios";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../Components/Pagination";
import { Link } from "react-router-dom";

const fetchTrips = async ({ page = 1, limit = 5, searchParams = {} }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");

  // Build query string with filters from searchParams
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
  // Input states for UI
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [carType, setCarType] = useState(""); // Thêm state cho carType
  // State for active search filters
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

  // Handle search to apply filters
  const handleSearch = () => {
    console.log("Tìm vé:", { departure, destination, date, carType });
    setSearchParams({
      pickupProvince: departure,
      dropOffProvince: destination,
      departureDate: date,
      carType: carType || undefined, // Chỉ thêm carType nếu có giá trị
    });
    setCurrentPage(1); // Reset to first page on new search
  };

  // Reset filters to show all trips
  const handleReset = () => {
    setDeparture("");
    setDestination("");
    setDate("");
    setCarType(""); // Reset carType
    setSearchParams({});
    setCurrentPage(1);
  };

  // Pagination
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
    <div className="bg-black text-white py-12 mt-14">
      <div className="container mx-auto">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-center mb-8">
          Danh sách các tuyến xe phổ biến
        </h2>

        {/* SEARCH */}
        <div className="flex-col md:flex-row items-center gap-3 md:gap-4 mb-6 flex justify-center">
          <select
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="py-[6px] px-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
            disabled={isLoading}
          >
            <option value="" disabled>
              Điểm xuất phát
            </option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="py-[6px] px-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
            disabled={isLoading}
          >
            <option value="" disabled>
              Điểm đến
            </option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="py-[5px] px-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
            disabled={isLoading}
          />

          {/* Thêm dropdown cho carType */}
          <select
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            className="py-[6px] px-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
            disabled={isLoading}
          >
            <option value="" disabled>
              Loại xe
            </option>
            {carTypes.map((type) => (
              <option key={type} value={type}>
                {type === "SIT" ? "Xe ghế ngồi" : "Xe giường nằm"}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="py-2 px-5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition font-medium"
            disabled={isLoading}
          >
            Tìm chuyến
          </button>

          <button
            onClick={handleReset}
            className="py-2 px-5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition font-medium"
            disabled={isLoading}
          >
            Xóa bộ lọc
          </button>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center text-gray-400">Đang tải dữ liệu...</div>
        )}
        {error && (
          <div className="text-center text-red-500">Lỗi: {error.message}</div>
        )}

        {!isLoading && !error && trips.length === 0 && (
          <div className="text-center text-gray-400">
            Không tìm thấy chuyến xe nào.
          </div>
        )}

        {/* Trip List */}
        {!isLoading && !error && trips.length > 0 && (
          <div className="px-10 flex gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full flex-[4]">
              {trips.map((trip) => (
                <div
                  key={trip._id}
                  className="relative rounded-xl overflow-hidden group shadow-lg h-[230px]"
                >
                  {/* Hình ảnh */}
                  <img
                    src="https://i.pinimg.com/736x/ba/c0/cf/bac0cfc9e389668b93f60a046096e4a4.jpg"
                    alt={`${trip.pickupProvince} - ${trip.dropOffProvince}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end transition-all duration-300 group-hover:bg-opacity-70">
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-white">
                        {trip.pickupProvince} - {trip.dropOffProvince}
                      </h3>
                      <p className="text-orange-400 font-bold">
                        Từ {trip.ticketPrice.toLocaleString("vi-VN")}VNĐ
                      </p>
                    </div>
                    <div
                      className="absolute inset-0 flex gap-1 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => {
                        setInfoTripDetail(trip);
                      }}
                    >
                      <span className="text-white text-sm font-semibold bg-orange-500 px-4 py-[6px] rounded-lg cursor-pointer">
                        Xem chi tiết
                      </span>{" "}
                      <Link to={`/bookticket/${trip._id}`}>
                        <span className="text-white text-sm font-semibold bg-orange-500 px-4 py-[6px] rounded-lg cursor-pointer">
                          Đặt vé
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-[2]">
              <SeeDetail trips={infoTripDetail} />
            </div>
          </div>
        )}

        {/* Pagination */}
        <Pagination totalPages={totalPages} handlePageClick={handlePageClick} />
      </div>
    </div>
  );
};

export default ListRoutertrip;
