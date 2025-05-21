import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../Util/axios";
import UpdateInfoCar from "./UpdateInfoCar";
import upload from "../../Util/upload";
import AddInfoCar from "./AddInfoCar";
import Pagination from "../../Components/Pagination/Pagination";

// Hàm gọi API để lấy danh sách xe
const fetchCars = async ({ page = 1, limit = 5 }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không có token. Vui lòng đăng nhập lại.");
  }
  const res = await api.get(`/cars?page=${page}&limit=${limit}`);
  if (res.data.errCode !== 0) {
    throw new Error(res.data.message || "Không thể tải danh sách xe.");
  }
  return {
    cars: res.data.data.cars || [],
    totalItems: res.data.data.total || 1,
  };
};
// Hàm gọi API để thêm xe
const addCar = async (newCar) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không có token. Vui lòng đăng nhập lại.");
  }
  const res = await api.post("/cars", newCar);
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

const InfoCar = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [currentCar, setCurrentCar] = useState(null);
  const [infoDelete, setInfoDelete] = useState({
    InfoLicensePlate: "",
    id: "",
  });
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 7; // Số xe mỗi trang

  const [formData, setFormData] = useState({
    nameCar: "",
    licensePlate: "",
    seats: "",
    vehicleType: "",
    username: "",
    email: "",
    image: "",
    features: [],
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Query để lấy danh sách xe
  const {
    data: { cars = [], totalItems = 1 } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cars", currentPage],
    queryFn: () => fetchCars({ page: currentPage, limit: itemsPerPage }),
  });

  // Mutation để thêm xe
  const addCarMutation = useMutation({
    mutationFn: addCar,
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

  // Mutation để sửa xe
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

  // Mutation để xóa xe
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

  // Xử lý thêm xe
  const handleAddCar = (e) => {
    e.preventDefault();
    const newCar = {
      nameCar: formData.nameCar,
      licensePlate: formData.licensePlate,
      seats: parseInt(formData.seats),
      vehicleType: formData.vehicleType,
      features: formData.features,
    };
    addCarMutation.mutate(newCar);
  };

  // Xử lý sửa xe
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

  // Xử lý xóa xe
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

  // Xử lý khi chuyển trang
  const handlePageClick = (event) => {
    const newPage = event.selected + 1; // ReactPaginate đếm từ 0
    setCurrentPage(newPage);
  };

  return (
    <div className="flex-1 p-6 bg-[#f5f7fa] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Quản lý xe</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          + Thêm xe
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-center mb-4">{error.message}</p>
      )}

      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200 mb-8">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="py-3 px-5">Tên xe</th>
              <th className="py-3 px-5">Biển số</th>
              <th className="py-3 px-5">Loại xe</th>
              <th className="py-3 px-5">Số ghế</th>
              <th className="py-3 px-5">Chủ xe</th>
              <th className="py-3 px-5 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-blue-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : cars.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-red-500">
                  Dữ liệu chưa được cập nhật
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr
                  key={car._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="py-3 px-5 font-medium">{car.nameCar}</td>
                  <td className="py-3 px-5">{car.licensePlate}</td>
                  <td className="py-3 px-5">
                    {car.vehicleType || "Chưa cập nhật"}
                  </td>
                  <td className="py-3 px-5">{car.seats}</td>
                  <td className="py-3 px-5">
                    <div className="font-semibold text-gray-800">
                      {car.userId?.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {car.userId?.email}
                    </div>
                  </td>
                  <td className="py-3 px-5 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(car)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setInfoDelete({
                            InfoLicensePlate: car.licensePlate,
                            id: car._id,
                          });
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                        disabled={deleteCarMutation.isLoading}
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

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center animate-fadeIn">
            <h3 className="text-xl font-bold mb-3 text-gray-800">Xóa xe</h3>
            <p className="text-gray-700 mb-5">
              Bạn chắc chắn muốn xóa xe với biển số:{" "}
              <span className="font-semibold text-red-600">
                {infoDelete.InfoLicensePlate}
              </span>
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteCar}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm xe */}
      {isAddModalOpen && (
        <AddInfoCar
          handleAddCar={handleAddCar}
          formData={formData}
          handleInputChange={handleInputChange}
          addCarMutation={addCarMutation}
          setIsAddModalOpen={setIsAddModalOpen}
          setFile={setFile}
          setFormData={setFormData}
          resetForm={resetForm}
        />
      )}

      {/* Modal Sửa xe */}
      {isEditModalOpen && (
        <UpdateInfoCar
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

      {/* Pagination */}
      <Pagination totalPages={totalPages} handlePageClick={handlePageClick} />
    </div>
  );
};

export default InfoCar;
