import React from "react";
import { useState } from "react";
import { useAuth } from "../../context/Context";
import { Link, useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
const AuthForm = ({ isLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    c_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login, register, googleLogin } = useAuth();
  const [eye, setEye] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
    if (success) setSuccess("");
  };
  const handleEye = (e) => {
    e.preventDefault();
    setEye((prev) => !prev);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.c_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData);
      }

      if (result.success) {
        setSuccess(result.message || "Registration Successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(result.error || "Registration Failed");
      }
    } catch (error) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80')] bg-cover bg-center">
      <div class="auth-container p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-red-500 mb-2">Join Foodie</h1>
          <p class="text-gray-600">Create your account to start ordering</p>
        </div>
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3 animate-fade-in">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
            <button
              onClick={() => setSuccess("")}
              className="flex-shrink-0 ml-auto text-green-500 hover:text-green-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3 animate-fade-in">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="flex-shrink-0 ml-auto text-red-500 hover:text-red-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
        <form class="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label for="name" class="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="">
            <label for="email" class="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <label for="password" class="block text-gray-700 font-medium mb-2">
              Password
            </label>
            {eye ? (
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={formData.password}
                onChange={handleChange}
                required
              />
            ) : (
              <input
                id="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={formData.password}
                onChange={handleChange}
                required
              />
            )}
            <button onClick={handleEye} className=" absolute top-1/2 right-2">
              <Eye className=" cursor-pointer hover:text-gray-600" />
            </button>
          </div>

          <div className=" relative">
            <label
              for="confirm-password"
              class="block text-gray-700 font-medium mb-2"
            >
              Confirm Password
            </label>
            {eye ? (
              <input
                type="password"
                id="c_password"
                name="c_password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={formData.c_password}
                onChange={handleChange}
                required
              />
            ) : (
              <input
                id="c_password"
                name="c_password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={formData.c_password}
                onChange={handleChange}
                required
              />
            )}
            <button onClick={handleEye} className=" absolute top-1/2 right-2">
              <Eye className=" cursor-pointer hover:text-gray-600" />
            </button>
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              type="checkbox"
              class="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" class="text-red-500 hover:text-red-600">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" class="text-red-500 hover:text-red-600">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            class="btn-primary w-full py-3 px-4 text-white font-medium rounded-lg hover:shadow-lg transition"
            onClick={register}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          <a
            href="#"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <img
              src="https://banner2.cleanpng.com/20240216/bqs/transparent-google-logo-google-logo-green-and-blue-g-in-1710875641440.webp"
              alt="Google"
              class="h-5 w-5 mr-2"
            />
            <span>
              <button onClick={googleLogin}>Signup with Google</button>
            </span>
          </a>

          <div class="text-center text-sm text-gray-600">
            Already have an account?
            <Link
              to="/login"
              class="font-medium text-red-500 hover:text-red-600"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
