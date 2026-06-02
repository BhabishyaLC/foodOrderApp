import React, { useState, useEffect } from "react";

const AdminPanel = () => {
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [approvedRestaurants, setApprovedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(
        "https://food-order-app-beta-pink.vercel.app/api/admin/restaurants"
      );
      const data = await response.json();

      if (response.ok) {
        setPendingRestaurants(data.pending || []);
        setApprovedRestaurants(data.approved || []);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (restaurantId) => {
    try {
      const response = await fetch(
        `https://food-order-app-beta-pink.vercel.app/api/admin/restaurants/${restaurantId}/approve`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        fetchRestaurants();
        setShowDetailsModal(false);
        alert("Restaurant approved successfully!");
      } else {
        alert("Failed to approve restaurant");
      }
    } catch (error) {
      console.error("Error approving restaurant:", error);
      alert("Error approving restaurant");
    }
  };

  const handleReject = async (restaurantId) => {
    const reason = prompt("Please enter rejection reason:");
    if (!reason) return;

    try {
      const response = await fetch(
        `https://food-order-app-beta-pink.vercel.app/api/admin/restaurants/${restaurantId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (response.ok) {
        fetchRestaurants();
        setShowDetailsModal(false);
        alert("Restaurant rejected successfully!");
      } else {
        alert("Failed to reject restaurant");
      }
    } catch (error) {
      console.error("Error rejecting restaurant:", error);
      alert("Error rejecting restaurant");
    }
  };

  const viewDetails = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">
                Manage restaurant applications and view all details
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Total: {pendingRestaurants.length + approvedRestaurants.length}{" "}
              restaurants
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pending Applications
              {pendingRestaurants.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                  {pendingRestaurants.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "approved"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Approved Restaurants
              <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
                {approvedRestaurants.length}
              </span>
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === "pending" && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Pending Restaurant Applications ({pendingRestaurants.length})
              </h2>

              {pendingRestaurants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🍽️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No pending applications
                  </h3>
                  <p className="text-gray-500">
                    All restaurant applications have been processed.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {pendingRestaurants.map((restaurant) => (
                    <div
                      key={restaurant._id}
                      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {restaurant.name}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          <span className="font-medium">Registration Number:</span>{" "}
                          {restaurant.regNum}
                        </p>
                        <p className="text-gray-600 mb-2">
                          <span className="font-medium">Location:</span>{" "}
                          {restaurant.address.city}, {restaurant.address.state}
                        </p>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {restaurant.description}
                        </p>

                        <div className="text-sm text-gray-500 mb-4">
                          <p>
                            <strong>Contact:</strong> {restaurant.contact.phone}
                          </p>
                          <p>
                            <strong>Owner:</strong> {restaurant.owner?.name} (
                            {restaurant.owner?.email})
                          </p>
                          <p>
                            <strong>Applied:</strong>{" "}
                            {new Date(
                              restaurant.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewDetails(restaurant)}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleApprove(restaurant._id)}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(restaurant._id)}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "approved" && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Approved Restaurants ({approvedRestaurants.length})
              </h2>

              {approvedRestaurants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🏪</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No approved restaurants
                  </h3>
                  <p className="text-gray-500">
                    Approved restaurants will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {approvedRestaurants.map((restaurant) => (
                    <div
                      key={restaurant._id}
                      className="bg-white rounded-lg shadow-md border border-green-200 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {restaurant.name}
                          </h3>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Approved
                          </span>
                        </div>

                        <p className="text-gray-600 mb-2">
                          <span className="font-medium">Registration Number:</span>{" "}
                          {restaurant.regNum}
                        </p>
                        <p className="text-gray-600 mb-2">
                          <span className="font-medium">Location:</span>{" "}
                          {restaurant.address.city}, {restaurant.address.state}
                        </p>

                        <div className="text-sm text-gray-500 mb-4">
                          <p>
                            <strong>Contact:</strong> {restaurant.contact.phone}
                          </p>
                          <p>
                            <strong>Owner:</strong> {restaurant.owner?.name}
                          </p>
                          <p>
                            <strong>Approved:</strong>{" "}
                            {new Date(
                              restaurant.updatedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <button
                          onClick={() => viewDetails(restaurant)}
                          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
                        >
                          View Full Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showDetailsModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
            <div className="mt-3">
              <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedRestaurant.name} - Full Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p>
                        <strong>Restaurant Name:</strong>{" "}
                        {selectedRestaurant.name}
                      </p>
                      <p>
                        <strong>Registration Number:</strong>{" "}
                        {selectedRestaurant.regNum}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedRestaurant.description}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Status:</strong>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            selectedRestaurant.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {selectedRestaurant.status.charAt(0).toUpperCase() +
                            selectedRestaurant.status.slice(1)}
                        </span>
                      </p>
                      <p>
                        <strong>Application Date:</strong>{" "}
                        {new Date(
                          selectedRestaurant.createdAt
                        ).toLocaleString()}
                      </p>
                      {selectedRestaurant.updatedAt && (
                        <p>
                          <strong>Last Updated:</strong>{" "}
                          {new Date(
                            selectedRestaurant.updatedAt
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {selectedRestaurant.contact.phone}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {selectedRestaurant.contact.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Owner Name:</strong>{" "}
                        {selectedRestaurant.owner?.name}
                      </p>
                      <p>
                        <strong>Owner Email:</strong>{" "}
                        {selectedRestaurant.owner?.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Address
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>
                      <strong>Street:</strong>{" "}
                      {selectedRestaurant.address.street}
                    </p>
                    <p>
                      <strong>City:</strong> {selectedRestaurant.address.city}
                    </p>
                    <p>
                      <strong>State:</strong> {selectedRestaurant.address.state}
                    </p>
                    <p>
                      <strong>ZIP Code:</strong>{" "}
                      {selectedRestaurant.address.zipCode}
                    </p>
                    
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Opening Hours
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedRestaurant.openingHours || {}).map(
                      ([day, hours]) => (
                        <div
                          key={day}
                          className="flex justify-between items-center border-b pb-2"
                        >
                          <span className="capitalize font-medium">{day}:</span>
                          <span>
                            {hours.open} - {hours.close}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {selectedRestaurant.status === "rejected" &&
                  selectedRestaurant.rejectionReason && (
                    <div>
                      <h4 className="text-lg font-semibold text-red-800 mb-3">
                        Rejection Reason
                      </h4>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="text-red-700">
                          {selectedRestaurant.rejectionReason}
                        </p>
                      </div>
                    </div>
                  )}
              </div>

              {selectedRestaurant.status === "pending" && (
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    onClick={() => handleReject(selectedRestaurant._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRestaurant._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                  >
                    Approve Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
