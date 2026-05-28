
const crypto = require('crypto');
const Order = require('../models/order.js')
const generateEsewaPayload = (order, successUrl, failureUrl) => {
  const totalAmount = order.totalAmount.toFixed(2);
  const taxAmount = (order.totalAmount * 0.13).toFixed(2); 
  const amount = (order.totalAmount - taxAmount).toFixed(2);
  const uniquePid = `${order._id}_${Date.now()}`;
  const payload = {
    amt: totalAmount,
    psc: '0.00', 
    pdc: '0.00', 
    txAmt: taxAmount,
    tAmt: totalAmount,
    pid: uniquePid,
    scd: process.env.ESEWA_MERCHANT_CODE, 
    su: successUrl,
    fu: failureUrl
  };

  return payload;
};

const generateEsewaSignature = (message) => {
  const secret = process.env.ESEWA_SECRET_KEY;
  return crypto.createHmac('sha256', secret)
    .update(message)
    .digest('base64');
};


const initiateEsewaPayment = async (req, res) => {
     
  try {
    const { orderId } = req.body;
    console.log('🔍 Looking for order with ID:', orderId);

    const order = await Order.findById(orderId).populate('customer').populate('restaurant')
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }


    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

   const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const successUrl = `${baseUrl}/payment-success?orderId=${order._id}`;
  const failureUrl = `${baseUrl}/payment-failed?orderId=${order._id}`;

    const payload = generateEsewaPayload(order, successUrl, failureUrl);
    

    const message = `total_amount=${payload.tAmt},transaction_uuid=${payload.pid},product_code=${payload.scd}`;
    const signature = generateEsewaSignature(message);

    res.json({
      success: true,
      paymentData: {
        ...payload,
        signature: signature
      },
      esewaUrl: process.env.ESEWA_PAYMENT_URL
    });

  } catch (error) {
    console.error('eSewa payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating payment'
    });
  }
};



const verifyEsewaPayment = async (req, res) => {
  try {
    const { data } = req.body;
    
    
    const order = await Order.findById(data.transaction_uuid);
    
    if (data.status === 'COMPLETE') {
      
      order.paymentStatus = 'paid';
      order.status = 'pending'; 
      await order.save();

   
      const redirectUrl = `${process.env.CLIENT_URL}/checkout?payment_success=true&orderId=${order._id}`;
      
    
      res.send(`
        <html>
          <head>
            <title>Payment Successful</title>
            <meta http-equiv="refresh" content="0; url=${redirectUrl}" />
          </head>
          <body>
            <p>Payment successful! Redirecting...</p>
            <script>window.location.href = "${redirectUrl}";</script>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).send('Payment verification failed');
  }
};
  


module.exports = {
  initiateEsewaPayment,
  verifyEsewaPayment
};