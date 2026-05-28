import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Context";

const AutoRedirect = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {


    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!currentUser.hasSelectedRole) {
     
      navigate("/role");
      return;
    }

    if (currentUser.role === "restaurant_pending") {
      if (!currentUser.hasSubmittedForm) {
        navigate("/restaurant_form");
      } else {
        navigate("/restaurant-pending");
      }
    } else if (currentUser.restaurantStatus === "rejected") {
      navigate("/rejected");
    } else if (currentUser.role === "restaurant_owner") {
      navigate("/restaurant");
    } else if (currentUser.role === "customer") {
      navigate("/customer");
    } else {
      navigate("/role");
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default AutoRedirect;
