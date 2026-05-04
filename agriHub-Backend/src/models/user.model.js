const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['farmer', 'seller'],
    default: 'farmer'
  }
}, { 
  timestamps: true 
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;