const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/payment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/create-order', verifyToken, createRazorpayOrder);
router.post('/verify-payment', verifyToken, verifyRazorpayPayment);

module.exports = router;
