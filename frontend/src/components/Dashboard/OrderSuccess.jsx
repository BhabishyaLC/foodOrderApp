
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, ArrowLeft } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No order data found.</p>
          <button 
            onClick={() => navigate('/customer')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Order Confirmed! 🎉
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Thank you for your order! We're preparing your food.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="space-y-4 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-semibold">{order._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold">Rs {order.totalAmount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-orange-500" />
              <span className="text-gray-600">Estimated Delivery:</span>
              <span className="font-semibold">25-35 minutes</span>
            </div>
          </div>
        </div>

        <div className="space-x-4">
        
          <button 
            onClick={() => navigate('/customer')}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;