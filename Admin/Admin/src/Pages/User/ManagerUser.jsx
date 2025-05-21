import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../Util/axios";
import upload from "../../Util/upload";
import UpdateInfoUser from "../User/UpdateInfoUser"; // Đổi tên component con
import Pagination from "../../Components/Pagination/Pagination";

// Hàm gọi API để lấy danh sách người dùng
const fetchUsers = async ({ page = 1, limit = 5 }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không có token. Vui lòng đăng nhập lại.");
  }
  const res = await api.get(`/user?page=${page}&limit=${limit}`);
  console.log("res", res);

  if (res.data.errCode !== 0) {
    throw new Error(res.data.message || "Không thể tải danh sách người dùng.");
  }
  return {
    users: res.data.data.users || [],
    totalItems: res.data.data.total || 1,
  };
};

// Hàm gọi API để sửa người dùng
const editUser = async ({ userId, updatedUser }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không có token. Vui lòng đăng nhập lại.");
  }
  const res = await api.put(`/user/${userId}`, updatedUser);
  if (res.data.errCode !== 0) {
    throw new Error(res.data.message || "Không thể sửa người dùng.");
  }
  return res.data.data;
};

// Hàm gọi API để xóa người dùng
const deleteUser = async (userId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không có token. Vui lòng đăng nhập lại.");
  }
  const res = await api.delete(`/user/${userId}`);
  if (res.data.errCode !== 0) {
    throw new Error(res.data.message || "Không thể xóa người dùng.");
  }
  return userId;
};

const ManagerUser = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Đổi từ currentCar thành currentUser
  const [infoDelete, setInfoDelete] = useState({
    InfoUsername: "",
    id: "",
  });
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 7; // Số người dùng mỗi trang

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    image: "",
    description: "",
    role: "USER", // Default role from schema
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Query để lấy danh sách người dùng
  const {
    data: { users = [], totalItems = 1 } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", currentPage], // Đổi từ "cars" thành "users"
    queryFn: () => fetchUsers({ page: currentPage, limit: itemsPerPage }),
  });

  console.log("users", users);

  // Mutation để thêm người dùng

  // Mutation để sửa người dùng
  const editUserMutation = useMutation({
    mutationFn: editUser,
    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData(["users", currentPage], (old) => ({
        ...old,
        users: old.users.map((user) =>
          user._id === variables.userId
            ? {
                ...user,
                username: variables.updatedUser.username,
                email: variables.updatedUser.email,
                phone: variables.updatedUser.phone,
                address: variables.updatedUser.address,
                image: variables.updatedUser.image,
                description: variables.updatedUser.description,
                role: variables.updatedUser.role,
              }
            : user
        ),
      }));
      queryClient.invalidateQueries(["users"]);
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

  // Mutation để xóa người dùng
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
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

  // Xử lý sửa người dùng
  const handleEditUser = async (e) => {
    e.preventDefault();
    const url = file ? await upload(file, "user") : currentUser.image;
    const updatedUser = {
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      image: url,
      description: formData.description,
      role: formData.role,
    };
    editUserMutation.mutate({ userId: currentUser._id, updatedUser });
  };

  // Xử lý xóa người dùng
  const handleDeleteUser = () => {
    deleteUserMutation.mutate(infoDelete.id);
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      image: user.image || "",
      description: user.description || "",
      role: user.role || "USER",
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      image: "",
      description: "",
      role: "USER",
    });
    setFile(null);
    setCurrentUser(null);
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Quản lý người dùng
        </h2>
      </div>

      {error && (
        <p className="text-red-500 text-center mb-4">{error.message}</p>
      )}

      <div className="overflow-x-auto rounded-xl shadow mb-8">
        <table className="min-w-full bg-white border border-gray-200 rounded-xl">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="py-3 px-4 text-left">Tên</th>
              <th className="py-3 px-4 text-left">Gmail</th>
              <th className="py-3 px-4 text-left">Số điện thoại</th>
              <th className="py-3 px-4 text-left">Địa chỉ</th>
              <th className="py-3 px-4 text-left">Ngày tạo</th>
              <th className="py-3 px-4 text-left">Vai trò</th>
              <th className="py-3 px-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="py-5 px-4 text-center text-blue-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-5 px-4 text-center text-red-500">
                  Dữ liệu chưa được cập nhật
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="py-3 px-4 border-b font-semibold">
                    {user.username}
                  </td>
                  <td className="py-3 px-4 border-b">{user.email}</td>
                  <td className="py-3 px-4 border-b">
                    {user.phone || "Chưa cập nhật"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {user.address || "Chưa cập nhật"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <span className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b capitalize">
                    {user.role || "USER"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setInfoDelete({
                            InfoUsername: user.username,
                            id: user._id,
                          });
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                        disabled={deleteUserMutation.isLoading}
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
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Xóa người dùng
            </h3>
            <p className="text-gray-600 text-base">
              Bạn chắc chắn muốn xóa người dùng với tên:
            </p>
            <p className="font-semibold text-lg mt-2">
              {infoDelete.InfoUsername}
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <UpdateInfoUser
          formData={formData}
          handleEditUser={handleEditUser}
          handleInputChange={handleInputChange}
          setIsEditModalOpen={setIsEditModalOpen}
          resetForm={resetForm}
          setFile={setFile}
          setFormData={setFormData}
          loading={editUserMutation.isLoading}
          error={
            editUserMutation.isError ? editUserMutation.error.message : null
          }
        />
      )}

      <Pagination totalPages={totalPages} handlePageClick={handlePageClick} />
    </div>
  );
};

export default ManagerUser;
