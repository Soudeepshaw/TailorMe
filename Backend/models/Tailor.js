const mongoose = require('mongoose');

const tailorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  profilePictureUrl: String,
  bio: {
    type: String,
    default: ''
    
  },  
  specialties: {
    type: [String],
  },
  catalog: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CatalogItem'
  }],
  portfolio: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PortfolioItem'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Tailor', tailorSchema);
