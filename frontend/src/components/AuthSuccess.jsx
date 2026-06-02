import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Context";

const AuthSuccess = () => {
  const [message, setMessage] = useState("Processing authentication...");
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        try {
          localStorage.setItem("token", token);

          const response = await fetch("https://food-order-app-beta-pink.vercel.app/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setCurrentUser(userData);

            setMessage(
              "Authentication successful! Redirecting to dashboard..."
            );

            setTimeout(() => {
              navigate("/role");
            }, 1000);
          } else {
            throw new Error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Auth error:", error);
          setMessage("Authentication failed. Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } else {
        setMessage("No authentication token found. Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    };

    handleGoogleAuth();
  }, [navigate, setCurrentUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{message}</h2>
        <p className="text-gray-600">Please wait while we redirect you...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
