import React, { useState } from "react";
import { Wallet, Shield, CheckCircle } from "lucide-react";


const PaymentMethod = ({ 
  order, 
  selectedPaymentMethod, 
  onPaymentMethodSelect, 
  onPaymentSuccess 
}) => {
  const [loading, setLoading] = useState(false);


   
  const redirectToEsewa = (paymentData, esewaUrl) => {
    console.log('🚀 Redirecting to eSewa with data:', paymentData);
    

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = esewaUrl;

    Object.keys(paymentData).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = paymentData[key];
      form.appendChild(input);
    });

    
    document.body.appendChild(form);
    form.submit();
  };

  const handleEsewaPayment = async () => {
    if (!order) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
     
      const orderResponse = await fetch('http://localhost:5000/api/order/create-pending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: order.items,
          totalAmount: order.totalAmount,
          restaurant: order.restaurantId,
          deliveryAddress: order.deliveryAddress,
          contactPhone: order.contactPhone,
          paymentMethod: 'esewa',
          status: 'payment_pending'
        })
      });

     
      

      const orderData = await orderResponse.json();

       console.log(orderData);

      if (!orderData.success) {
        throw new Error(orderData.message);
      }

      const pendingOrder = orderData.order;

  
      const paymentResponse = await fetch('http://localhost:5000/api/payment/esewa/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId: pendingOrder._id })
      });

      const paymentData = await paymentResponse.json();

      if (paymentData.success) {
       
        onPaymentSuccess({
          orderId: pendingOrder._id,
          paymentData: paymentData.paymentData
        });
        
       
        redirectToEsewa(paymentData.paymentData, paymentData.esewaUrl);
      } else {
        alert(`Payment initiation failed: ${paymentData.message}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Error processing payment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCashOnDelivery = () => {
    
    onPaymentSuccess({
      orderId: null, 
      paymentMethod: 'cash'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
      
      <div className="space-y-4">
       
        <div 
          className={`border-2 rounded-lg p-4 cursor-pointer ${
            selectedPaymentMethod === 'esewa' ? 'border-green-500 bg-green-50' : 'border-gray-300'
          }`}
          onClick={() => onPaymentMethodSelect('esewa')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">eSewa</span>
              </div>
              <div>
                <p className="font-semibold">eSewa Wallet</p>
                <p className="text-gray-600 text-sm">Pay now with eSewa</p>
              </div>
            </div>
            <input 
              type="radio" 
              checked={selectedPaymentMethod === 'esewa'}
              onChange={() => {}} 
              className="h-5 w-5 text-green-500"
            />
          </div>
        </div>

 
        <div 
          className={`border-2 rounded-lg p-4 cursor-pointer ${
            selectedPaymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onClick={() => onPaymentMethodSelect('cash')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">COD</span>
              </div>
              <div>
                <p className="font-semibold">Cash on Delivery</p>
                <p className="text-gray-600 text-sm">Pay when you receive your order</p>
              </div>
            </div>
            <input 
              type="radio" 
              checked={selectedPaymentMethod === 'cash'}
              onChange={() => {}} 
              className="h-5 w-5 text-blue-500"
            />
          </div>
        </div>
      </div>

    
      <div className="mt-6">
        {selectedPaymentMethod === 'esewa' ? (
          <button
            onClick={handleEsewaPayment}
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              'Pay with eSewa'
            )}
          </button>
        ) : (
          <button
          disabled
            onClick={handleCashOnDelivery}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors cursor-not-allowed"
          >
            Click on "Confirm Order"
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
