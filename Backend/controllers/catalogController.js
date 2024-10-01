const CatalogItem = require('../models/CatalogItem');
const Tailor = require('../models/Tailor');

exports.addCatalogItem = async (req, res) => {
  try {
    const { name, description, basePrice, defaultFabricId } = req.body;
    const images = req.files.map(file => file.path);

    const tailor = await Tailor.findOne({ user: req.user._id });
    if (!tailor) {
      return res.status(404).json({ message: 'Tailor profile not found' });
    }

    const catalogItem = await CatalogItem.create({
      tailor: tailor._id,
      name,
      description,
      basePrice,
      images,
      defaultFabric: defaultFabricId
    });

    res.status(201).json({
      success: true,
      data: catalogItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding catalog item', error: error.message });
  }
};

exports.updateCatalogItem = async (req, res) => {
  try {
    const { name, description, basePrice, defaultFabricId } = req.body;
    const images = req.files ? req.files.map(file => file.path) : undefined;

    const catalogItem = await CatalogItem.findOneAndUpdate(
      { _id: req.params.id, tailor: req.user._id },
      { name, description, basePrice, defaultFabric: defaultFabricId, ...(images && { images }) },
      { new: true, runValidators: true }
    );

    if (!catalogItem) {
      return res.status(404).json({ message: 'Catalog item not found' });
    }

    res.json({
      success: true,
      data: catalogItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating catalog item', error: error.message });
  }
};

exports.deleteCatalogItem = async (req, res) => {
  try {
    const catalogItem = await CatalogItem.findOneAndDelete({ _id: req.params.id, tailor: req.user._id });

    if (!catalogItem) {
      return res.status(404).json({ message: 'Catalog item not found' });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting catalog item', error: error.message });
  }
};

exports.getCatalogItems = async (req, res) => {
  try {
    const catalogItems = await CatalogItem.find({ tailor: req.params.tailorId })
      .populate('defaultFabric');

    res.json({
      success: true,
      count: catalogItems.length,
      data: catalogItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching catalog items', error: error.message });
  }
};