const Message = require('../models/Message');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

exports.sendMessage = async (req, res) => {
  try {
    const { orderId, content } = req.body;
    const image = req.file ? req.file.path : undefined;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && order.tailor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to send messages for this order' });
    }

    const message = await Message.create({
      order: orderId,
      sender: req.user._id,
      content,
      image
    });

    // Create notification for the recipient
    const recipientId = req.user._id.toString() === order.user.toString() ? order.tailor : order.user;
    await Notification.create({
      user: recipientId,
      type: 'new_message',
      content: `New message received for Order #${order._id}`,
      relatedOrder: order._id
    });

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && order.tailor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view messages for this order' });
    }

    const messages = await Message.find({ order: orderId }).sort('createdAt');

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};