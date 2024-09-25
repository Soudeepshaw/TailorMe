const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  id: String, // Unique order ID
  customerName: String,

  // Design chosen from catalog or custom design
  design: {
    type: {
      type: String, // 'catalog' or 'custom'
      required: true
    },
    catalogItem: {
      catalogItemId: String, // Unique identifier for each catalog item
      name: String,  // Used if the design is from the catalog
      images: [String], // Multiple images allowed
      customizations: [String] // Customization options for the catalog design
    },
    customDesign: {
      sketches: [String], // Array of image URLs or file paths for custom design sketches
      notes: String
    },
    
    // Adjustments to catalog design (optional)
    adjustments: {
      referenceImages: [String], // Array of reference images
      specificInstructions: String // Any custom instructions provided by the customer
    }
  },

  // Fabric details
  fabric: {
    fabricId: String, // Unique identifier for each fabric
    name: String,
    color: String,
    price: Number,
    images: [String] // Multiple images of fabric can be shown
  },

  measurements: {
    height: Number,
    chest: Number,
    waist: Number,
    hips: Number,
    inseam: Number
  },

  deadline: Date,
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Completed'],
    default: 'New'
  },
  
  isUrgent: Boolean,

  progress: {
    type: Number,
    default: 0
  },

  // Messages between tailor and customer
  messages: [{
    sender: String,
    content: String,
    timestamp: Date,
    images: [String] // Multiple images can be sent in the messages
  }],

  // Order timeline for different steps
  orderTimeline: {
    orderPlaced: String,
    fabricSourced: String,
    cutting: String,
    sewing: String,
    fitting: String,
    finalTouches: String,
    readyForPickup: String
  },

  tailor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tailor',
    required: true
  },
});

module.exports = mongoose.model('Order', OrderSchema);
