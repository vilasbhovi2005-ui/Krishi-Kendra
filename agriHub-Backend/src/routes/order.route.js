const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById } = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.route('/')
  .post(verifyToken, createOrder);

router.route('/myorders')
  .get(verifyToken, getMyOrders);

router.route('/:id')
  .get(verifyToken, getOrderById);

module.exports = router;
