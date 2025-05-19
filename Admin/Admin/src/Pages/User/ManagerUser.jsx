import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../Util/axios";

import upload from "../../Util/upload";

import UpdateInfoCar from "../Car/UpdateInfoCar";
import Pagination from "../../Components/Pagination/Pagination";
import AddInfoCar from "../Car/AddInfoCar";

// Hàm gọi API để lấy danh sách xe
const fetchCars = async ({ page = 1, limit = 5 }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không có token. Vui lòng đăng nhập lại.");
  }
  const res = await api.get(`/user?page=${page}&limit=${limit}`);
  console.log("res", res);

  if (res.data.errCode !== 0) {
    throw new Error(res.data.message || "Không thể tải danh sách xe.");
  }
  return {
    users: res.data.data.users || [],
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

const ManagerUser = () => {
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
    data: { users = [], totalItems = 1 } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", currentPage],
    queryFn: () => fetchCars({ page: currentPage, limit: itemsPerPage }),
  });

  console.log("users", users);

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
              <th className="py-2 px-4 border-b text-left">Tên </th>
              <th className="py-2 px-4 border-b text-left">Gmail</th>
              <th className="py-2 px-4 border-b text-left">Số điện thoại</th>
              <th className="py-2 px-4 border-b text-left">Địa chỉ</th>
              <th className="py-2 px-4 border-b text-left">
                Ngày tạo tài khoản
              </th>
              <th className="py-2 px-4 border-b text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-blue-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-red-500">
                  Dữ liệu chưa được cập nhật
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b font-semibold">
                    {user.username}
                  </td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    {user.phone || "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">{user.address}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="font-medium">{user.createdAt}</div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => openEditModal(user)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setInfoDelete({
                          InfoLicensePlate: user.licensePlate,
                          id: user._id,
                        });
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      disabled={deleteCarMutation.isLoading}
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

      {/* Modal Sửa Xe */}
      {isEditModalOpen && (
        <UpdateInfoUser
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

export default ManagerUser;
