import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "../../Util/axios";
import upload from "../../Util/upload";

import toast from "react-hot-toast";

const fetchUserById = async (id) => {
  const res = await api.get(`/user/${id}`);
  return res.data.user;
};

const updateUser = async ({ id, infoUpdate }) => {
  console.log("Updating user with id:", id, "data:", infoUpdate); // Debug
  const res = await api.put(`/user/${id}`, infoUpdate);
  console.log("API response:", res.data); // Debug
  return res.data.user;
};

const InfoUser = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const queryClient = useQueryClient();

  // UPDATE
  const userUpdate = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user._id] });
    },
  });

  // GET INFO USER
  const {
    isLoading,
    error,
    data: infouserGet,
  } = useQuery({
    queryKey: ["user", user._id],
    queryFn: () => fetchUserById(user._id),
    enabled: !!user._id,
  });

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    image: "",
  });
  const [initialFormData, setInitialFormData] = useState({ ...formData });
  const [avatar, setAvatar] = useState(user.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [curentId, setCurrentId] = useState(null);

  // GET INFO USER
  useEffect(() => {
    if (infouserGet) {
      setAvatar(infouserGet.image);
      setFormData({
        username: infouserGet.username || "",
        phone: infouserGet.phone || "",
        email: infouserGet.email || "",
        address: infouserGet.address || "",
        description: infouserGet.description || "",
        image: infouserGet.image || "",
      });
      setCurrentId(infouserGet._id);
      setInitialFormData({
        username: infouserGet.username || "",
        phone: infouserGet.phone || "",
        email: infouserGet.email || "",
        address: infouserGet.address || "",
        image: infouserGet.image || "",
      });
    }
  }, [infouserGet]);

  console.log("formData:", formData); // Debug

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-center">
        <p className="font-medium">Lỗi khi tải thông tin người dùng</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );

  // FILE IMAGE
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    console.log("check ", e.target.files.length);

    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ ...initialFormData });
    setAvatarFile(null);
    setIsEditing(false);
    setErrorMsg(null);
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!curentId) {
      setErrorMsg("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
      return;
    }

    if (!Object.values(formData).some((value) => value)) {
      setErrorMsg("Vui lòng nhập ít nhất một trường thông tin.");
      return;
    }

    const url = await upload(avatarFile, "user");
    console.log("check url ", url);

    // console.log("Mutation data:", { id: curentId, infoUpdate: formData }); // Debug
    userUpdate.mutate(
      { id: curentId, infoUpdate: { ...formData, image: url } },
      {
        onSuccess: () => {
          toast.success("Cập nhật thông tin thành công!");
          setIsEditing(false);
          setInitialFormData({ ...formData });
          setAvatarFile(null);
        },
        onError: (error) => {
          setErrorMsg(`Lỗi khi cập nhật: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="max-w-3xl h-[100vh] mx-auto py-8 px-4 sm:px-6">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-t-2xl py-6 px-8 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
      </div>

      <div className="bg-white rounded-b-2xl shadow-lg overflow-hidden">
        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 border-b border-red-100">
            <p className="text-center">{errorMsg}</p>
          </div>
        )}

        <div className="relative h-16 bg-gradient-to-r from-blue-100 to-indigo-100">
          <div className="absolute -bottom-10 left-10">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5V19a2 2 0 002 2h3m10-4.5V19a2 2 0 01-2 2h-3m-6 0h6M16.5 3.5a3 3 0 11-6 0 3 3 0 016 0zM12 14.5a4.5 4.5 0 00-9 0"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-10 pt-14 pb-10">
          {isEditing && (
            <div className="mb-6">
              <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Chọn ảnh đại diện
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Họ tên
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="VD: Nguyễn Văn A"
                    className={`w-full pl-10 pr-4 py-2 border ${
                      isEditing
                        ? "border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        : "border-gray-200"
                    } rounded-lg ${!isEditing && "bg-gray-50 text-gray-600"}`}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    placeholder="Số điện thoại"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className={`w-full pl-10 pr-4 py-2 border ${
                      isEditing
                        ? "border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        : "border-gray-200"
                    } rounded-lg ${!isEditing && "bg-gray-50 text-gray-600"}`}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Địa chỉ"
                    className={`w-full pl-10 pr-4 py-2 border ${
                      isEditing
                        ? "border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        : "border-gray-200"
                    } rounded-lg ${!isEditing && "bg-gray-50 text-gray-600"}`}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Description field appears only for non-USER roles and spans full width */}
            {user.role !== "USER" && (
              <div className="space-y-2 col-span-full">
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none text-gray-500">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                  </div>
                  <textarea
                    name="description"
                    value={formData?.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả về bạn"
                    className={`w-full pl-10 pr-4 py-2 border ${
                      isEditing
                        ? "border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        : "border-gray-200"
                    } rounded-lg ${!isEditing && "bg-gray-50 text-gray-600"}`}
                    rows={4}
                    disabled={!isEditing}
                  ></textarea>
                </div>
              </div>
            )}

            <div className="  flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors flex items-center gap-2 ${
                      userUpdate.isPending ? "opacity-75" : ""
                    }`}
                    disabled={userUpdate.isPending}
                  >
                    {userUpdate.isPending ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Lưu thông tin</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Cập nhật thông tin</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InfoUser;
