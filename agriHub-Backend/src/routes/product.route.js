const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
} = require('../controllers/product.controller');
const { verifyToken, isSeller } = require('../middleware/auth.middleware');

router.route('/')
  .get(getProducts)
  .post(verifyToken, isSeller, createProduct);

router.route('/seller/myproducts')
  .get(verifyToken, isSeller, getMyProducts);

router.route('/:id')
  .get(getProductById)
  .put(verifyToken, isSeller, updateProduct)
  .delete(verifyToken, isSeller, deleteProduct);

module.exports = router;
