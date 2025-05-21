import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../Util/axios";

import { format } from "date-fns";
import UpdateInfoTicket from "./UpdateInfoTicket";
import Pagination from "../../Components/Pagination/Pagination";

const fetchTickets = async ({ page = 1, limit = 5 }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");
  const res = await api.get(`/tickets?page=${page}&limit=${limit}`);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể tải danh sách vé.");
  return {
    tickets: res.data.data.tickets || [],
    totalItems: res.data.data.total || 1,
  };
};

const editTicket = async ({ ticketId, updatedTicket }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");
  const res = await api.put(`/tickets/${ticketId}`, updatedTicket);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể sửa vé.");
  return res.data.data;
};

const deleteTicket = async (ticketId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");
  const res = await api.delete(`/tickets/${ticketId}`);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể xóa vé.");
  return ticketId;
};

const InfoTicket = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState({ id: "" });
  const [infoDelete, setInfoDelete] = useState({
    InfoLicensePlate: "",
    id: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [formData, setFormData] = useState({
    ticketPrice: "",
    status: "",
    userId: {
      username: "",
      email: "",
    },
    tripId: {
      pickupProvince: "",
      dropOffProvince: "",
      departureTime: "",
      arrivalTime: "",
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: { tickets = [], totalItems = 1 } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tickets", currentPage],
    queryFn: () => fetchTickets({ page: currentPage, limit: itemsPerPage }),
  });

  const editTicketMutation = useMutation({
    mutationFn: editTicket,
    onSuccess: (updatedTicket, variables) => {
      queryClient.setQueryData(["tickets", currentPage], (old) => ({
        ...old,
        tickets: old.tickets.map((ticket) =>
          ticket._id === variables.ticketId
            ? { ...ticket, ...variables.updatedTicket }
            : ticket
        ),
      }));
      queryClient.invalidateQueries(["tickets"]);
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

  const deleteTicketMutation = useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
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

  const handleEditTicket = (e) => {
    e.preventDefault();
    const updatedTicket = {
      ticketPrice: formData.ticketPrice,
      status: formData.status,
    };
    console.log("check thong tin updatedTicket", updatedTicket);

    console.log("check thong tin update ", updatedTicket);
    console.log("check thong tin update ", currentTicket);

    editTicketMutation.mutate({ ticketId: currentTicket, updatedTicket });
  };

  const handleDeleteTicket = () => {
    deleteTicketMutation.mutate(infoDelete.id);
  };
  const openEditModal = (ticket) => {
    setCurrentTicket(ticket._id);

    setFormData({
      ticketPrice: ticket.ticketPrice || "",
      status: ticket.status || "",
      userId: {
        username: ticket.userId?.username || "",
        email: ticket.userId?.email || "",
      },
      tripId: {
        pickupProvince: ticket.tripId?.pickupProvince || "",
        dropOffProvince: ticket.tripId?.dropOffProvince || "",
        departureTime: ticket.tripId?.departureTime || "",
        arrivalTime: ticket.tripId?.arrivalTime || "",
      },
    });

    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      ticketPrice: "",
      status: "",
      userId: {
        username: "",
        email: "",
      },
      tripId: {
        pickupPoint: "",
        dropOffPoint: "",
        departureTime: "",
        arrivalTime: "",
      },
    });
    setCurrentTicket(null);
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
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800 mb-5">
        Quản lý vé xe{" "}
      </h2>

      {error && (
        <div className="mb-4 text-center text-red-600 font-medium">
          {error.message}
        </div>
      )}

      <div className="overflow-x-auto shadow rounded-lg border border-gray-200 bg-white mb-10">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="py-3 px-4 text-left border-b">Thông tin xe</th>
              <th className="py-3 px-4 text-left border-b">Chuyến đi</th>
              <th className="py-3 px-4 text-left border-b">Mã Vé</th>
              <th className="py-3 px-4 text-left border-b">Điểm đón</th>
              <th className="py-3 px-4 text-left border-b">Ngày đi / Giờ đi</th>
              <th className="py-3 px-4 text-left border-b">Giá vé</th>
              <th className="py-3 px-4 text-left border-b">Trạng thái</th>
              <th className="py-3 px-4 text-left border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="py-6 text-center text-blue-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-6 text-center text-red-500">
                  Dữ liệu chưa được cập nhật
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-4 border-b font-medium">
                    {ticket.carId
                      ? `${ticket.carId.nameCar} - ${ticket.carId.licensePlate}`
                      : "Xe chưa được gán"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {ticket.tripId?.pickupProvince &&
                    ticket.tripId?.dropOffProvince
                      ? `${ticket.tripId.pickupProvince} - ${ticket.tripId.dropOffProvince}`
                      : "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {ticket.ticketCode || "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {ticket.tripId?.pickupPoint || "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {ticket.tripId?.departureDate &&
                    ticket.tripId?.departureTime ? (
                      <>
                        {format(
                          new Date(ticket.tripId.departureDate),
                          "dd/MM/yyyy"
                        )}{" "}
                        - {ticket.tripId.departureTime}
                      </>
                    ) : (
                      "Chưa cập nhật"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {ticket.ticketPrice
                      ? `${ticket.ticketPrice} VNĐ`
                      : "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {ticket.status || "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(ticket)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setInfoDelete({
                            InfoLicensePlate:
                              ticket.pickupProvince && ticket.dropOffProvince
                                ? `${ticket.pickupProvince} - ${ticket.dropOffProvince}`
                                : "Chưa cập nhật",
                            id: ticket._id,
                          });
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        disabled={deleteTicketMutation.isLoading}
                      >
                        Xóa
                      </button>
                    </div>
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
            <h3 className="text-xl font-bold text-gray-800 mb-4">Xóa vé</h3>
            <p className="text-base text-gray-700 mb-3">
              Bạn chắc chắn muốn xóa vé:
            </p>
            <p className="font-semibold text-lg text-red-600">
              {infoDelete.InfoLicensePlate}
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteTicket}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <UpdateInfoTicket
          formData={formData}
          handleEditTicket={handleEditTicket}
          handleInputChange={handleInputChange}
          setIsEditModalOpen={setIsEditModalOpen}
          resetForm={resetForm}
          setFormData={setFormData}
          loading={editTicketMutation.isLoading}
          error={
            editTicketMutation.isError ? editTicketMutation.error.message : null
          }
        />
      )}

      <Pagination totalPages={totalPages} handlePageClick={handlePageClick} />
    </div>
  );
};

export default InfoTicket;
