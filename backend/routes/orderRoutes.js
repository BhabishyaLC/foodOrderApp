const express = require("express");
const Order = require("../models/order.js");
const Restaurant = require("../models/restaurant.js");
const Menu = require("../models/menu.js");
const { auth } = require("../middleware/auth.js");
const router = express.Router();


router.post('/create', auth, async (req, res) => {
  try {
    console.log(' ORDER CREATION REQUEST');
    console.log('User:', req.user.id);
    console.log('Request body:', req.body);

    const {
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      contactPhone
    } = req.body;

  
    if (!restaurantId || !items || !totalAmount || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }


    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      status: 'approved'
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found or not approved'
      });
    }

    console.log('✅ Restaurant verified:', restaurant.name);

  
    for (let item of items) {
      const menuItem = await Menu.findOne({
        _id: item.menuItemId,
        restaurant: restaurantId,
        isAvailable: true
      });

      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: `Item "${item.name}" is not available or not found`
        });
      }
    }

    console.log('✅ All menu items verified');

    
    const order = new Order({
      customer: req.user.id,
      restaurant: restaurantId,
      items: items.map(item => ({
        menuItem: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || 'card',
      contactPhone: contactPhone || req.user.phone,
      status: 'pending'
    });

    await order.save();
    console.log('✅ Order saved:', order._id);

   
   const savedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('restaurant', 'name');

    res.json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder 
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});


router.put('/confirm/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    
    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed. Cannot confirm order.'
      });
    }

    
    order.status = 'confirmed';
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('customer')
      .populate('restaurant');

    res.json({
      success: true,
      message: 'Order confirmed successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Order confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming order'
    });
  }
});
router.get("/customer/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user.id,
    })
      .populate("restaurant", "name cuisine image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
});

router.get("/restaurant/my-orders", auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      owner: req.user.id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const orders = await Order.find({
      restaurant: restaurant._id,
    })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching restaurant orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
});

router.patch("/restaurant/update-status/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const restaurant = await Restaurant.findOne({
      owner: req.user.id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const order = await Order.findOneAndUpdate(
      {
        _id: id,
        restaurant: restaurant._id,
      },
      { status },
      { new: true }
    ).populate("customer", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
    });
  }
});

router.delete("/restaurant/delete/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      owner: req.user.id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const order = await Order.findOneAndDelete({
      _id: id,
      restaurant: restaurant._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting menu item",
    });
  }
});

router.post('/create-pending', auth, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      customer: req.user.id,
      status: 'payment_pending', 
      paymentStatus: 'pending',
      paymentMethod: req.body.paymentMethod || 'card'
    });

    await order.save();

    const savedOrder = await Order.findById(order._id)
      .populate('customer')
      .populate('restaurant');

    res.json({
      success: true,
      message: 'Pending order created',
      order: savedOrder
    });
  } catch (error) {
    console.error('Pending order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating pending order'
    });
  }
});
module.exports = router;
