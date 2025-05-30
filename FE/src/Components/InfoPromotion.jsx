import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Copy,
  Tag,
  Calendar,
  Percent,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { api } from "../Util/axios";

const fetchPromotions = async ({ page = 1, limit = 6 }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");

  const res = await api.get(`/promotions?page=${page}&limit=${limit}`);
  if (res.data.errCode !== 0) {
    throw new Error(res.data.message || "Không thể tải danh sách mã giảm giá.");
  }

  return {
    promotions: res.data.data.promotions,
    totalItems: res.data.data.totalItems,
  };
};
// Mock API function - replace with your actual API

// Promotion Card Component
const PromotionCard = ({ promotion }) => {
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDiscount = (type, value) => {
    if (type === "Percentage") {
      return `${value}%`;
    } else {
      return `${value.toLocaleString("vi-VN")}đ`;
    }
  };

  const isExpired = () => {
    const endDate = new Date(promotion.endDate);
    const now = new Date();
    return endDate < now || promotion.status !== "Kích hoạt";
  };

  const isAlmostFull = () => {
    return promotion.usedCount / promotion.maxUses > 0.8;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promotion.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const expired = isExpired();
  const almostFull = isAlmostFull();

  return (
    <div
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 ${
        expired
          ? "border-red-400 opacity-75"
          : almostFull
          ? "border-yellow-400"
          : "border-green-400"
      }`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                expired ? "bg-red-100" : "bg-green-100"
              }`}
            >
              <Tag
                className={`w-5 h-5 ${
                  expired ? "text-red-600" : "text-green-600"
                }`}
              />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                {promotion.description}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {expired ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                    <XCircle className="w-3 h-3" />
                    Hết hạn
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Đang hoạt động
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Discount Badge */}
          <div
            className={`px-4 py-2 rounded-full text-center font-bold text-white ${
              expired
                ? "bg-gray-400"
                : "bg-gradient-to-r from-orange-400 to-red-500"
            }`}
          >
            <div className="flex items-center gap-1">
              <Percent className="w-4 h-4" />
              <span className="text-xl">
                {formatDiscount(
                  promotion.discountType,
                  promotion.discountValue
                )}
              </span>
            </div>
            <div className="text-xs opacity-90">GIẢM GIÁ</div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="mb-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                Mã giảm giá
              </span>
              <div className="font-mono font-bold text-lg text-gray-800">
                {promotion.code}
              </div>
            </div>
            <button
              onClick={copyToClipboard}
              disabled={expired}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                expired
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : copied
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white hover:scale-105"
              }`}
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              Từ {formatDate(promotion.startDate)} đến{" "}
              {formatDate(promotion.endDate)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>
              Đã sử dụng: {promotion.usedCount}/{promotion.maxUses}
            </span>
          </div>

          {/* Usage Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                expired
                  ? "bg-gray-400"
                  : almostFull
                  ? "bg-yellow-400"
                  : "bg-green-400"
              }`}
              style={{
                width: `${Math.min(
                  (promotion.usedCount / promotion.maxUses) * 100,
                  100
                )}%`,
              }}
            />
          </div>

          {almostFull && !expired && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700 font-medium">
                Sắp hết lượt sử dụng!
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            disabled={expired}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              expired
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:scale-105 shadow-lg hover:shadow-xl"
            }`}
          >
            {expired ? "Mã đã hết hạn" : "Áp dụng mã giảm giá"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple Pagination Component
const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Trước
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sau
      </button>
    </div>
  );
};

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

  const { promotions = [], totalItems = 0 } = data;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Đang tải mã giảm giá...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <strong>Lỗi:</strong> {error.message}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎫 Mã Giảm Giá Đặc Biệt
          </h1>
          <p className="text-lg text-gray-600">
            Khám phá các ưu đãi hấp dẫn và tiết kiệm chi phí cho chuyến đi của
            bạn!
          </p>
        </div>

        {/* Promotions Grid */}
        {promotions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {promotions.map((promotion) => (
                <PromotionCard key={promotion._id} promotion={promotion} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Không có mã giảm giá
              </h3>
              <p className="text-gray-500">
                Hiện tại chưa có mã giảm giá nào. Vui lòng quay lại sau!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPromotion;
