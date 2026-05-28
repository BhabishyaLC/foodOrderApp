import React from "react";
import { useAuth } from "../../context/Context";
import { Link } from "react-router-dom";

const RestaurantRejected = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Rejected
          </h2>

          <p className="text-gray-600 mb-4">
            Sorry, <strong>{currentUser?.name}</strong>. Your restaurant
            application has been rejected.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              ❌ Rejection Reason
            </h3>
            <p className="text-red-700 text-sm">
              {currentUser?.rejectionReason ||
                "Your application did not meet our requirements."}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-500">
              <strong>Status:</strong> Application Rejected
            </p>
            <p className="text-sm text-gray-500">
              <strong>Next Steps:</strong> You can apply again with updated
              information
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/restaurant_form"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Apply Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantRejected;
