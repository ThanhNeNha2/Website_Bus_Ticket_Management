import React, { useState } from "react";
import login from "../../images/karavan-1.jpg";
import { FaEyeSlash, FaEye } from "react-icons/fa";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="pt-14 h-screen flex ">
      <div className="flex-1">
        <div className="h-full flex items-center justify-center bg-gradient-to-r bg-gray-200 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative">
            <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg"
                alt=""
                className="w-full h-full"
              />
            </div>

            {/* Title */}
            <h2 className="text-center text-2xl font-semibold">
              Create an account
            </h2>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a href="#" className="text-black underline font-medium">
                Log in
              </a>
            </p>

            {/* Account type */}
            <div className="flex justify-center gap-6 my-6 text-sm">
              <label className="flex items-center gap-1">
                <input type="radio" name="type" defaultChecked />
                <span>Người dùng </span>
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="type" />
                <span>Nhà xe</span>
              </label>
            </div>

            {/* Form */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="relative">
                <label className="block text-sm text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-8 right-3 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Country of residence
                </label>
                <select className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option>Vietnam</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Others</option>
                </select>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-gray-300 text-white py-2 rounded-full cursor-not-allowed"
                disabled
              >
                Create an account
              </button>
            </form>

            {/* Social login */}
            <p className="mt-6 text-sm text-center text-gray-600">
              Or, continue with{" "}
              <a className="underline font-medium" href="#">
                Google
              </a>{" "}
              or{" "}
              <a className="underline font-medium" href="#">
                Facebook
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 h-full">
        <img src={login} alt="" className="w-full h-full object-cover " />
      </div>
    </div>
  );
};

export default Register;
