import React from "react";

const UpdateInfoUser = ({
  formData,
  handleEditUser,
  handleInputChange,
  setIsEditModalOpen,
  resetForm,
  setFile,

  loading,
  error,
}) => {
  // Handle cancel action
  const handleCancel = () => {
    setIsEditModalOpen(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-14">
      <div className="bg-white p-6 rounded-lg w-[800px]">
        <h3 className="text-xl font-bold mb-4">Sửa thông tin người dùng</h3>
        <form onSubmit={handleEditUser}>
          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Tên người dùng
              </label>
              <input
                type="text"
                name="username"
                placeholder="VD: vochithanh"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="VD: thang2@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone"
                placeholder="VD: 0938635533"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">Địa chỉ</label>
              <input
                type="text"
                name="address"
                placeholder="VD: 123 Đường ABC, Quận 1"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium mb-1">Vai trò</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="GARAGE">GARAGE</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Hình ảnh</label>
            {formData.image && (
              <div className="mb-2">
                <img
                  src={formData.image}
                  alt="Hình ảnh người dùng"
                  className="w-24 h-24 object-cover rounded"
                />
              </div>
            )}
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              name="description"
              placeholder="VD: Nhà xe uy tín, chất lượng"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              rows="4"
            />
          </div> */}

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInfoUser;
