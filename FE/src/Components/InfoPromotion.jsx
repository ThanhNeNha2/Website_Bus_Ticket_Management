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
  Percent,
  DollarSign,
} from "lucide-react";
import { parseISO, startOfDay, endOfDay } from "date-fns";
// Utils
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};
const isPromotionActive = (promotion) => {
  const now = new Date();
  const start = startOfDay(parseISO(promotion.startDate));
  const end = endOfDay(parseISO(promotion.endDate));

  console.log("Checking promotion:", promotion.code);
  console.log("Current time:", now);
  console.log("Start time:", start);
  console.log("End time:", end);
  console.log("Status:", promotion.status);

  const isWithinTimeRange = now >= start && now <= end;
  const isStatusActive = promotion.status === "Active";

  console.log("Within time range:", isWithinTimeRange);
  console.log("Status active:", isStatusActive);
  console.log("Final result:", isStatusActive && isWithinTimeRange);

  return isStatusActive && isWithinTimeRange;
};

// API
const fetchPromotions = async ({ page = 1, limit = 6 }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");

  const res = await api.get(`/promotions?page=${page}&limit=${limit}`);
  if (res.data.errCode !== 0) {
    throw new Error(res.data.message || "Không thể tải danh sách mã giảm giá.");
  }

  return {
    promotions: res.data.data.promotions || [],
    totalItems: res.data.data.total || 1,
  };
};

// Components
const PromotionStatus = ({ isActive }) => {
  const statusClass = isActive
    ? "bg-red-100 text-red-800"
    : "bg-green-100 text-green-800";
  const statusText = isActive ? "Hết hạn" : "Đang hoạt động";

  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}
    >
      {statusText}
    </div>
  );
};

const PromotionInfo = ({ promotion }) => {
  const DiscountIcon =
    promotion.discountType === "Percentage" ? Percent : DollarSign;
  const discountText = promotion.discountType === "Percentage" ? "%" : "VNĐ";

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="flex items-center text-sm text-gray-700">
        <DiscountIcon size={16} className="mr-2 text-blue-500" />
        <span>
          {promotion.discountValue} {discountText}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-700">
        <Users size={16} className="mr-2 text-blue-500" />
        <span>
          {promotion.usedCount || 0}/{promotion.maxUses || "∞"}
        </span>
      </div>
    </div>
  );
};

const PromotionDates = ({ startDate, endDate }) => (
  <div className="border-t border-gray-200 pt-3">
    <div className="flex justify-between text-xs text-gray-500">
      <div className="flex items-center">
        <Calendar size={14} className="mr-1" />
        <span>Bắt đầu: {formatDate(startDate)}</span>
      </div>
      <div className="flex items-center">
        <Clock size={14} className="mr-1" />
        <span>Kết thúc: {formatDate(endDate)}</span>
      </div>
    </div>
  </div>
);

const PromotionCard = ({ promotion }) => {
  const isActive = isPromotionActive(promotion);
  const borderColor = isActive ? "border-l-green-500" : "border-l-red-500";

  return (
    <div
      className={`bg-white border-l-4 ${borderColor} rounded-lg shadow-md p-5 transition-all hover:shadow-lg`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{promotion.code}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {promotion.description || "Không có mô tả"}
          </p>
        </div>
        <PromotionStatus isActive={isActive} />
      </div>

      {/* Info */}
      <PromotionInfo promotion={promotion} />

      {/* Dates */}
      <PromotionDates
        startDate={promotion.startDate}
        endDate={promotion.endDate}
      />
    </div>
  );
};

const EmptyState = () => (
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
);

const ErrorMessage = ({ error }) => (
  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
    <div className="flex items-center">
      <AlertCircle size={20} className="mr-2" />
      <p>{error.message}</p>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const PageHeader = () => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h2 className="text-3xl font-semibold text-gray-800">Mã khuyến mãi</h2>
      <p className="text-gray-600 mt-1">
        Quản lý và xem tất cả các mã giảm giá của bạn
      </p>
    </div>
  </div>
);

// Main Component
const InfoPromotion = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const {
    data = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["promotions", currentPage],
    queryFn: () => fetchPromotions({ page: currentPage, limit: itemsPerPage }),
  });

  const { promotions = [], totalItems = 1 } = data;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <PageHeader />

      {error && <ErrorMessage error={error} />}

      {isLoading ? (
        <LoadingSpinner />
      ) : promotions.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {promotions.map((promotion) => (
              <PromotionCard key={promotion._id} promotion={promotion} />
            ))}
          </div>

          {promotions.length > 2 && (
            <Pagination
              totalPages={totalPages}
              handlePageClick={handlePageClick}
            />
          )}
        </>
      )}
    </div>
  );
};

export default InfoPromotion;
