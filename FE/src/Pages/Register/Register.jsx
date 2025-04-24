import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import login from "../../images/karavan-1.jpg";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { api } from "../../Util/axios";
import toast from "react-hot-toast";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER", // Default to "Người dùng"
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for the field when user types
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Họ và tên là bắt buộc";
    if (!formData.phone) newErrors.phone = "Số điện thoại là bắt buộc";
    else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.phone))
      newErrors.phone = "Số điện thoại không hợp lệ (VD: 0901234567)";
    if (!formData.email) newErrors.email = "Email là bắt buộc";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";
    else if (formData.password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/register", {
        username: formData.username,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      if (response.data.errCode === 0) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        setErrors({ api: response.data.message });
      }
    } catch (error) {
      setErrors({
        api:
          error.response?.data?.message ||
          "Đăng ký thất bại. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-14 h-screen flex">
      <div className="flex-1">
        <div className="h-full flex items-center justify-center bg-gray-200 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
            <h2 className="text-center text-2xl font-semibold mb-2">
              Tạo tài khoản
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Đã có tài khoản?
              <a href="/login" className="text-blue-600 underline font-medium">
                Đăng nhập
              </a>
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm text-gray-600 mb-1">
                  Mật khẩu
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-10 right-3 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm text-gray-600 mb-1">
                  Xác nhận mật khẩu
                </label>
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute top-10 right-3 text-gray-500"
                >
                  {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Account type */}
              <div className="flex justify-center gap-6 my-4 text-sm">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="role"
                    value="USER"
                    checked={formData.role === "USER"}
                    onChange={handleInputChange}
                    className="text-blue-600"
                  />
                  <span>Người dùng</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="role"
                    value="GARAGE"
                    checked={formData.role === "GARAGE"}
                    onChange={handleInputChange}
                    className="text-blue-600"
                  />
                  <span>Nhà xe</span>
                </label>
              </div>

              {/* Error from API */}
              {errors.api && (
                <p className="text-red-500 text-sm text-center">{errors.api}</p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className={`w-full py-2 rounded-full text-white ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Tạo tài khoản"}
              </button>
            </form>

            {/* Social login */}
            <p className="mt-6 text-sm text-center text-gray-600">
              Hoặc đăng ký với
              <a href="#" className="text-blue-600 underline font-medium">
                Google
              </a>
              hoặc
              <a href="#" className="text-blue-600 underline font-medium">
                Facebook
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 h-full">
        <img src={login} alt="Bus" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Register;
