const OrderModel = require('../models/order.model');
const ProductModel = require('../models/product.model');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Verify stock and calculate total amount
    for (const item of items) {
      const product = await ProductModel.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
      }

      totalAmount += product.price * item.quantity;
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price // Snapshot price
      });

      // Reduce stock (simple approach, in a real app might need transactions)
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new OrderModel({
      buyer: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating order', error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ buyer: req.user._id }).populate('items.product', 'title image');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching orders', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate('buyer', 'fullName email')
      .populate('items.product', 'title image price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the user is the buyer (could also allow sellers to see their part of orders in future)
    if (order.buyer._id.toString() !== req.user._id.toString() && req.user.role !== 'seller') {
       return res.status(401).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching order', error: error.message });
  }
};

// @desc    Get orders for seller's products
// @route   GET /api/orders/seller/myorders
// @access  Private
const getSellerOrders = async (req, res) => {
  try {
    // Find all products owned by the seller
    const myProducts = await ProductModel.find({ seller: req.user._id }).select('_id');
    const productIds = myProducts.map(p => p._id);

    // Find orders that contain any of these products
    const orders = await OrderModel.find({ 'items.product': { $in: productIds } })
      .populate('buyer', 'fullName email')
      .populate('items.product', 'title image price seller')
      .sort({ createdAt: -1 });

    // Filter order items to only include the seller's products and calculate seller's total
    const sellerOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(item => 
        item.product.seller && item.product.seller.toString() === req.user._id.toString()
      );
      
      // Calculate total amount for this seller's products in the order
      orderObj.sellerTotal = orderObj.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      return orderObj;
    });

    res.json(sellerOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching seller orders', error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders
};
