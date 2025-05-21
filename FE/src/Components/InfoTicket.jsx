import React, { useState } from "react";
import {
  Ticket,
  MapPin,
  Clock,
  Calendar,
  Car,
  CreditCard,
  Check,
  X,
  AlertCircle,
  Download,
  QrCode,
  Phone,
  Mail,
  Filter,
  Search,
  Trash2,
} from "lucide-react";
import { api } from "../Util/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Pagination from "./Pagination";

// Format date helper function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return `${formatDate(dateString)} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};

// Fetch tickets
const fetchTickets = async ({ page = 1, limit = 5 }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");
  const res = await api.get(`/myTickets?page=${page}&limit=${limit}`);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể tải danh sách vé.");
  return {
    tickets: res.data.tickets || [],
    totalItems: res.data.pagination.totalTickets || 1,
  };
};

// Cancel ticket
const cancelTicket = async (ticketId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");
  const res = await api.delete(`/tickets/${ticketId}`);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể hủy vé.");
  return res.data;
};

const UserTickets = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  const queryClient = useQueryClient();

  const {
    data: { tickets = [], totalItems = 1 } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tickets", currentPage],
    queryFn: () => fetchTickets({ page: currentPage, limit: itemsPerPage }),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets", currentPage]);
      alert("Hủy vé thành công!");
    },
    onError: (error) => {
      alert(`Lỗi: ${error.message}`);
    },
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setCurrentPage(newPage);
  };

  const handleCancelTicket = (ticketId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy vé này?")) {
      cancelMutation.mutate(ticketId);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: {
        label: "Đã đặt",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: <Check className="w-4 h-4" />,
      },
      pending: {
        label: "Chờ xác nhận",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: <Clock className="w-4 h-4" />,
      },
      cancelled: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-700 border-red-200",
        icon: <X className="w-4 h-4" />,
      },
      completed: {
        label: "Hoàn thành",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: <Check className="w-4 h-4" />,
      },
    };
    return configs[status] || configs.pending;
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    const matchesSearch =
      ticket.ticketCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.tripId?.pickupProvince
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ticket.tripId?.dropOffProvince
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải vé của bạn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 ml-2">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vé của
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              bạn
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Quản lý và theo dõi tất cả vé xe của bạn
          </p>
        </div>

        {/* Filters */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="cancelled">Đã hủy</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã vé hoặc tuyến đường..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-80"
              />
            </div>
          </div>
        </div> */}

        {/* Tickets Grid */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Chưa có vé nào
            </h3>
            <p className="text-gray-500">
              Bạn chưa đặt vé nào hoặc không tìm thấy vé phù hợp
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredTickets.map((ticket) => {
              const statusConfig = getStatusConfig(ticket.status);

              return (
                <div
                  key={ticket._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
                >
                  {/* Ticket Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Ticket className="w-6 h-6" />
                          <span className="font-bold text-lg">
                            {ticket.ticketCode}
                          </span>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full border ${statusConfig.color.replace(
                            "bg-",
                            "bg-white bg-opacity-20 border-white border-opacity-30 text-white"
                          )}`}
                        >
                          <div className="flex items-center space-x-1">
                            {statusConfig.icon}
                            <span className="text-sm font-medium">
                              {ticket.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-2xl font-bold">
                        {ticket.ticketPrice?.toLocaleString()} VNĐ
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white bg-opacity-5 rounded-full"></div>
                  </div>

                  {/* Trip Info */}
                  <div className="p-6">
                    {/* Route */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900 text-lg mb-1">
                          {ticket.tripId?.pickupProvince}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ticket.tripId?.departureTime}
                        </div>
                      </div>

                      <div className="flex-1 flex items-center justify-center mx-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                          <Car className="w-5 h-5 text-blue-500" />
                          <div className="flex-1 h-1 bg-gradient-to-r from-purple-500 to-red-500 rounded"></div>
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="font-semibold text-gray-900 text-lg mb-1">
                          {ticket.tripId?.dropOffProvince}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ticket.tripId?.arrivalTime}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-medium text-gray-900">
                            Ngày khởi hành
                          </div>
                          <div className="text-sm text-gray-600">
                            {ticket.tripId?.departureDate
                              ? formatDate(ticket.tripId.departureDate)
                              : "Chưa cập nhật"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-green-500" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            Điểm đón - Điểm trả
                          </div>
                          <div className="text-sm text-gray-600">
                            {ticket.tripId?.pickupPoint} →{" "}
                            {ticket.tripId?.dropOffPoint}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Car className="w-5 h-5 text-purple-500" />
                        <div>
                          <div className="font-medium text-gray-900">
                            Thông tin xe
                          </div>
                          <div className="text-sm text-gray-600">
                            {ticket.carId?.nameCar} -{" "}
                            {ticket.carId?.licensePlate}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Date and Cancel Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        Đặt vé lúc: {formatDateTime(ticket.createdAt)}
                      </div>
                      {ticket.status === "confirmed" ||
                      ticket.status === "Đã đặt" ? (
                        <button
                          onClick={() => handleCancelTicket(ticket._id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                          disabled={cancelMutation.isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Hủy vé</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <Pagination totalPages={totalPages} handlePageClick={handlePageClick} />
      </div>
    </div>
  );
};

export default UserTickets;
