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

  if (isLoading) return <div>Loading...</div>;

  if (error)
    return <div>Lỗi khi tải thông tin người dùng: {error.message}</div>;

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
    <div className="mx-auto flex-1 bg-white shadow-lg p-6 rounded-xl space-y-4">
      {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden mb-2">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <svg
                className="w-6 h-6"
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

        {isEditing && (
          <label className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer">
            Chọn ảnh
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={!isEditing}
            />
          </label>
        )}
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="VD: Nguyễn Văn A"
          className="w-full border border-gray-300 rounded-lg p-2 bg-white disabled:bg-gray-100"
          disabled={!isEditing}
        />

        <input
          type="text"
          name="phone"
          value={formData.phone}
          placeholder="Số điện thoại"
          className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
          disabled
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="w-full border border-gray-300 rounded-lg p-2 bg-white disabled:bg-gray-100"
          disabled={!isEditing}
        />

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Địa chỉ"
          className="w-full border border-gray-300 rounded-lg p-2 bg-white disabled:bg-gray-100"
          disabled={!isEditing}
        />

        {user.role !== "USER" && (
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Mô tả"
            className="w-full border border-gray-300 rounded-lg p-2 bg-white disabled:bg-gray-100"
            rows={3}
            disabled={!isEditing}
          ></textarea>
        )}

        <div className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Lưu
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Cập nhật
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default InfoUser;
