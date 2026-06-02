
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Home } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(location.search);
      const data = urlParams.get('data');
      const orderId = urlParams.get('orderId');

      if (data && orderId) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('https://food-order-app-beta-pink.vercel.app/api/payment/esewa/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ data: JSON.parse(decodeURIComponent(data)) })
          });

          const result = await response.json();
          if (result.success) {
            setOrder(result.order);
          } else {
            navigate('/payment-failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          navigate('/payment-failed');
        }
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Thank you for your payment. Your order is being processed.</p>
        
        {order && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order ID: #{order._id.substring(18, 24).toUpperCase()}</p>
            <p className="text-lg font-semibold text-green-600">${order.totalAmount.toFixed(2)}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/customer')}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;