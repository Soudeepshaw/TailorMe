const Fabric = require('../models/Fabric');
const Tailor = require('../models/Tailor');

exports.addFabric = async (req, res) => {
  try {
    const { name, price, colors } = req.body;
    const images = req.files.map(file => file.path);

    const tailor = await Tailor.findOne({ user: req.user._id });
    if (!tailor) {
      return res.status(404).json({ message: 'Tailor profile not found' });
    }

    const fabric = await Fabric.create({
      tailor: tailor._id,
      name,
      price,
      colors,
      images
    });

    res.status(201).json({
      success: true,
      data: fabric
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding fabric', error: error.message });
  }
};

exports.updateFabric = async (req, res) => {
  try {
    const { name, price, colors, inStock } = req.body;
    const images = req.files ? req.files.map(file => file.path) : undefined;

    const fabric = await Fabric.findOneAndUpdate(
      { _id: req.params.id, tailor: req.user._id },
      { name, price, colors, inStock, ...(images && { images }) },
      { new: true, runValidators: true }
    );

    if (!fabric) {
      return res.status(404).json({ message: 'Fabric not found' });
    }

    res.json({
      success: true,
      data: fabric
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating fabric', error: error.message });
  }
};

exports.deleteFabric = async (req, res) => {
  try {
    const fabric = await Fabric.findOneAndDelete({ _id: req.params.id, tailor: req.user._id });

    if (!fabric) {
      return res.status(404).json({ message: 'Fabric not found' });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting fabric', error: error.message });
  }
};

exports.getFabrics = async (req, res) => {
  try {
    const fabrics = await Fabric.find({ tailor: req.params.tailorId });

    res.json({
      success: true,
      count: fabrics.length,
      data: fabrics
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fabrics', error: error.message });
  }
};