
const express = require('express');
const Restaurant = require('../models/restaurant');
const User = require('../models/customer');
const router = express.Router();


router.get('/restaurants', async (req, res) => {
  try {
    console.log('🔍 Admin: Fetching restaurants...');
    
    const pending = await Restaurant.find({ status: 'pending' })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    const approved = await Restaurant.find({ status: 'approved' })
      .populate('owner', 'name email')
      .sort({ updatedAt: -1 });

    console.log('📊 Admin: Found restaurants -');
    console.log('   Pending:', pending.length);
    console.log('   Approved:', approved.length);

    res.json({
      success: true,
      pending,
      approved
    });

  } catch (error) {
    console.error('Admin restaurants error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching restaurants' 
    });
  }
});


router.put('/restaurants/:id/approve', async (req, res) => {
  try {
    console.log('Admin: Approving restaurant:', req.params.id);
    
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ 
        success: false,
        message: 'Restaurant not found' 
      });
    }

    const owner = await User.findById(restaurant.owner);

    
    restaurant.status = 'approved';
    await restaurant.save();

   
    if (owner) {
      await User.findByIdAndUpdate(restaurant.owner, {
        role: 'restaurant_owner',
        restaurantStatus: 'approved'
      });
    }

    console.log('Restaurant approved successfully');

    res.json({ 
      success: true,
      message: 'Restaurant approved successfully',
      restaurant: {
        ...restaurant.toObject(),
        owner: owner ? { 
          _id: owner._id, 
          name: owner.name, 
          email: owner.email 
        } : null
      }
    });
    
  } catch (error) {
    console.error('Approve restaurant error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error approving restaurant' 
    });
  }
});


router.put('/restaurants/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    console.log('Admin: Rejecting restaurant:', req.params.id);
    
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ 
        success: false,
        message: 'Restaurant not found' 
      });
    }

    const owner = await User.findById(restaurant.owner);

 
    restaurant.status = 'rejected';
    restaurant.rejectionReason = reason;
    await restaurant.save();

   
    if (owner) {
      await User.findByIdAndUpdate(restaurant.owner, {
        role: 'customer',
        restaurantStatus: 'rejected',
        rejectionReason: reason
      });
    }

    console.log('Restaurant rejected successfully');

    res.json({ 
      success: true,
      message: 'Restaurant rejected successfully',
      restaurant: {
        ...restaurant.toObject(),
        owner: owner ? { 
          _id: owner._id, 
          name: owner.name, 
          email: owner.email 
        } : null
      }
    });
  } catch (error) {
    console.error('Reject restaurant error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error rejecting restaurant' 
    });
  }
});

module.exports = router;