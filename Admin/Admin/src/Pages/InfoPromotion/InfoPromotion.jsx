import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../Util/axios";
import UpdateInfoPromotion from "./UpdateInfoPromotion";

import { format } from "date-fns";
import AddInfoPromotion from "./AddInfoPromotion";
import Pagination from "../../Components/Pagination/Pagination";

const fetchPromotions = async ({ page = 1, limit = 7 }) => {
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

const addPromotion = async (newPromotion) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");
  const res = await api.post("/promotions", newPromotion);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể thêm mã giảm giá.");
  return res.data.data;
};

const editPromotion = async ({ promotionId, updatedPromotion }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");
  const res = await api.put(`/promotions/${promotionId}`, updatedPromotion);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể sửa mã giảm giá.");
  return res.data.data;
};

const deletePromotion = async (promotionId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");
  const res = await api.delete(`/promotions/${promotionId}`);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể xóa mã giảm giá.");
  return promotionId;
};

const InfoPromotion = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [infoDelete, setInfoDelete] = useState({
    code: "",
    id: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "",
    discountValue: "",
    startDate: "",
    endDate: "",
    applicableTrips: [],
    maxUses: "",
    status: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: { promotions = [], totalItems = 1 } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["promotions", currentPage],
    queryFn: () => fetchPromotions({ page: currentPage, limit: itemsPerPage }),
  });

  const addPromotionMutation = useMutation({
    mutationFn: addPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries(["promotions"]);
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      if (err.message.includes("Không có token")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login");
      }
    },
  });

  const editPromotionMutation = useMutation({
    mutationFn: editPromotion,
    onSuccess: (updatedPromotion, variables) => {
      queryClient.setQueryData(["promotions", currentPage], (old) => ({
        ...old,
        promotions: old.promotions.map((promotion) =>
          promotion._id === variables.promotionId
            ? { ...promotion, ...variables.updatedPromotion }
            : promotion
        ),
      }));
      queryClient.invalidateQueries(["promotions"]);
      setIsEditModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      if (err.message.includes("Không có token")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login");
      }
    },
  });

  const deletePromotionMutation = useMutation({
    mutationFn: deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries(["promotions"]);
      setIsDeleteModalOpen(false);
    },
    onError: (err) => {
      if (err.message.includes("Không có token")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login");
      }
    },
  });

  const handleAddPromotion = (e) => {
    e.preventDefault();
    const newPromotion = {
      code: formData.code,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      startDate: formData.startDate,
      endDate: formData.endDate,
      applicableTrips: formData.applicableTrips,
      maxUses: parseInt(formData.maxUses),
      status: formData.status,
    };

    addPromotionMutation.mutate(newPromotion);
  };

  const handleEditPromotion = (e) => {
    e.preventDefault();
    const updatedPromotion = {
      code: formData.code,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      startDate: formData.startDate,
      endDate: formData.endDate,
      applicableTrips: formData.applicableTrips.map((trip) => trip._id), // chỉ lấy _id
      maxUses: parseInt(formData.maxUses),
      status: formData.status,
    };

    editPromotionMutation.mutate({
      promotionId: currentPromotion._id,
      updatedPromotion,
    });
  };

  const handleDeletePromotion = () => {
    deletePromotionMutation.mutate(infoDelete.id);
  };

  const openEditModal = (promotion) => {
    setCurrentPromotion(promotion);
    console.log("check thong tin truyen vao update  ", promotion);

    setFormData({
      code: promotion.code || "",
      description: promotion.description || "",
      discountType: promotion.discountType || "",
      discountValue: promotion.discountValue?.toString() || "",
      startDate: promotion.startDate
        ? format(new Date(promotion.startDate), "yyyy-MM-dd")
        : "",
      endDate: promotion.endDate
        ? format(new Date(promotion.endDate), "yyyy-MM-dd")
        : "",
      applicableTrips: promotion.applicableTrips || [],
      maxUses: promotion.maxUses?.toString() || "",
      status: promotion.status || "",
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "",
      discountValue: "",
      startDate: "",
      endDate: "",
      applicableTrips: [],
      maxUses: "",
      status: "",
    });
    setCurrentPromotion(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setCurrentPage(newPage);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản lý mã giảm giá</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm mã giảm giá
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-center mb-4">{error.message}</p>
      )}

      <div className="overflow-x-auto mb-7">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Mã</th>
              <th className="py-2 px-4 border-b text-left">Mô tả</th>
              <th className="py-2 px-4 border-b text-left">Loại giảm giá</th>
              <th className="py-2 px-4 border-b text-left">Giá trị giảm</th>
              <th className="py-2 px-4 border-b text-left">Ngày bắt đầu</th>
              <th className="py-2 px-4 border-b text-left">Ngày hết hạn</th>
              <th className="py-2 px-4 border-b text-left">Đã dùng/Tổng</th>
              <th className="py-2 px-4 border-b text-left">Trạng thái</th>
              <th className="py-2 px-4 border-b text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="9" className="py-4 px-4 text-center text-blue-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : promotions.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-4 px-4 text-center text-red-500">
                  Dữ liệu chưa được cập nhật
                </td>
              </tr>
            ) : (
              promotions.map((promotion) => (
                <tr key={promotion._id}>
                  <td className="py-2 px-4 border-b font-semibold">
                    {promotion.code || "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {promotion.description || "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {promotion.discountType || "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {promotion.discountValue
                      ? `${promotion.discountValue}${
                          promotion.discountType === "Percentage" ? "%" : " VNĐ"
                        }`
                      : "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {promotion.startDate
                      ? format(new Date(promotion.startDate), "dd/MM/yyyy")
                      : "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {promotion.endDate
                      ? format(new Date(promotion.endDate), "dd/MM/yyyy")
                      : "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {promotion.usedCount !== null && promotion.maxUses !== null
                      ? `${promotion.usedCount}/${promotion.maxUses}`
                      : "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {promotion.status || "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => openEditModal(promotion)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setInfoDelete({
                          code: promotion.code || "Chưa cập nhật",
                          id: promotion._id,
                        });
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      disabled={deletePromotionMutation.isLoading}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-center">
            <h3 className="text-xl font-bold mb-4">Xóa mã giảm giá</h3>
            <span className="text-base font-normal">
              Bạn chắc chắn muốn xóa mã giảm giá :{" "}
              <p className="font-semibold">{infoDelete.code}</p>
            </span>
            <div className="flex justify-center gap-4 mt-5">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleDeletePromotion}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <AddInfoPromotion
          handleAddPromotion={handleAddPromotion}
          formData={formData}
          handleInputChange={handleInputChange}
          addPromotionMutation={addPromotionMutation}
          setIsAddModalOpen={setIsAddModalOpen}
          resetForm={resetForm}
        />
      )}

      {isEditModalOpen && (
        <UpdateInfoPromotion
          handleEditPromotion={handleEditPromotion}
          formData={formData}
          handleInputChange={handleInputChange}
          updatePromotionMutation={editPromotionMutation}
          setIsEditModalOpen={setIsEditModalOpen}
          resetForm={resetForm}
        />
      )}

      <Pagination totalPages={totalPages} handlePageClick={handlePageClick} />
    </div>
  );
};

export default InfoPromotion;
