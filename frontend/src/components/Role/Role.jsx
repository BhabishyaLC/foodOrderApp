import React, { useState } from "react";
import { useAuth } from "../../context/Context";
import { useNavigate } from "react-router-dom";

const Role = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { currentUser, selectRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = async () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await selectRole(currentUser.id, selectedRole);

      if (result.success) {
        
        navigate(result.redirectTo|| '/dashboard');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Choose Your Role
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            How would you like to use Foodie?
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
              selectedRole === "customer"
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-red-300"
            }`}
            onClick={() => setSelectedRole("customer")}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === "customer"
                      ? "border-red-500 bg-red-500"
                      : "border-gray-400"
                  }`}
                >
                  {selectedRole === "customer" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Customer</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Browse restaurants, order food, and get delivery
                </p>
              </div>
            </div>
          </div>

          <div
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
              selectedRole === "restaurant"
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-red-300"
            }`}
            onClick={() => setSelectedRole("restaurant")}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === "restaurant"
                      ? "border-red-500 bg-red-500"
                      : "border-gray-400"
                  }`}
                >
                  {selectedRole === "restaurant" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Restaurant Owner
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  List your restaurant, manage menu, and accept orders
                </p>
                <p className="mt-1 text-xs text-red-500">* Requires approval</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={handleRoleSelect}
            disabled={!selectedRole || loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Role;
