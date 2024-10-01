const Order = require('../models/Order');
const Notification = require('../models/Notification');
const emailService = require('../utils/emailService');

exports.createOrder = async (req, res) => {
  try {
    const {
      tailorId,
      catalogItemId,
      fabricId,
      customizations,
      measurements,
      deadline
    } = req.body;

    const order = await Order.create({
      user: req.user._id,
      tailor: tailorId,
      catalogItem: catalogItemId,
      fabric: fabricId,
      customizations,
      measurements,
      deadline
    });

    // Create notification for tailor
    await Notification.create({
      user: tailorId,
      type: 'new_order',
      content: `New order received from ${req.user.name}`,
      relatedOrder: order._id
    });

    // Send email notification to tailor
    const tailor = await User.findById(tailorId);
    await emailService.sendEmail(
      tailor.email,
      'New Order Received',
      `You have received a new order from ${req.user.name}. Order ID: ${order._id}`
    );

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.tailor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    order.timeline.push({ stage: status, completedAt: Date.now() });
    await order.save();

    // Create notification for user
    await Notification.create({
      user: order.user,
      type: 'order_update',
      content: `Your order status has been updated to ${status}`,
      relatedOrder: order._id
    });

    // Send email notification to user
    const user = await User.findById(order.user);
    await emailService.sendEmail(
      user.email,
      'Order Status Update',
      `Your order (ID: ${order._id}) status has been updated to ${status}`
    );

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('tailor', 'studioName')
      .populate('catalogItem')
      .populate('fabric');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && order.tailor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};