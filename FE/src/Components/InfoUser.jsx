import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../Util/axios";

const InfoUser = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    username: user.username || "",
    phone: user.phone || "",
    email: user.email || "",
    address: user.address || "",
    description: user.description || "",
  });

  const [initialFormData, setInitialFormData] = useState({ ...formData });
  const [avatar, setAvatar] = useState(user.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
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
    setAvatar(user.avatar || null);
    setAvatarFile(null);
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.put(`/user/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token for authentication
          // Let Axios set Content-Type automatically for FormData
        },
      });

      if (res.data.errCode === 0) {
        const updatedUser = { ...user, ...res.data.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setFormData({
          username: updatedUser.username || "",
          phone: updatedUser.phone || "",
          email: updatedUser.email || "",
          address: updatedUser.address || "",
          description: updatedUser.description || "",
        });
        setInitialFormData({
          username: updatedUser.username || "",
          phone: updatedUser.phone || "",
          email: updatedUser.email || "",
          address: updatedUser.address || "",
          description: updatedUser.description || "",
        });

        setAvatar(updatedUser.avatar || avatar);
        setAvatarFile(null);
        setSuccess("Cập nhật thông tin thành công!");
        setIsEditing(false);
      } else {
        setError(res.data.message || "Không thể cập nhật thông tin.");
      }
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.message ||
            "Không thể cập nhật thông tin. Vui lòng thử lại."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex-1 bg-white shadow-lg p-6 rounded-xl space-y-4">
      {success && <p className="text-green-500 text-center">{success}</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

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

        <label className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer">
          Chọn ảnh hoặc thay đổi ảnh đại diện
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={!isEditing}
          />
        </label>
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
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu"}
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
