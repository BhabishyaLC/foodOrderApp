import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Clock,
  Star,
  MapPin,
  Loader,
  Heart,
  Navigation,
} from "lucide-react";

const CustomerDashboard = () => {
  const { currentUser } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [cartVisible, setCartVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurantMenu, setRestaurantMenu] = useState([]);

  const navigate = useNavigate();
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      

      const response = await fetch(
        "http://localhost:5000/api/restaurant/approved"
      );
      const data = await response.json();

      if (data.success) {
      
        setRestaurants(data.restaurants);
      } else {
        console.error("Failed to fetch restaurants");
      }
    } catch (error) {
      console.error("❌ Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantMenu = async (restaurantId) => {
    try {
    

      const response = await fetch(
        `http://localhost:5000/api/restaurant/${restaurantId}/menu`
      );
      const data = await response.json();

      if (data.success) {
       
        return data.menuItems;
      }
      return [];
    } catch (error) {
      console.error("❌ Error fetching menu:", error);
      return [];
    }
  };

  const createOrder = async (orderData) => {
    try {
      const token = localStorage.getItem("token");
     

      const response = await fetch("http://localhost:5000/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
     
      return data;
    } catch (error) {
     
      return {
        success: false,
        message: "Network error while creating order",
      };
    }
  };

  const addToCart = (item, restaurant) => {
    if (cart.length > 0 && cart[0].restaurantId !== restaurant._id) {
      if (
        window.confirm(
          "Your cart contains items from another restaurant. Would you like to clear the cart and add this item?"
        )
      ) {
        setCart([]);
      } else {
        return;
      }
    }

    const cartItem = {
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      quantity: 1,
    };

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, cartItem];
      }
    });
  };

  const updateQuantity = (itemId, change) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item._id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
      
        return null;
      }

      console.log("Fetching user profile...");

      const response = await fetch("http://localhost:5000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
       
        return data.user;
      } else {
        
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      const userProfile = await fetchUserProfile();

      if (!userProfile?.addresses?.length) {
        alert("Please add a delivery address in your profile before ordering.");
        navigate("/profile");
        return;
      }

      if (!userProfile?.phone) {
        alert(
          "Please add your phone number in your profile for order updates."
        );
        navigate("/profile");
        return;
      }

      const defaultAddress =
        userProfile.addresses.find((addr) => addr.isDefault) ||
        userProfile.addresses[0];
      const deliveryAddress = `${defaultAddress.street}${
        defaultAddress.apartment ? ", " + defaultAddress.apartment : ""
      }, ${defaultAddress.city}, ${defaultAddress.state} ${
        defaultAddress.zipCode
      }`;

      const orderData = {
        restaurantId: cart[0].restaurantId,
        items: cart.map((item) => ({
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: getTotalPrice(),
        deliveryAddress: deliveryAddress,
        paymentMethod: "card",
        contactPhone: userProfile.phone,
      };

      navigate("/checkout", { state: { orderData } });
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error preparing checkout. Please try again.");
    }
  };

  const handleRestaurantClick = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    const menu = await fetchRestaurantMenu(restaurant._id);
    setRestaurantMenu(menu);
  };

  const categories = [
    { id: "all", name: "All", icon: "🍽️" },
    { id: "indian", name: "Indian", icon: "🍛" },
    { id: "italian", name: "Italian", icon: "🍕" },
    { id: "japanese", name: "Japanese", icon: "🍣" },
    { id: "chinese", name: "Chinese", icon: "🥡" },
    { id: "mexican", name: "Mexican", icon: "🌮" },
    { id: "american", name: "American", icon: "🍔" },
  ];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      restaurant.cuisine.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const CartSidebar = () => (
    <div
      className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform ${
        cartVisible ? "translate-x-0" : "translate-x-full"
      } z-50`}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
          <button
            onClick={() => setCartVisible(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {cart.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Ordering from: <strong>{cart[0]?.restaurantName}</strong>
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Your cart is empty</p>
              <p className="text-sm mt-2">
                Add some delicious items to get started!
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 border-b"
              >
                <span className="text-2xl">{item.image}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-orange-500 font-semibold">
                    Rs {item.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item._id, -1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, 1)}
                    className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t pt-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">
                  Rs {getTotalPrice().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Delivery Fee:</span>
                <span>Rs 50</span>
              </div>

              <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                <span>Total:</span>
                <span className="text-orange-500">
                  Rs {(getTotalPrice() + 50).toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r bg-orange-500 from-orange-500 to-red-500 text-black py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
            >
              🍕 Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader size={48} className="animate-spin mx-auto mb-4" />
          <p>Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="relative z-10">
        <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-3xl">🍔</span>
                <h1 className="ml-2 text-2xl font-bold text-gray-800">
                  FoodieExpress
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-orange-500 rounded-full px-3 py-1 backdrop-blur-sm cursor-pointer transition-all transform hover:scale-105 ">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center cursor-pointer ">
                    <User size={16} className="text-black" />
                  </div>
                  <Link to="/profile">
                    <button>
                      <span className="text-sm font-medium text-white cursor-pointer">
                        {currentUser?.name}
                      </span>
                    </button>
                  </Link>
                </div>

                <button
                  onClick={() => setCartVisible(true)}
                  className="relative p-2 text-gray-600 transition-colors rounded-full backdrop-blur-sm bg-green-200 border-4 cursor-pointer"
                >
                  <ShoppingCart size={24} className=" hover:text-orange-500" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="text-center py-16 text-white grid justify-center">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            Craving Something{" "}
            <span className="text-orange-400">Delicious?</span>
          </h1>
          <p className="text-xl mb-8 drop-shadow-md opacity-90">
            Discover the best restaurants in your area and get food delivered to
            your doorstep
          </p>
          <div className=" flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for restaurants"
                className="w-full pl-10 pr-4 py-3 text-black border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/95 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-lg">
              Restaurants
            </h2>

            {filteredRestaurants.length === 0 ? (
              <div className="text-center text-white py-12">
                <p className="text-xl">
                  No restaurants found matching your criteria.
                </p>
                <p className="text-gray-300 mt-2">
                  Try changing your search or category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                    onAddToCart={addToCart}
                    onViewMenu={handleRestaurantClick}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {selectedRestaurant && (
          <RestaurantMenuModal
            restaurant={selectedRestaurant}
            menuItems={restaurantMenu}
            onAddToCart={addToCart}
            onClose={() => {
              setSelectedRestaurant(null);
              setRestaurantMenu([]);
            }}
          />
        )}

        <CartSidebar />

        {cartVisible && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setCartVisible(false)}
          />
        )}
      </div>
    </div>
  );
};

const RestaurantCard = ({ restaurant, onAddToCart, onViewMenu }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);

  const fetchMenu = async () => {
    setLoadingMenu(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/restaurant/${restaurant._id}/menu`
      );
      const data = await response.json();

      if (data.success) {
        setMenuItems(data.menuItems.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [restaurant._id]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 border border-white/20">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br flex items-center justify-center relative overflow-hidden">
          {restaurant.images ? (
            <img
               src={`http://localhost:5000${restaurant.images}`}
              alt={restaurant.name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <span className="text-6xl z-10">🍽️</span>
          )}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
          OPEN
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white">{restaurant.name}</h3>
          <div className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm">
            <Star size={14} fill="currentColor" />
            <span>{restaurant.rating || 4.0}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{restaurant.cuisine}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{restaurant.deliveryTime || "30-40 min"}</span>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {restaurant.description}
        </p>

        {loadingMenu ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {menuItems.slice(0, 2).map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.image}</span>
                  <div>
                    <h4 className="font-semibold text-white text-sm">
                      {item.name}
                    </h4>
                    <p className="text-orange-300 font-semibold text-sm">
                      Rs {item.price}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onAddToCart(item, restaurant)}
                  className="cursor-pointer bg-gradient-to-r bg-orange-500 hover:bg-green-500  text-white px-3 py-1 rounded-lg  transition-all transform hover:scale-105 shadow-md text-sm"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => onViewMenu(restaurant)}
          className="cursor-pointer w-full text-orange-300 hover:text-orange-200 font-semibold py-2 border border-orange-400 rounded-lg hover:bg-orange-500/20 transition-all backdrop-blur-sm"
        >
          View Full Menu
        </button>
      </div>
    </div>
  );
};

const RestaurantMenuModal = ({
  restaurant,
  menuItems,
  onAddToCart,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
        <div className="p-6 border-b border-white/20 sticky top-0 bg-gray-900 z-10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {restaurant.name}
              </h3>

              <p className="text-gray-300 text-sm mt-1">
                {restaurant.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl p-2"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {category === "all" ? "All Items" : category}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>No menu items found in this category.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 rounded-lg transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-3xl">{item.image}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-lg">
                        {item.name}
                      </h4>
                      <p className="text-gray-400 text-sm mt-1">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.ingredients
                          ?.slice(0, 3)
                          .map((ingredient, index) => (
                            <span
                              key={index}
                              className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-xs"
                            >
                              {ingredient}
                            </span>
                          ))}
                      </div>
                      <p className="text-orange-400 font-semibold text-lg mt-2">
                        Rs {item.price}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Prep: {item.preparationTime}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onAddToCart(item, restaurant);
                      onClose();
                    }}
                    disabled={!item.isAvailable}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 cursor-pointer ${
                      item.isAvailable
                        ? "bg-gradient-to-r bg-orange-500 text-white hover:bg-green-500 "
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {item.isAvailable ? "Add to Cart" : "Unavailable"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
