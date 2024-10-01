const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Tailor = require('../models/Tailor');
const CustomerProfile=require('../models/CustomerProfile')


exports.register = async (req, res) => {
  try {
    console.log('Register function called');
    const { name, email, password, role, longitude, latitude} = req.body;
    console.log('Request body:', req.body);
    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required"
      });
    }
    const username = email.split('@')[0];
    const userFields = {  username,name, email, password, role };
    console.log('User fields:', userFields);
    const userExists = await User.findOne({ email });
    console.log('User exists:', userExists);
    if (userExists) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    if (longitude !== undefined && latitude !== undefined) {
      userFields.location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };
      console.log('Location added:', userFields.location);
    }

    const user = await User.create(userFields);
    console.log('User created:', user);

    if (role === 'tailor') {
      try {
        const tailor = await Tailor.create({
          user: user._id,
          // Do not include any email field here
        });
        console.log('Tailor created:', tailor);
      } catch (tailorError) {
        console.error('Error creating tailor profile:', tailorError);
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({ message: 'Failed to create tailor profile', error: tailorError.message });
      }
    } else if (role === 'customer') {
      await CustomerProfile.create({
        user: user._id,
      });
      console.log('Customer profile created');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
    console.log('Token generated');

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    console.log('Registration successful');
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(500).json({ message: 'Error in user registration', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login function called');
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user || !(await user.comparePassword(password))) {
      console.log('Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
    console.log('Token generated');

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    console.log('Login successful');
  } catch (error) {
    console.error('Error in user login:', error);
    res.status(500).json({ message: 'Error in user login', error: error.message });
  }
};