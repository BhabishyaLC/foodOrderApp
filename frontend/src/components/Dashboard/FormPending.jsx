import React from "react";
import { useAuth } from "../../context/Context";

const RestaurantPending = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⏳</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Application Under Review
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for submitting your restaurant application! Our team is
          currently reviewing your information. This process usually takes 24-48
          hours.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Status:</strong> Under Supervision
          </p>
          <p className="text-yellow-800 text-sm mt-1">
            <strong>Email:</strong> {currentUser?.email}
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh Status
        </button>
      </div>
    </div>
  );
};

export default RestaurantPending;
