import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../Util/axios";
import Pagination from "./Pagination";
import {
  Tag,
  Clock,
  Calendar,
  Users,
  AlertCircle,
  Check,
  Percent,
  DollarSign,
} from "lucide-react";

// Hàm hỗ trợ format ngày thay cho date-fns
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const fetchPromotions = async ({ page = 1, limit = 6 }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");
  const res = await api.get(`/promotions?page=${page}&limit=${limit}`);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể tải danh sách mã giảm giá.");
  return {
    promotions: res.data.data.promotions || [],
    totalItems: res.data.data.total || 1,
  };
};

const PromotionCard = ({ promotion }) => {
  // Xác định trạng thái để hiển thị biểu tượng và màu sắc phù hợp
  const isActive = promotion.status === "Active";
  const currentDate = new Date();
  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);

  // Kiểm tra xem khuyến mãi còn hạn không
  // Khuyến mãi còn hạn khi: có trạng thái Active VÀ thời gian hiện tại nằm giữa startDate và endDate
  const isValidDate = currentDate >= startDate && currentDate <= endDate;
  const isCurrentlyActive = isActive && isValidDate;

  // Xác định màu nền của thẻ dựa trên trạng thái

  // Xác định icon loại giảm giá
  const DiscountIcon =
    promotion.discountType === "Percentage" ? Percent : DollarSign;

  return (
    <div
      className={`${"bg-white border-l-4 border-l-green-500"} rounded-lg shadow-md p-5 transition-all hover:shadow-lg`}
    >
      {/* Phần header của thẻ */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{promotion.code}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {promotion.description || "Không có mô tả"}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${"bg-green-100 text-green-800"}`}
        >
          Đang hoạt động
        </div>
      </div>

      {/* Phần thông tin khuyến mãi */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center text-sm text-gray-700">
          <DiscountIcon size={16} className="mr-2 text-blue-500" />
          <span>
            {promotion.discountValue}{" "}
            {promotion.discountType === "Percentage" ? "%" : "VNĐ"}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <Users size={16} className="mr-2 text-blue-500" />
          <span>
            {promotion.usedCount || 0}/{promotion.maxUses || "∞"}
          </span>
        </div>
      </div>

      {/* Phần thời gian */}
      <div className="border-t border-gray-200 pt-3">
        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>Bắt đầu: {formatDate(promotion.startDate)}</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>Kết thúc: {formatDate(promotion.endDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoPromotion = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Hiển thị 6 thẻ mỗi trang

  const {
    data: { promotions = [], totalItems = 1 } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["promotions", currentPage],
    queryFn: () => fetchPromotions({ page: currentPage, limit: itemsPerPage }),
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setCurrentPage(newPage);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-800">
            Mã khuyến mãi
          </h2>
          <p className="text-gray-600 mt-1">
            Quản lý và xem tất cả các mã giảm giá của bạn
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-2" />
            <p>{error.message}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : promotions.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Tag size={32} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Chưa có mã khuyến mãi
          </h3>
          <p className="text-gray-600 mb-6">
            Bạn chưa tạo mã khuyến mãi nào. Hãy thêm mã mới để bắt đầu.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition">
            Thêm mã khuyến mãi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {promotions.map((promotion) => (
            <PromotionCard key={promotion._id} promotion={promotion} />
          ))}
        </div>
      )}

      {promotions.length > 2 && (
        <Pagination totalPages={totalPages} handlePageClick={handlePageClick} />
      )}
    </div>
  );
};

export default InfoPromotion;
