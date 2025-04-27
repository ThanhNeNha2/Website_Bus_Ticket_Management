import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../Util/axios";
import UpdateInfoCar from "./Car/UpdateInfoCar";
import upload from "../../Util/upload";
import AddInfoCar from "./Car/AddInfoCar";
import ReactPaginate from "react-paginate";

// Hàm gọi API để lấy danh sách xe
const fetchCars = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không có token. Vui lòng đăng nhập lại.");
  }
  const res = await api.get("/cars");
  if (res.data.errCode !== 0) {
    throw new Error(res.data.message || "Không thể tải danh sách xe.");
  }
  return res.data.data.cars || [];
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
  // Phân trang
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 4;
  const items = [...Array(33).keys()];

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [currentCar, setCurrentCar] = useState(null);
  const [infoDelete, setInfoDelete] = useState({
    InfoLicensePlate: "",
    id: "",
  });

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
    data: cars = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
    onError: (err) => {
      if (err.message.includes("Không có token")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login");
      }
    },
  });

  // Mutation để thêm xe
  const addCarMutation = useMutation({
    mutationFn: addCar,
    onSuccess: () => {
      queryClient.invalidateQueries(["cars"]); // Làm mới danh sách xe
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
      // Cập nhật cache tạm thời để hiển thị ngay
      queryClient.setQueryData(["cars"], (old) =>
        old.map((car) =>
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
        )
      );
      // Làm mới danh sách xe từ server
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
      queryClient.invalidateQueries(["cars"]); // Làm mới danh sách xe
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
    setFile(null); // Reset file
    setCurrentCar(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
              <th className="py-2 px-4 border-b text-left">Tên xe</th>
              <th className="py-2 px-4 border-b text-left">Biển số xe</th>
              <th className="py-2 px-4 border-b text-left">Loại xe</th>
              <th className="py-2 px-4 border-b text-left">Tổng ghế</th>
              <th className="py-2 px-4 border-b text-left">Chủ xe</th>
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
            ) : cars.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-red-500">
                  Dữ liệu chưa được cập nhật
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr key={car._id}>
                  <td className="py-2 px-4 border-b font-semibold">
                    {car.nameCar}
                  </td>
                  <td className="py-2 px-4 border-b">{car.licensePlate}</td>
                  <td className="py-2 px-4 border-b">
                    {car.vehicleType || "Chưa cập nhật"}
                  </td>
                  <td className="py-2 px-4 border-b">{car.seats}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="font-medium">{car.userId.username}</div>
                    <div className="text-sm text-gray-600">
                      {car.userId.email}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => openEditModal(car)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
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
            <span className="text-base font-normal ">
              Bạn chắc chắn muốn xe với biển số là:{" "}
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
      {/* Modal Thêm Xe */}
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

      {/* Modal Sửa Xe */}
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

      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        previousLabel="<"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="active"
      />
    </div>
  );
};

export default InfoCar;
