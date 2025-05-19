import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import UpdateInfoTrip from "./UpdateInfoTrip";

import { format } from "date-fns";
import AddInfoTrip from "./AddInfoTrip";
import Pagination from "../../Components/Pagination/Pagination";
import { api } from "../../Util/axios";

const fetchTrips = async ({ page = 1, limit = 5 }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");
  const res = await api.get(`/trips?page=${page}&limit=${limit}`);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể tải danh sách chuyến xe.");
  return {
    trips: res.data.data.trips || [],
    totalItems: res.data.data.total || 1,
  };
};

const addTrip = async (newTrip) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");
  const res = await api.post("/trips", newTrip);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể thêm chuyến xe.");
  return res.data.data;
};

const editTrip = async ({ tripId, updatedTrip }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");
  const res = await api.put(`/trips/${tripId}`, updatedTrip);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể sửa chuyến xe.");
  return res.data.data;
};

const deleteTrip = async (tripId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Không có token. Vui lòng đăng nhập lại.");
  const res = await api.delete(`/trips/${tripId}`);
  if (res.data.errCode !== 0)
    throw new Error(res.data.message || "Không thể xóa chuyến xe.");
  return tripId;
};

const TripManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [infoDelete, setInfoDelete] = useState({
    InfoLicensePlate: "",
    id: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [formData, setFormData] = useState({
    pickupPoint: "",
    dropOffPoint: "",
    pickupProvince: "",
    dropOffProvince: "",
    ticketPrice: "",
    departureTime: "",
    arrivalTime: "",
    departureDate: "",
    arrivalDate: "",
    status: "",
    totalSeats: "",
    seatsAvailable: "",
    carId: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: { trips = [], totalItems = 1 } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trips", currentPage],
    queryFn: () => fetchTrips({ page: currentPage, limit: itemsPerPage }),
  });

  const addTripMutation = useMutation({
    mutationFn: addTrip,
    onSuccess: () => {
      queryClient.invalidateQueries(["trips"]);
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

  const editTripMutation = useMutation({
    mutationFn: editTrip,
    onSuccess: (updatedTrip, variables) => {
      queryClient.setQueryData(["trips", currentPage], (old) => ({
        ...old,
        trips: old.trips.map((trip) =>
          trip._id === variables.tripId
            ? { ...trip, ...variables.updatedTrip }
            : trip
        ),
      }));
      queryClient.invalidateQueries(["trips"]);
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

  const deleteTripMutation = useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries(["trips"]);
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

  const handleAddTrip = (e) => {
    e.preventDefault();
    const newTrip = {
      pickupPoint: formData.pickupPoint,
      dropOffPoint: formData.dropOffPoint,
      pickupProvince: formData.pickupProvince,
      dropOffProvince: formData.dropOffProvince,
      departureDate: formData.departureDate,
      departureTime: formData.departureTime,
      arrivalDate: formData.arrivalDate,
      arrivalTime: formData.arrivalTime,
      ticketPrice: parseFloat(formData.ticketPrice),
      status: formData.status,
      totalSeats: parseInt(formData.totalSeats),
      seatsAvailable: parseInt(formData.seatsAvailable || formData.totalSeats),
      carId: formData.carId,
    };
    addTripMutation.mutate(newTrip);
  };

  const handleEditTrip = (e) => {
    e.preventDefault();
    const updatedTrip = {
      pickupPoint: formData.pickupPoint,
      dropOffPoint: formData.dropOffPoint,
      pickupProvince: formData.pickupProvince,
      dropOffProvince: formData.dropOffProvince,
      departureDate: formData.departureDate,
      departureTime: formData.departureTime,
      arrivalDate: formData.arrivalDate,
      arrivalTime: formData.arrivalTime,
      ticketPrice: parseFloat(formData.ticketPrice),
      status: formData.status,
      totalSeats: parseInt(formData.totalSeats),
      seatsAvailable: parseInt(formData.seatsAvailable),
      carId: formData.carId,
    };
    console.log("check thong tin updatedTrip", updatedTrip);

    editTripMutation.mutate({ tripId: currentTrip._id, updatedTrip });
  };

  const handleDeleteTrip = () => {
    deleteTripMutation.mutate(infoDelete.id);
  };

  const openEditModal = (trip) => {
    setCurrentTrip(trip);
    setFormData({
      pickupPoint: trip.pickupPoint || "",
      dropOffPoint: trip.dropOffPoint || "",
      pickupProvince: trip.pickupProvince || "",
      dropOffProvince: trip.dropOffProvince || "",
      ticketPrice: trip.ticketPrice?.toString() || "",
      departureTime: trip.departureTime || "",
      arrivalTime: trip.arrivalTime || "",
      departureDate: trip.departureDate || "",
      arrivalDate: trip.arrivalDate || "",
      status: trip.status || "",
      totalSeats: trip.totalSeats?.toString() || "",
      seatsAvailable: trip.seatsAvailable?.toString() || "",
      carId: trip.carId?._id || "",
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      pickupPoint: "",
      dropOffPoint: "",
      pickupProvince: "",
      dropOffProvince: "",
      ticketPrice: "",
      departureTime: "",
      arrivalTime: "",
      departureDate: "",
      arrivalDate: "",
      status: "",
      totalSeats: "",
      seatsAvailable: "",
      carId: "",
    });
    setCurrentTrip(null);
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
        <h2 className="text-2xl font-bold">Quản lý chuyến xe</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm chuyến xe
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-center mb-4">{error.message}</p>
      )}

      <div className="overflow-x-auto mb-7">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Thông tin xe</th>
              <th className="py-2 px-4 border-b text-left">Điểm đón khách</th>
              <th className="py-2 px-4 border-b text-left">Lộ trình</th>
              <th className="py-2 px-4 border-b text-left">Giá vé</th>
              <th className="py-2 px-4 border-b text-left">
                Tổng ghế/Số ghế trống
              </th>
              <th className="py-2 px-4 border-b text-left">Ngày đi - Giờ đi</th>
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
            ) : trips.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-4 px-4 text-center text-red-500">
                  Dữ liệu chưa được cập nhật
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr key={trip._id}>
                  <td className="py-2 px-4 border-b font-semibold">
                    {trip.carId
                      ? `${trip.carId.nameCar} - ${trip.carId.licensePlate}`
                      : "Xe chưa được gán"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {trip.pickupPoint || "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {trip.pickupProvince && trip.dropOffProvince
                      ? `${trip.pickupProvince} - ${trip.dropOffProvince}`
                      : "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {trip.ticketPrice
                      ? `${trip.ticketPrice} VNĐ`
                      : "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {trip.totalSeats && trip.seatsAvailable
                      ? `${trip.totalSeats}/${trip.seatsAvailable}`
                      : "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {trip.departureDate && trip.departureTime ? (
                      <>
                        {format(new Date(trip.departureDate), "dd/MM/yyyy")} -{" "}
                        {trip.departureTime}
                      </>
                    ) : (
                      "Chưa cập nhật"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {trip.status || "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => openEditModal(trip)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setInfoDelete({
                          InfoLicensePlate:
                            trip.pickupProvince && trip.dropOffProvince
                              ? `${trip.pickupProvince} - ${trip.dropOffProvince}`
                              : "Chưa cập nhật",
                          id: trip._id,
                        });
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      disabled={deleteTripMutation.isLoading}
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
            <h3 className="text-xl font-bold mb-4">Xóa chuyến xe</h3>
            <span className="text-base font-normal">
              Bạn chắc chắn muốn xóa chuyến xe :{" "}
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
                onClick={handleDeleteTrip}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <AddInfoTrip
          handleAddTrip={handleAddTrip}
          formData={formData}
          handleInputChange={handleInputChange}
          addTripMutation={addTripMutation}
          setIsAddModalOpen={setIsAddModalOpen}
          resetForm={resetForm}
        />
      )}

      {isEditModalOpen && (
        <UpdateInfoTrip
          formData={formData}
          handleEditTrip={handleEditTrip}
          handleInputChange={handleInputChange}
          setIsEditModalOpen={setIsEditModalOpen}
          resetForm={resetForm}
          setFormData={setFormData}
          loading={editTripMutation.isLoading}
          error={
            editTripMutation.isError ? editTripMutation.error.message : null
          }
        />
      )}

      <Pagination totalPages={totalPages} handlePageClick={handlePageClick} />
    </div>
  );
};

export default TripManagement;
