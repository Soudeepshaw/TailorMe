const mongoose = require('mongoose');
const { generateGetSignedUrl } = require('../utils/s3Utils');

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique:true
  },
  profilePicture: {
    key: String
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

customerSchema.methods.getProfilePictureUrl = async function() {
  if (this.profilePicture && this.profilePicture.key) {
    return generateGetSignedUrl(this.profilePicture.key);
  }
  return null;
};

module.exports = mongoose.model('CustomerProfile', customerSchema);
