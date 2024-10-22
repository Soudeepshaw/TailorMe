const Tailor = require('../models/Tailor');
const User = require('../models/User');
const PortfolioItem = require('../models/PortfolioItem');
const { generateSignedUrl, generateGetSignedUrl } = require('../utils/s3Utils');
const { uploadToS3 } = require('../config/s3Config');

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
    const { name, bio, phone, location, specialties } = req.body;

    let profilePictureUrl;
    if (req.file) {
      try {
        profilePictureUrl = await uploadToS3(req.file, req.user.id);
      } catch (uploadError) {
        console.error('S3 upload error:', uploadError);
        return res.status(500).json({
          success: false,
          error: 'Failed to upload profile picture'
        });
      }
    }

    const updatedFields = { name, bio, phone, location, specialties };
    if (profilePictureUrl) updatedFields.profilePictureUrl = profilePictureUrl;

    const tailor = await Tailor.findOneAndUpdate(
      { user: req.user.id },
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!tailor) {
      return res.status(404).json({
        success: false,
        error: 'Tailor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tailor
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'An error occurred while updating the profile'
    });
  }
};

exports.updatePortfolioItemImages = async (req, res) => {
  try {
    const { images } = req.body;
    const portfolioItem = await PortfolioItem.findOneAndUpdate(
      { _id: req.params.id, tailor: req.user.id },
      { $push: { images: { $each: images } } },
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

exports.getProfilePictureUrl = async (req, res) => {
  try {
    const tailor = await Tailor.findOne({ user: req.user.id });
    if (tailor && tailor.profilePictureUrl) {
      res.json({ success: true, url: tailor.profilePictureUrl });
    } else {
      res.status(404).json({ success: false, message: 'Profile picture not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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

exports.getUploadUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    const key = `${req.user.id}/${Date.now()}-${fileName}`;
    const url = await generateSignedUrl(key, fileType);
    res.json({ success: true, url, key });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllTailors = async (req, res) => {
  try {
    const tailors = await Tailor.find().populate('user', 'name email');
    res.status(200).json({
      success: true,
      data: tailors
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.getTailorById = async (req, res) => {
  try {
    const tailor = await Tailor.findById(req.params.id).populate('user', 'name email');
    if (!tailor) {
      return res.status(404).json({
        success: false,
        error: 'Tailor not found'
      });
    }
    res.status(200).json({
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

exports.addPortfolioItem = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const tailor = await Tailor.findOne({ user: req.user.id });

    let imageUrl;
    if (req.file) {
      imageUrl = await uploadToS3(req.file, req.user.id);
    }

    const portfolioItem = new PortfolioItem({
      tailor: tailor._id,
      title,
      description,
      category,
      images: imageUrl ? [{ url: imageUrl }] : []
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

module.exports = exports;
