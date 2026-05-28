import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/Context";
import {
  Plus,
  Edit3,
  Trash2,
  Package,
  DollarSign,
  Clock,
  Users,
  BarChart3,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  Loader,
  RefreshCw,
} from "lucide-react";

const RestaurantDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    popularItems: [],
  });

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

     

      const restaurantRes = await fetch(
        "http://localhost:5000/api/restaurant/owner/my-restaurant",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const restaurantData = await restaurantRes.json();

      if (restaurantData.success) {
       
        setRestaurant(restaurantData.restaurant);

        await fetchMenuItems(token);

        await fetchOrders(token);

        calculateStats(restaurantData.restaurant);
      } else {
        console.error("No restaurant found for user");
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async (token) => {
    try {
      const menuRes = await fetch(
        "http://localhost:5000/api/menu/restaurant/my-menu",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const menuData = await menuRes.json();

      if (menuData.success) {
        console.log(`✅ Found ${menuData.menuItems.length} menu items`);
        setMenuItems(menuData.menuItems);
      }
    } catch (error) {
      console.error("❌ Error fetching menu items:", error);
    }
  };

  const fetchOrders = async (token) => {
    try {
      const ordersRes = await fetch(
        "http://localhost:5000/api/order/restaurant/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const ordersData = await ordersRes.json();

      if (ordersData.success) {
        console.log(`✅ Found ${ordersData.orders.length} orders`);
        setOrders(ordersData.orders);
      }
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  };

  const calculateStats = (restaurantData) => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) =>
      ["pending", "confirmed", "preparing"].includes(order.status)
    ).length;
    const revenue = orders
      .filter((order) => order.status === "delivered")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const itemCount = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity;
      });
    });

    const popularItems = Object.entries(itemCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name]) => name);

    setStats({
      totalOrders,
      pendingOrders,
      revenue,
      popularItems,
    });
  };

  const addMenuItem = async (itemData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/menu/restaurant/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMenuItems((prev) => [...prev, data.menuItem]);
        setShowAddItemModal(false);
        return true;
      }
      alert("Failed to add menu item: " + data.message);
      return false;
    } catch (error) {
      console.error("❌ Error adding menu item:", error);
      alert("Network error while adding menu item");
      return false;
    }
  };

  const updateMenuItem = async (itemId, itemData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/menu/restaurant/update/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMenuItems((prev) =>
          prev.map((item) => (item._id === itemId ? data.menuItem : item))
        );
        setEditingItem(null);
        setShowAddItemModal(false);
        return true;
      }
      alert("Failed to update menu item: " + data.message);
      return false;
    } catch (error) {
      console.error("❌ Error updating menu item:", error);
      alert("Network error while updating menu item");
      return false;
    }
  };

  const deleteMenuItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this menu item?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/menu/restaurant/delete/${itemId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.success) {
        setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
        return true;
      }
      alert("Failed to delete menu item: " + data.message);
      return false;
    } catch (error) {
      console.error("❌ Error deleting menu item:", error);
      alert("Network error while deleting menu item");
      return false;
    }
  };
  const deleteOrderItem = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this menu item?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/order/restaurant/delete/${orderId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.success) {
        setOrders((prev) => prev.filter((item) => item._id !== orderId));
        return true;
      }
      alert("Failed to delete menu item: " + data.message);
      return false;
    } catch (error) {
      console.error("❌ Error deleting menu item:", error);
      alert("Network error while deleting menu item");
      return false;
    }
  };

  const toggleAvailability = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/menu/restaurant/toggle-availability/${itemId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.success) {
        setMenuItems((prev) =>
          prev.map((item) => (item._id === itemId ? data.menuItem : item))
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Error toggling availability:", error);
      return false;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/order/restaurant/update-status/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) => (order._id === orderId ? data.order : order))
        );

        fetchRestaurantData();
        return true;
      }
      alert("Failed to update order status: " + data.message);
      return false;
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      alert("Network error while updating order status");
      return false;
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader size={48} className="animate-spin mx-auto mb-4" />
          <p>Loading your restaurant dashboard...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Restaurant Found</h2>
          <p className="text-gray-400 mb-4">
            You don't have an approved restaurant yet.
          </p>
          <button
            onClick={() => (window.location.href = "/restaurant_form")}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all"
          >
            Apply for Restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
   
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="relative z-10 flex">
      
        <div className="w-64 bg-black/80 backdrop-blur-md text-white min-h-screen p-6 border-r border-white/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-xl">{restaurant.image || "🍽️"}</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">{restaurant.name}</h1>
              <p className="text-orange-400 text-sm">{restaurant.cuisine}</p>
              <p className="text-green-400 text-xs">✓ Approved</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "menu", label: "Menu Management", icon: Package },
              { id: "orders", label: "Orders", icon: Users },
              { id: "analytics", label: "Analytics", icon: DollarSign },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all  cursor-pointer ${
                  activeTab === item.id
                    ? "bg-orange-500 text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3  cursor-pointer px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-all border border-white/10"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-screen overflow-y-auto">
          <header className="bg-white/95 backdrop-blur-md border-b border-white/20 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 capitalize">
                  {activeTab.replace("-", " ")}
                </h1>
                <p className="text-gray-600">
                  Welcome back, {currentUser?.name}!
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={fetchRestaurantData}
                  className="flex items-center gap-2  cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Today's Revenue</p>
                  <p className="text-lg font-bold text-green-600">
                    Rs {stats.revenue.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center border-4 border-green-500">
                  <span className="text-black font-semibold">
                    {currentUser?.name?.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6">
            {activeTab === "dashboard" && (
              <DashboardView
                stats={stats}
                orders={orders}
                restaurant={restaurant}
              />
            )}
            {activeTab === "menu" && (
              <MenuManagement
                menuItems={menuItems}
                onAddItem={addMenuItem}
                onEditItem={setEditingItem}
                onDeleteItem={deleteMenuItem}
                onToggleAvailability={toggleAvailability}
                showAddModal={showAddItemModal}
                setShowAddModal={setShowAddItemModal}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
                onUpdateItem={updateMenuItem}
              />
            )}
            {activeTab === "orders" && (
              <OrdersManagement
                orders={orders}
                onDeleteItem={deleteOrderItem}
                onUpdateStatus={updateOrderStatus}
              />
            )}
            {activeTab === "analytics" && (
              <AnalyticsView stats={stats} menuItems={menuItems} />
            )}
            {activeTab === "settings" && (
              <SettingsView restaurant={restaurant} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ stats, orders, restaurant }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300">Total Orders</p>
            <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Package className="text-blue-400" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300">Pending Orders</p>
            <p className="text-3xl font-bold text-white">
              {stats.pendingOrders}
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <Clock className="text-yellow-400" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300">Total Revenue</p>
            <p className="text-3xl font-bold text-white">
              Rs {stats.revenue.toFixed(2)}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
            <DollarSign className="text-green-400" size={24} />
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order,index) => (
            <div
              key={order._id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div>
                <p className="font-semibold text-white">
                  Order #{index+1}
                </p>
                <p className="text-gray-300 text-sm">
                  {order.customer?.name || "Customer"}
                </p>
                <p className="text-gray-400 text-xs">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">Rs {order.totalAmount}</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.status === "delivered"
                      ? "bg-green-500"
                      : order.status === "preparing"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  } text-white`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-gray-400 text-center py-4">No orders yet</p>
          )}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-64">
        <h2 className="text-xl font-bold text-white mb-4">Restaurant Info</h2>
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-sm">Name</label>
            <p className="text-white font-semibold">{restaurant.name}</p>
          </div>
         
          <div>
            <label className="text-gray-400 text-sm">Status</label>
            <p className="text-green-400 font-semibold">✓ Approved</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MenuManagement = ({
  menuItems,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleAvailability,
  showAddModal,
  setShowAddModal,
  editingItem,
  setEditingItem,
  onUpdateItem,
}) => {
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    ingredients: [],
    preparationTime: "15-20 min",
    isAvailable: true,
    image: "🍽️",
  });

  const [ingredientInput, setIngredientInput] = useState("");

  const categories = [
    "Appetizers",
    "Main Course",
    "Bread",
    "Rice",
    "Desserts",
    "Beverages",
    "Sides",
  ];

  const foodIcons = [
    "🍗",
    "🍚",
    "🫓",
    "🥭",
    "🍕",
    "🍔",
    "🌮",
    "🍣",
    "🍜",
    "🥗",
    "🍦",
    "☕",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = editingItem
      ? await onUpdateItem(editingItem._id, newItem)
      : await onAddItem(newItem);

    if (success) {
      setNewItem({
        name: "",
        description: "",
        price: "",
        category: "",
        ingredients: [],
        preparationTime: "15-20 min",
        isAvailable: true,
        image: "🍽️",
      });
    }
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setNewItem((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()],
      }));
      setIngredientInput("");
    }
  };

  const removeIngredient = (index) => {
    setNewItem((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    if (editingItem) {
      setNewItem(editingItem);
    }
  }, [editingItem]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Menu Management</h2>
        <button
          onClick={() => {
            setEditingItem(null);
            setNewItem({
              name: "",
              description: "",
              price: "",
              category: "",
              ingredients: [],
              preparationTime: "15-20 min",
              isAvailable: true,
              image: "🍽️",
            });
            setShowAddModal(true);
          }}
          className="bg-gradient-to-r  cursor-pointer from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Add Menu Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-orange-400/50 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.image}</span>
                <div>
                  <h3 className="font-bold text-white text-lg">{item.name}</h3>
                  <p className="text-orange-400 text-sm">{item.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditItem(item)}
                  className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDeleteItem(item._id)}
                  className="p-2 bg-red-500/20  cursor-pointer text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {item.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price:</span>
                <span className="text-green-400 font-semibold">
                 Rs {item.price}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Prep Time:</span>
                <span className="text-yellow-400">{item.preparationTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <button
                  onClick={() => onToggleAvailability(item._id)}
                  className={`flex items-center gap-1 ${
                    item.isAvailable ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.isAvailable ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  {item.isAvailable ? "Available" : "Unavailable"}
                </button>
              </div>
            </div>

            {item.ingredients && item.ingredients.length > 0 && (
              <div className="mb-3">
                <p className="text-gray-400 text-sm mb-2">Ingredients:</p>
                <div className="flex flex-wrap gap-1">
                  {item.ingredients.slice(0, 3).map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-white/10 text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {ingredient}
                    </span>
                  ))}
                  {item.ingredients.length > 3 && (
                    <span className="bg-white/10 text-gray-300 px-2 py-1 rounded text-xs">
                      +{item.ingredients.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {menuItems.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={24} className="text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Menu Items Yet
            </h3>
            <p className="text-gray-400">
              Add your first menu item to get started!
            </p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
            <div className="p-6 border-b border-white/20">
              <h3 className="text-2xl font-bold text-white">
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Food Icon
                  </label>
                  <select
                    value={newItem.image}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, image: e.target.value }))
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  >
                    {foodIcons.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Category
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    required
                  >
                    <option value="" className="text-black">
                      Select Category
                    </option>
                    {categories.map((cat) => (
                      <option className="text-black" key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Description
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  rows="3"
                  placeholder="Enter item description"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Price(Rs)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Preparation Time
                  </label>
                  <input
                    type="text"
                    value={newItem.preparationTime}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        preparationTime: e.target.value,
                      }))
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    placeholder="e.g., 15-20 min"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Ingredients
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    placeholder="Add ingredient"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addIngredient())
                    }
                  />
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newItem.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="text-orange-400 hover:text-orange-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newItem.isAvailable}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      isAvailable: e.target.checked,
                    }))
                  }
                  className="rounded bg-white/10 border-white/20"
                />
                <label className="text-gray-300 text-sm">
                  Available for ordering
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-all"
                >
                  {editingItem ? "Update Item" : "Add Item"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersManagement = ({ orders, onUpdateStatus, onDeleteItem }) => {
  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-500" },
    { value: "confirmed", label: "Confirmed", color: "bg-blue-500" },
    { value: "preparing", label: "Preparing", color: "bg-orange-500" },
    { value: "ready", label: "Ready", color: "bg-green-500" },
    { value: "delivered", label: "Delivered", color: "bg-gray-500" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Order Management</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={24} className="text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No Orders Yet
          </h3>
          <p className="text-gray-400">
            Orders from customers will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order,index) => (
            <div
              key={order._id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
            <div className=" text-green-600 font-bold">{order.paymentMethod.toUpperCase()}</div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Order #{index+1}
                  </h3>
                  <p className="text-orange-400">
                    {order.customer?.name || "Customer"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-white font-semibold text-lg">
                    Rs {order.totalAmount}
                  </p>
                  <p className="text-gray-300 text-sm">{order.contactPhone}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.image}</span>
                      <span className="text-gray-300">
                        {item.quantity}x {item.name}
                      </span>
                    </div>
                    <span className="text-green-400">
                      Rs {(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <select
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm cursor-pointer"
                >
                  {statusOptions.map((option) => (
                    <option
                      className=" text-black"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="text-gray-400 text-sm">
                  {order.deliveryAddress}
                </span>
                <button
                 className="p-2  cursor-pointer bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                  onClick={() => {
                    if (order && order._id) {
                      onDeleteItem(order._id);
                    } else {
                      console.error("Order object is not properly defined");
                    }
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const AnalyticsView = ({ stats, menuItems }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">Analytics & Insights</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Popular Items</h3>
        <div className="space-y-3">
          {stats.popularItems.length > 0 ? (
            stats.popularItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{item}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                      style={{ width: `${100 - index * 20}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-400 text-sm w-8">
                    {100 - index * 20}%
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No order data yet</p>
          )}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">
          Revenue Overview
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-300">Today</span>
            <span className="text-green-400 font-semibold">
              Rs {(stats.revenue * 0.3).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">This Week</span>
            <span className="text-green-400 font-semibold">
              Rs {stats.revenue.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">This Month</span>
            <span className="text-green-400 font-semibold">
              Rs {(stats.revenue * 4).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Menu Items Summary */}
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Menu Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{menuItems.length}</p>
          <p className="text-gray-400 text-sm">Total Items</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">
            {menuItems.filter((item) => item.isAvailable).length}
          </p>
          <p className="text-gray-400 text-sm">Available</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-400">
            {menuItems.filter((item) => !item.isAvailable).length}
          </p>
          <p className="text-gray-400 text-sm">Unavailable</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-400">
            {new Set(menuItems.map((item) => item.category)).size}
          </p>
          <p className="text-gray-400 text-sm">Categories</p>
        </div>
      </div>
    </div>
  </div>
);

// Settings View Component
const SettingsView = ({ restaurant }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">Restaurant Settings</h2>

    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">
        Restaurant Information
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Restaurant Name
            </label>
            <input
              type="text"
              defaultValue={restaurant.name}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            />
          </div>
         
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Description
          </label>
          <textarea
            defaultValue={restaurant.description}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Delivery Time
            </label>
            <input
              type="text"
              defaultValue={restaurant.deliveryTime}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              placeholder="e.g., 30-40 min"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Minimum Order
            </label>
            <input
              type="number"
              defaultValue={restaurant.minimumOrder || 0}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>

        <button className="bg-gradient-to-r bg-orange-500 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

export default RestaurantDashboard;
