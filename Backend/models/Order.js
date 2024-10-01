const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tailor', required: true },
  catalogItem: { type: mongoose.Schema.Types.ObjectId, ref: 'CatalogItem', required: true },
  fabric: { type: mongoose.Schema.Types.ObjectId, ref: 'Fabric', required: true },
  customizations: String,
  measurements: {
    height: Number,
    chest: Number,
    waist: Number,
    hips: Number,
    inseam: Number
  },
  measurementImages: [String],
  status: { type: String, enum: ['new', 'in_progress', 'completed', 'cancelled'], default: 'new' },
  timeline: [{
    stage: String,
    completedAt: Date
  }],
  price: { type: Number, required: true },
  urgencyFee: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);