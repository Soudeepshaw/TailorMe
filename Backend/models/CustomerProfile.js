const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique:true
  },
  profileImage: {
    type: String,
    default: 'default_customer.jpg'
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  address: {
    type: String,
    
  },
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CartItem'
  }]
}, { timestamps: true });

module.exports = mongoose.model('CustomerProfile', customerSchema);
