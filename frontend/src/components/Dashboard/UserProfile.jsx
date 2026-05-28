import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/Context";
import {
  User,
  Phone,
  MapPin,
  Camera,
  Save,
  Plus,
  Edit3,
  Trash2,
  Bell,
  Shield,
  CreditCard,
  Star,
  Clock,
  Heart,
  LogOut,
  ArrowLeft,
} from "lucide-react";

const UserProfile = () => {
  const { currentUser, logout, updateUserData } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    profileImage: { url: "" },
  });
  const [addresses, setAddresses] = useState([]);
 
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Kosher",
    "Halal",
  ];

  const cuisineOptions = [
    "Italian",
    "Indian",
    "Chinese",
    "Mexican",
    "Japanese",
    "Thai",
    "American",
    "Mediterranean",
  ];

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!currentUser) {
        setMessage("Please log in to view your profile");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Authentication token not found");
        return;
      }

      console.log("Fetching user profile...");

      const response = await fetch("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.user) {
        
        const user = data.user;

        setUserData({
          name: user.name || currentUser.name || "",
          email: user.email || currentUser.email || "",
          phone: user.phone || "",
          dateOfBirth: user.dateOfBirth
            ? new Date(user.dateOfBirth).toISOString().split("T")[0]
            : "",
          profileImage: user.profileImage || { url: "" },
        });

        setAddresses(user.addresses || []);
       
      } else {
        console.log("Using context user data as fallback");
        setUserData({
          name: currentUser.name || "",
          email: currentUser.email || "",
          phone: "",
          dateOfBirth: "",
          profileImage: { url: "" },
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);

      if (currentUser) {
       
        setUserData({
          name: currentUser.name || "",
          email: currentUser.email || "",
          phone: "",
          dateOfBirth: "",
          profileImage: { url: "" },
        });
      }

      setMessage("Error loading profile data. Using cached information.");
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...userData,
         
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Profile updated successfully!");
        updateUserData(data.user);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserData((prev) => ({
        ...prev,
        profileImage: { url: reader.result },
      }));
    };
    reader.readAsDataURL(file);
  };

  const saveAddress = async (addressData) => {
    try {
      const token = localStorage.getItem("token");
      const url = editingAddress
        ? `http://localhost:5000/api/user/address/${editingAddress._id}`
        : "http://localhost:5000/api/user/address";

      const response = await fetch(url, {
        method: editingAddress ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      const data = await response.json();

      if (data.success) {
        setAddresses(data.user.addresses);
        setShowAddressForm(false);
        setEditingAddress(null);
        setMessage(editingAddress ? "Address updated!" : "Address added!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Error saving address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      setMessage("Error saving address");
    }
  };

  const deleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/user/address/${addressId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.success) {
        setAddresses(data.user.addresses);
        setMessage("Address deleted!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Error deleting address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      setMessage("Error deleting address");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors  cursor-pointer"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-8">
              <nav className="space-y-2">
                {[
                  { id: "profile", label: "Personal Info", icon: User },
                  { id: "addresses", label: "Addresses", icon: MapPin },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all  cursor-pointer ${
                      activeTab === item.id
                        ? "bg-blue-500 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              {activeTab === "profile" && (
                <ProfileTab
                  userData={userData}
                  setUserData={setUserData}
                  onSave={updateProfile}
                  onImageUpload={handleImageUpload}
                  saving={saving}
                />
              )}

              {activeTab === "addresses" && (
                <AddressesTab
                  addresses={addresses}
                  onAddAddress={() => setShowAddressForm(true)}
                  onEditAddress={setEditingAddress}
                  onDeleteAddress={deleteAddress}
                />
              )}

            

            

              {activeTab === "security" && <SecurityTab />}
              {activeTab === "orders" && <OrdersTab />}
            </div>
          </div>
        </div>
      </div>

      {(showAddressForm || editingAddress) && (
        <AddressFormModal
          address={editingAddress}
          onSave={saveAddress}
          onClose={() => {
            setShowAddressForm(false);
            setEditingAddress(null);
          }}
        />
      )}
    </div>
  );
};

const ProfileTab = ({
  userData,
  setUserData,
  onSave,
  onImageUpload,
  saving,
}) => (
  <div className="p-8">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
      <button
        onClick={onSave}
        disabled={saving}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer font-semibold hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
      >
        <Save size={20} />
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-black text-4xl font-bold mb-4 mx-auto overflow-hidden">
              {userData.profileImage?.url ? (
                <img
                  src={userData.profileImage.url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                userData.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>
            <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <Camera size={16} className="text-gray-600" />
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">Click camera to upload photo</p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={userData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={userData.dateOfBirth}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    dateOfBirth: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AddressesTab = ({
  addresses,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
}) => (
  <div className="p-8">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
      <button
        onClick={onAddAddress}
        className="bg-blue-500  cursor-pointer text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center gap-2"
      >
        <Plus size={20} />
        Add New Address
      </button>
    </div>

    {addresses.length === 0 ? (
      <div className="text-center py-12">
        <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No addresses yet
        </h3>
        <p className="text-gray-500 mb-6">
          Add your first address to make ordering easier!
        </p>
        <button
          onClick={onAddAddress}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all"
        >
          Add Your First Address
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address._id}
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    address.isDefault
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {address.label} {address.isDefault && "• Default"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditAddress(address)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDeleteAddress(address._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-gray-900">
                {address.street}
                {address.apartment && `, ${address.apartment}`}
              </p>
              <p className="text-gray-600">
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p className="text-gray-500 text-sm">{address.country}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);





const SecurityTab = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-8">Security Settings</h2>
    <div className="space-y-6">
      <div className="p-6 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Change Password</h3>
        <p className="text-gray-600 mb-4">
          Update your password to keep your account secure
        </p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all">
          Change Password
        </button>
      </div>

      <div className="p-6 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">
          Two-Factor Authentication
        </h3>
        <p className="text-gray-600 mb-4">
          Add an extra layer of security to your account
        </p>
        <button className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all">
          Enable 2FA
        </button>
      </div>
    </div>
  </div>
);

const OrdersTab = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-8">Order History</h2>
    <div className="text-center py-12">
      <Clock size={64} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        No orders yet
      </h3>
      <p className="text-gray-500">Your order history will appear here</p>
    </div>
  </div>
);

const AddressFormModal = ({ address, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    label: address?.label || "Home",
    street: address?.street || "",
    city: address?.city || "",
    state: address?.state || "",
    zipCode: address?.zipCode || "",
    country: address?.country || "United States",
    apartment: address?.apartment || "",
    isDefault: address?.isDefault || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">
            {address ? "Edit Address" : "Add New Address"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Label
            </label>
            <select
              value={formData.label}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, label: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, street: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder=""
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apartment/Suite (Optional)
            </label>
            <input
              type="text"
              value={formData.apartment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, apartment: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder=""
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder=""
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, state: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder=""
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, zipCode: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder=""
                required
              />
            </div>

         
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isDefault: e.target.checked,
                }))
              }
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">
              Set as default address
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all"
            >
              {address ? "Update Address" : "Add Address"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
