const mongoose = require('mongoose');

const catalogItemSchema = new mongoose.Schema({
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tailor', required: true },
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true },
  mages: [{ url: String, key: String }],
  defaultFabric: { type: mongoose.Schema.Types.ObjectId, ref: 'Fabric' }
});

module.exports = mongoose.model('CatalogItem', catalogItemSchema);