const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getSellerOrders } = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.route('/')
  .post(verifyToken, createOrder);

router.route('/myorders')
  .get(verifyToken, getMyOrders);

router.route('/seller/myorders')
  .get(verifyToken, getSellerOrders);

router.route('/:id')
  .get(verifyToken, getOrderById);

module.exports = router;
