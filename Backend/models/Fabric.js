const mongoose = require('mongoose');

const fabricSchema = new mongoose.Schema({
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tailor', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  colors: [String],
  images: [String],
  inStock: { type: Boolean, default: true }
});

module.exports = mongoose.model('Fabric', fabricSchema);