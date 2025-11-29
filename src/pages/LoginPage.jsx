import React from "react";
import useForm from "../hooks/useForm";
import { authService } from "../services/authService";

const initialLoginState = {
  username: "",
  password: "",
};

const loginValidationRules = {
  username: (value) => (value ? "" : "Tên đăng nhập không được để trống"),
  password: (value) => (value ? "" : "Mật khẩu không được để trống"),
};

const LoginPage = ({ onLoginSuccess }) => {
  const { formData, errors, handleChange, handleSubmit } = useForm(
    initialLoginState,
    loginValidationRules
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = handleSubmit();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const token = await authService.login(formData);
        if (token && typeof token === "string" && token.trim().length > 0) {
          onLoginSuccess(token);
          alert("Đăng nhập admin thành công!");
        } else {
          handleChange({ target: { name: "formError", value: "Đăng nhập thất bại: Không nhận được token hợp lệ." } });
        }
      } catch (error) {
        console.error("Login API error:", error);
        const errorMessage = error.response?.data?.error
          ? error.response.data.error
          : "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin hoặc thử lại sau.";
        handleChange({ target: { name: "formError", value: errorMessage } });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="bg-gray-900 shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Login</h2>
        <form className="space-y-5" onSubmit={handleLogin}>
          {errors.formError && (
            <p className="text-red-500 text-sm text-center">{errors.formError}</p>
          )}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin username"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white py-2 rounded-lg font-semibold"
          >
            Login Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
