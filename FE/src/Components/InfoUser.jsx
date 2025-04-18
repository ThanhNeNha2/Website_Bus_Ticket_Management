import { useState } from "react";

const InfoUser = () => {
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  return (
    <div className=" mx-auto flex-1 bg-white shadow-lg p-6 rounded-xl space-y-4">
      <input
        type="text"
        placeholder="Nguyễn Văn Dược"
        className="w-full border border-gray-300 rounded-lg p-2"
      />

      <input
        type="text"
        placeholder="0928817110"
        className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
        disabled
      />

      <input
        type="email"
        placeholder="duocnvoit110@gmail.com"
        className="w-full border border-gray-300 rounded-lg p-2"
      />

      <input
        type="text"
        placeholder="Nghệ An"
        className="w-full border border-gray-300 rounded-lg p-2"
      />

      <input
        type="text"
        placeholder="Họ tên user Support"
        className="w-full border border-gray-300 rounded-lg p-2"
      />

      <textarea
        placeholder="Mô tả về các vé xe"
        className="w-full border border-gray-300 rounded-lg p-2"
        rows={3}
      ></textarea>

      <input
        type="password"
        placeholder="*********"
        className="w-full border border-gray-300 rounded-lg p-2"
      />

      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden mb-2">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar Preview"
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
          />
        </label>
      </div>
    </div>
  );
};

export default InfoUser;
