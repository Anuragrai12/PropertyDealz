
const Land = require('../models/landInfo');
const User = require('../models/user');
const { generateToken } = require('../middleware/jwt');

// Admin dashboard controller
const adminDashboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    const landowners = await User.find({ role: 'landOwner' });
    const lands = await Land.find({}).populate('owner', 'name email mobile');
    res.render('admindashboard', {
      name: req.user.name,
      users,
      landowners,
      lands
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).send('Error loading admin dashboard');
  }
};

// Signup controller
const signup = async (req, res) => {
  try {
    const data = req.body;
    // Check for duplicate mobile or email
    const existingUser = await User.findOne({ $or: [{ mobile: data.mobile }, { email: data.email }] });
    if (existingUser) {
      return res.status(400).render('signup', { error: 'Mobile or Email already registered', old: data });
    }
    // Only one admin allowed
    if (data.role === 'admin') {
      const adminUser = await User.findOne({ role: 'admin' });
      if (adminUser) {
        return res.status(403).render('signup', { error: 'Admin user already exists', old: data });
      }
    }
    const newUser = new User(data);
    await newUser.save();
    const payload = { _id: newUser._id, name: newUser.name, role: newUser.role };
    const token = generateToken(payload);
    res.cookie('token', token, { httpOnly: true });
    if (data.role === 'admin') return res.redirect('/admindashboard');
    if (data.role === 'landOwner') return res.redirect('/landownerdashboard');
    if (data.role === 'user') return res.redirect('/userdashboard');
    return res.redirect('/user/login');
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).render('signup', { error: 'Mobile or Email already registered', old: req.body });
    }
    console.log('Signup error:', err);
    res.status(500).render('signup', { error: 'Internal Server Error', old: req.body });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).render('login', { error: 'username and password are wrong' });
    }
    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });
    if (user.role === 'admin') return res.redirect('/admindashboard');
    if (user.role === 'landOwner') return res.redirect('/landownerdashboard');
    if (user.role === 'user') return res.redirect('/userdashboard');
    return res.redirect('/user/login');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { signup, login, adminDashboard };
