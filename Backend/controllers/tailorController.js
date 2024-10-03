const Tailor = require('../models/Tailor');
const User = require('../models/User');
const PortfolioItem = require('../models/PortfolioItem');

exports.createProfile = async (req, res) => {
  try {
    const { name, bio, email, phone, location, specialties } = req.body;
    const userId = req.user.id;

    const tailor = new Tailor({
      user: userId,
      name,
      bio,
      email,
      phone,
      location,
      specialties
    });

    await tailor.save();

    res.status(201).json({
      success: true,
      data: tailor
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
    const tailor = await Tailor.findOne({ user: req.user.id })
      .populate('user', 'name email phone location')
      .populate({
        path: 'portfolio',
        model: 'PortfolioItem'
      })
      .populate('catalog');

    if (!tailor) {
      return res.status(404).json({
        success: false,
        error: 'Tailor profile not found'
      });
    }
    

    res.status(200).json({
      success: true,
      data: {
        ...tailor.toObject(),
        name: tailor.user.name,
        email: tailor.user.email,
        phone: tailor.user.phone,
        location: tailor.user.location
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
    const { name, bio, phone, location, specialties, profileImage } = req.body;

    const [tailor, user] = await Promise.all([
      Tailor.findOneAndUpdate(
        { user: req.user.id },
        { bio, specialties, profileImage },
        { new: true, runValidators: true }
      ),
      User.findByIdAndUpdate(
        req.user.id,
        { name, phone, location },
        { new: true, runValidators: true }
      )
    ]);

    if (!tailor || !user) {
      return res.status(404).json({
        success: false,
        error: 'Tailor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...tailor.toObject(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.createPortfolioItem = async (req, res) => {
  try {
    const { title, description, images, category } = req.body;
    const tailor = await Tailor.findOne({ user: req.user.id });

    const portfolioItem = new PortfolioItem({
      tailor: tailor._id,
      title,
      description,
      images,
      category
    });

    await portfolioItem.save();
    tailor.portfolio.push(portfolioItem._id);
    await tailor.save();

    res.status(201).json({
      success: true,
      data: portfolioItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.updatePortfolioItem = async (req, res) => {
  try {
    const { title, description, images, category } = req.body;
    const portfolioItem = await PortfolioItem.findOneAndUpdate(
      { _id: req.params.id, tailor: req.user.id },
      { title, description, images, category },
      { new: true, runValidators: true }
    );

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: portfolioItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.deletePortfolioItem = async (req, res) => {
  try {
    const portfolioItem = await PortfolioItem.findOneAndDelete({
      _id: req.params.id,
      tailor: req.user.id
    });

    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio item not found'
      });
    }

    const tailor = await Tailor.findOne({ user: req.user.id });
    tailor.portfolio = tailor.portfolio.filter(
      item => item.toString() !== req.params.id
    );
    await tailor.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
