
const express = require('express');
const router = express.Router();
const { initiateEsewaPayment, verifyEsewaPayment } = require('../controllers/paymentController.js');
const {auth} = require('../middleware/auth.js');

router.post('/esewa/initiate', auth, initiateEsewaPayment);
router.post('/esewa/verify', auth, verifyEsewaPayment);

module.exports = router;