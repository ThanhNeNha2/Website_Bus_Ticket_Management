import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../Util/axios";

import Pagination from "../Pagination";
import { format } from "date-fns";
import UpdateInfoTicket from "./Ticket/UpdateInfoTicket";

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
    <div className="flex-1 p-6 bg-gray-50">
      {error && (
        <p className="text-red-500 text-center mb-4">{error.message}</p>
      )}

      <div className="overflow-x-auto mb-7">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Thông tin xe</th>
              <th className="py-2 px-4 border-b text-left">Chuyến đi</th>
              <th className="py-2 px-4 border-b text-left">Mã Vé</th>
              <th className="py-2 px-4 border-b text-left">Điểm đón</th>
              <th className="py-2 px-4 border-b text-left">Ngày đi / Giờ đi</th>
              <th className="py-2 px-4 border-b text-left">Giá vé</th>
              <th className="py-2 px-4 border-b text-left">Trạng thái</th>
              <th className="py-2 px-4 border-b text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="py-4 px-4 text-center text-blue-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-4 px-4 text-center text-red-500">
                  Dữ liệu chưa được cập nhật
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="py-2 px-4 border-b font-semibold">
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
                    {ticket.ticketCode
                      ? `${ticket.ticketCode}`
                      : "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {ticket.tripId?.pickupPoint
                      ? `${ticket.tripId.pickupPoint}`
                      : "Chưa cập nhật"}
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
                    <button
                      onClick={() => openEditModal(ticket)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
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
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      disabled={deleteTicketMutation.isLoading}
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
            <h3 className="text-xl font-bold mb-4">Xóa vé</h3>
            <span className="text-base font-normal">
              Bạn chắc chắn muốn xóa vé :{" "}
              <p className="font-semibold">{infoDelete.InfoLicensePlate}</p>
            </span>
            <div className="flex justify-center gap-4 mt-5">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
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
