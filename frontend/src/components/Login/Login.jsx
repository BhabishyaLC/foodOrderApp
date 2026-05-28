import React from "react";
import { useState } from "react";
import { useAuth } from "../../context/Context";
import {Link as RouterLink} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import { Eye } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [eye,setEye]=useState(false)
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
   
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
 
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        
         navigate(result.redirectTo || '/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEye=(e)=>{
    e.preventDefault()
    setEye(prev=>!prev)
  }
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center">
      <div className="auth-container p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-500 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600">Login to your Foodie account</p>
        </div>
          
         {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3 transition-all duration-300 ease-in-out">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                {error}
              </p>
            </div>
            <button 
              onClick={() => setError("")}
              className="flex-shrink-0 ml-auto text-red-500 hover:text-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label for="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className=" relative">
            <label
              for="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            {eye? 
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
          : 
              <input
              
              id="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={formData.password}
              onChange={handleChange}
              required
            />
            }
             <button onClick={handleEye} className=" absolute top-1/2 right-2">
            <Eye className=" cursor-pointer hover:text-gray-600"/>
          </button>
          </div>

   

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 px-4 text-white font-medium rounded-lg hover:shadow-lg transition"
            
          >
            Login
          </button>
     
         
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or 
              </span>
            </div>
          </div>

          <a
            href="#"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <img
              src="https://banner2.cleanpng.com/20240216/bqs/transparent-google-logo-google-logo-green-and-blue-g-in-1710875641440.webp"
              alt="Google"
              className="h-5 w-5 mr-2"
            />
            <button onClick={googleLogin}>Continue with Google</button>
          </a>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?
            
               <RouterLink
                to='/register'
                
                
              >
                <button  className="font-medium text-red-500 hover:text-red-600">
                  Signup
                </button>
                
              </RouterLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
