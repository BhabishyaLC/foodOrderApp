
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/Context";
import {
  ArrowLeft,
  MapPin,
  Phone,
  CreditCard,
  Clock,
  CheckCircle,
  Edit3,
  Truck,
  Shield,
  Star,
} from "lucide-react";
import PaymentMethod from "./Payment";

const CheckoutPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [currentStep, setCurrentStep] = useState("payment");

  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paidOrderId, setPaidOrderId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('esewa');

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchPaidOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/order/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrderData(data.order);
      }
    } catch (error) {
      console.error("Error fetching paid order:", error);
    }
  };
  useEffect(() => {
   
    const urlParams = new URLSearchParams(location.search);
    const paymentSuccess = urlParams.get("payment_success");
    const orderId = urlParams.get("orderId");

    if (paymentSuccess === "true" && orderId) {
      setPaidOrderId(orderId);
      setPaymentVerified(true);
      setCurrentStep("confirmation");

    
      fetchPaidOrderDetails(orderId);
    } else {
     
      const orderFromState = location.state?.orderData;
      const orderFromStorage = JSON.parse(localStorage.getItem("pendingOrder"));

      if (orderFromState) {
        setOrderData(orderFromState);
        localStorage.setItem("pendingOrder", JSON.stringify(orderFromState));
      } else if (orderFromStorage) {
        setOrderData(orderFromStorage);
      } else {
        navigate("/customer");
        return;
      }
    }
    fetchUserProfile()
  }, [location, navigate]);

   const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setPaymentVerified(false);
    setPaidOrderId(null);

    if(method==='cash'){
      setCurrentStep('confirmation')
    }
  };

   const handlePaymentSuccess = (paymentResult) => {
    setPaymentVerified(true);
    setPaidOrderId(paymentResult.orderId);
    setCurrentStep("confirmation");
  };

 const handleConfirmOrder = async () => {
 
  if (selectedPaymentMethod === 'esewa' && !paymentVerified) {
    alert('Please complete payment first before confirming your order.');
    return;
  }


  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/order/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...orderData,
        customer: currentUser?.id,
        restaurant: orderData.restaurantId,
        paymentMethod: selectedPaymentMethod, 
        paymentStatus: selectedPaymentMethod === 'cash' ? 'pending' : 'paid',
        status: 'confirmed'
      })
    });

    const data = await response.json();
   

    if (data.success) {
      localStorage.removeItem('pendingOrder');
      navigate('/order_placed', { 
        state: { order: data.order } 
      });
    } else {
      alert(`Failed to place order: ${data.message}`);
    }
  } catch (error) {
    console.error('Order creation error:', error);
    alert('Error placing order. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const createOrder = async (paymentMethod, orderId = null) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const orderData = {
        ...orderData,
        customer: currentUser?.id,
        restaurant: orderData.restaurantId,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
        status: 'confirmed'
      };

     
      const url = orderId ? `http://localhost:5000/api/order/confirm/${orderId}` : 'http://localhost:5000/api/order/create';
      const method = orderId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem('pendingOrder');
        navigate('/order-success', { 
          state: { order: data.order } 
        });
      } else {
        alert(`Failed to place order: ${data.message}`);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  const handleEditAddress = () => {
    navigate("/profile", { state: { fromCheckout: true } });
  };
  

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const defaultAddress =
    userProfile?.addresses?.find((addr) => addr.isDefault) ||
    userProfile?.addresses?.[0];
  const subtotal = orderData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 50;

  const total = subtotal + deliveryFee ;

  return (
    <div className="min-h-screen">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="relative z-10">
        <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-white/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Cart</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Truck size={24} />
                    Delivery Information
                  </h2>
                  <button
                    onClick={handleEditAddress}
                    className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                </div>

                {defaultAddress ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin
                        className="text-green-400 mt-1 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <p className="text-white font-semibold">
                          {defaultAddress.label}
                        </p>
                        <p className="text-gray-200">
                          {defaultAddress.street}
                          {defaultAddress.apartment &&
                            `, ${defaultAddress.apartment}`}
                        </p>
                        <p className="text-gray-300">
                          {defaultAddress.city}, {defaultAddress.state}{" "}
                          {defaultAddress.zipCode}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {defaultAddress.country}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone
                        className="text-blue-400 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <p className="text-white font-semibold">
                          Contact Number
                        </p>
                        <p className="text-gray-200">
                          {userProfile?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-300 mb-3">
                      No delivery address found
                    </p>
                    <button
                      onClick={handleEditAddress}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Add Delivery Address
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.image}</span>
                        <div>
                          <h3 className="font-semibold text-white">
                            {item.name}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">
                          Rs {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Rs {item.price} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4">

              {currentStep==='payment' && (
                 <PaymentMethod
                  order={orderData}
                  selectedPaymentMethod={selectedPaymentMethod}
                 onPaymentMethodSelect={setSelectedPaymentMethod}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              )}
               
              </div>
            </div>

            <div className="lg:col-span-1 w-72">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-4">
                  Order Total
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-200">
                    <span>Subtotal</span>
                    <span>Rs {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-200">
                    <span>Delivery Fee</span>
                    <span>RS {deliveryFee.toFixed(2)}</span>
                  </div>
                
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>Total</span>
                      <span>Rs {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6 p-3 bg-white/5 rounded-lg">
                  <Clock className="text-orange-400" size={20} />
                  <div>
                    <p className="text-white font-semibold">
                      Estimated Delivery
                    </p>
                    <p className="text-gray-300 text-sm">25-35 minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6 text-sm text-gray-300">
                  <Shield size={16} className="text-green-400" />
                  <span>Secure & encrypted payment</span>
                </div>

                <button
                  onClick={handleConfirmOrder}
                  disabled={loading || !defaultAddress}
                  className="w-full bg-gradient-to-r bg-orange-500 from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Confirm Order
                    </>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-gray-300 text-sm flex items-center justify-center gap-1">
                    <Star size={14} className="text-yellow-400" />
                    Satisfaction guaranteed or your money back
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
