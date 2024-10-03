const Customer = require('../models/CustomerProfile');
const User = require('../models/User');
const Order = require('../models/Order');
const CartItem = require('../models/CartItem');


exports.createProfile = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user.id;

    const customer = new Customer({
      user: userId,
      address
    });

    await customer.save();

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const customer = await Customer.findOne({ user: req.user.id })
      .populate('user', 'name email phone')
      .populate('orders')
      .populate('cart');


    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer profile not found'
      });
    }

    const orderCount = customer.orders.length;
    const loyaltyPoints =  customer.createdAt.toLocaleString('default', { month: 'long', year: 'numeric' }) // Example: 10 points per order
    const memberSince = customer.createdAt.toLocaleString('default', { month: 'long', year: 'numeric' });

    res.status(200).json({
      success: true,
      data: {
        profileImage: customer.profileImage,
        name: customer.user.name,
        memberSince: memberSince,
        orderCount: orderCount,
        loyaltyPoints: customer.loyaltyPoints,
        email: customer.user.email,
        phone: customer.user.phone,
        address: customer.address,
        orders: customer.orders,
        cart: customer.cart
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, profileImage } = req.body;

    const [customer, user] = await Promise.all([
      Customer.findOneAndUpdate(
        { user: req.user.id },
        { address },
        { new: true, runValidators: true }
      ),
      User.findByIdAndUpdate(
        req.user.id,
        { name, phone, profileImage },
        { new: true, runValidators: true }
      )
    ]);

    if (!customer || !user) {
      return res.status(404).json({
        success: false,
        error: 'Customer profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...customer.toObject(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
exports.getOrderHistory = async (req, res) => {
  try {
    const customer = await Customer.findOne({ user: req.user.id }).populate('orders');
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: customer.orders });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getLoyaltyPoints = async (req, res) => {
  try {
    const customer = await Customer.findOne({ user: req.user.id });
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: { loyaltyPoints: customer.loyaltyPoints } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
