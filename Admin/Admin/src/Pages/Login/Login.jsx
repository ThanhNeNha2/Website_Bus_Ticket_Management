import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import login from "../../images/karavan-1.jpg";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { api } from "../../Util/axios";
import toast from "react-hot-toast";
import Header from "../../Components/Header/Header";

const Login = () => {
  const [infoLogin, setInfoLogin] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Check if all fields are filled
  const isFormValid =
    infoLogin.email.trim() !== "" && infoLogin.password.trim() !== "";

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInfoLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the field when user types
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!infoLogin.email) newErrors.email = "Email là bắt buộc";
    else if (!/\S+@\S+\.\S+/.test(infoLogin.email))
      newErrors.email = "Email không hợp lệ";
    if (!infoLogin.password) newErrors.password = "Mật khẩu là bắt buộc";
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/login", {
        email: infoLogin.email,
        password: infoLogin.password,
      });
      if (res.status === 200) {
        // Store accessToken in localStorage
        localStorage.setItem("accessToken", res.data.accessToken);
        // Optionally store user data (e.g., id, role)
        localStorage.setItem("user", JSON.stringify(res.data));
        toast.success("Đăng nhập thành công!");
        // Redirect based on role
        const role = res.data.role;
        console.log("check thong tin ", res.data);

        if (role === "GARAGE") {
          navigate("/admin/ticket-management");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data === "Wrong email"
          ? "Email không đúng"
          : error.response?.data === "Wrong password"
          ? "Mật khẩu không đúng"
          : "Đăng nhập thất bại. Vui lòng thử lại.";
      setErrors({ api: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex">
      <div className="flex-1">
        <div className="h-full flex items-center justify-center bg-gray-200 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
            <h2 className="text-center text-2xl font-semibold mb-2">
              Đăng nhập
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Bạn chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-blue-600 underline font-medium"
              >
                Đăng ký
              </Link>
            </p>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={infoLogin.email}
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
                  value={infoLogin.password}
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

              {/* API Error */}
              {errors.api && (
                <p className="text-red-500 text-sm text-center">{errors.api}</p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className={`w-full py-2 rounded-full text-white ${
                  isSubmitting || !isFormValid
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>

            {/* Social login */}
            <p className="mt-6 text-sm text-center text-gray-600">
              Hoặc đăng nhập với{" "}
              <a href="#" className="text-blue-600 underline font-medium">
                Google
              </a>{" "}
              hoặc{" "}
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

export default Login;
