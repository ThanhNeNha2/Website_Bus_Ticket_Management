import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../Util/axios";
import UpdateInfoCar from "./Car/UpdateInfoCar";
import upload from "../../Util/upload";
import AddInfoCar from "./Car/AddInfoCar";
import Pagination from "../Pagination";
import { format, parseISO } from "date-fns";
import AddInfoTrip from "./Trip/AddInfoTrip";
import UpdateInfoTrip from "./Trip/UpdateInfoTrip";
// Hàm gọi API để lấy danh sách xe
const fetchTrips = async ({ page = 1, limit = 5 }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không có token. Vui lòng đăng nhập lại.");
  }
  const res = await api.get(`/trips?page=${page}&limit=${limit}`);
  if (res.data.errCode !== 0) {
    throw new Error(res.data.message || "Không thể tải danh sách chuyến xe.");
  }
  return {
    trips: res.data.data.trips || [],
    totalItems: res.data.data.total || 1,
  };
};

// Hàm gọi API để thêm xe
const addTrip = async (newTrip) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không có token. Vui lòng đăng nhập lại.");
  }
  const res = await api.post("/trips", newTrip);
  if (res.data.errCode !== 0) {
    throw new Error(res.data.message || "Không thể thêm xe.");
  }
  return res.data.data;
};

// Hàm gọi API để sửa xe
const editCar = async ({ carId, updatedCar }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không có token. Vui lòng đăng nhập lại.");
  }
  const res = await api.put(`/cars/${carId}`, updatedCar);
  if (res.data.errCode !== 0) {
    throw new Error(res.data.message || "Không thể sửa xe.");
  }
  return res.data.data;
};

// Hàm gọi API để xóa xe
const deleteCar = async (carId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không có token. Vui lòng đăng nhập lại.");
  }
  const res = await api.delete(`/cars/${carId}`);
  if (res.data.errCode !== 0) {
    throw new Error(res.data.message || "Không thể xóa xe.");
  }
  return carId;
};

const InfoTrip = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [currentCar, setCurrentCar] = useState(null);
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
    queryKey: ["cars", currentPage],
    queryFn: () => fetchTrips({ page: currentPage, limit: itemsPerPage }),
  });

  const addTripMutation = useMutation({
    mutationFn: addTrip,
    onSuccess: () => {
      queryClient.invalidateQueries(["cars"]);
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

  const editCarMutation = useMutation({
    mutationFn: editCar,
    onSuccess: (updatedCar, variables) => {
      queryClient.setQueryData(["cars", currentPage], (old) => ({
        ...old,
        cars: old.cars.map((car) =>
          car._id === variables.carId
            ? {
                ...car,
                nameCar: variables.updatedCar.nameCar,
                licensePlate: variables.updatedCar.licensePlate,
                seats: variables.updatedCar.seats,
                vehicleType: variables.updatedCar.vehicleType,
                userId: {
                  ...car.userId,
                  username: variables.updatedCar.userId.username,
                  email: variables.updatedCar.userId.email,
                },
              }
            : car
        ),
      }));
      queryClient.invalidateQueries(["cars"]);
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

  const deleteCarMutation = useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries(["cars"]);
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
    const newTrip = formData;
    console.log("newTrip", newTrip);

    // addTripMutation.mutate(newCar);
  };

  const handleEditCar = async (e) => {
    e.preventDefault();
    const url = await upload(file, "car");
    const updatedCar = {
      nameCar: formData.nameCar,
      licensePlate: formData.licensePlate,
      seats: parseInt(formData.seats),
      vehicleType: formData.vehicleType,
      image: url,
      features: formData.features,
      userId: {
        username: formData.username,
        email: formData.email,
      },
    };
    editCarMutation.mutate({ carId: currentCar._id, updatedCar });
  };

  const handleDeleteCar = () => {
    deleteCarMutation.mutate(infoDelete.id);
  };

  const openEditModal = (car) => {
    setCurrentCar(car);
    setFormData({
      nameCar: car.nameCar,
      licensePlate: car.licensePlate,
      seats: car.seats.toString(),
      vehicleType: car.vehicleType,
      image: car?.image,
      features: car.features,
      username: car.userId.username,
      email: car.userId.email,
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nameCar: "",
      licensePlate: "",
      seats: "",
      vehicleType: "",
      username: "",
      email: "",
      features: [],
    });
    setFile(null);
    setCurrentCar(null);
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
        <h2 className="text-2xl font-bold">Quản lý xe</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm xe
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
              trips.map((trip) => {
                // Định dạng departureDate và departureTime
                const formattedDateTime =
                  trip.departureDate && trip.departureTime
                    ? `  ${format(parseISO(trip.departureDate), "dd/MM/yyyy")} 
                       -
                      ${format(parseISO(trip.departureTime), "HH:mm")}`
                    : "Chưa cập nhật";

                return (
                  <tr key={trip._id}>
                    <td className="py-2 px-4 border-b font-semibold">
                      {trip.vehicleInfo || "Thông tin xe"}
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
                    <td className="py-2 px-4 border-b">{formattedDateTime}</td>
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
                              trip.licensePlate || "Không có biển số",
                            id: trip._id,
                          });
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        disabled={deleteCarMutation.isLoading}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Phần còn lại của component (modals, pagination) giữ nguyên */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-center">
            <h3 className="text-xl font-bold mb-4">Xóa xe</h3>
            <span className="text-base font-normal">
              Bạn chắc chắn muốn xóa xe với biển số:{" "}
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
                onClick={handleDeleteCar}
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
          setFile={setFile}
          setFormData={setFormData}
          resetForm={resetForm}
        />
      )}

      {isEditModalOpen && (
        <UpdateInfoTrip
          formData={formData}
          handleEditCar={handleEditCar}
          handleInputChange={handleInputChange}
          setIsEditModalOpen={setIsEditModalOpen}
          resetForm={resetForm}
          setFile={setFile}
          setFormData={setFormData}
          loading={editCarMutation.isLoading}
          error={editCarMutation.isError ? editCarMutation.error.message : null}
        />
      )}

      <Pagination totalPages={totalPages} handlePageClick={handlePageClick} />
    </div>
  );
};

export default InfoTrip;
