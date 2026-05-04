const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Seeds', 'Fertilizers', 'Pesticides', 'Machinery', 'Tools', 'Other']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=AgriHub+Product'
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
