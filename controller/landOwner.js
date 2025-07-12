const { authMiddleware } = require('../middleware/jwt');
const User = require('../models/user');
const Land = require('../models/landInfo');

const path = require('path');
const createLand = async (req, res) => {
  try {
    const name = req.user.name; // Always use logged-in user's name
    const landData = req.body;
    landData.owner = req.user._id;

    // Handle image upload
    if (req.file) {
      // Store relative path for EJS
      landData.imageUrl = '/uploads/' + req.file.filename;
    }

    const newLand = new Land(landData);
    await newLand.save();

    const lands = await Land.find({ owner: req.user._id });

    res.render('landownerdashboard', {
      name,
      lands
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error saving land", details: err.message });
  }
};



// routes/landRoutes.js (same file)
const getLand= async (req, res) => {
  try {
    const name = req.user.name;
    const lands = await Land.find({ owner: req.user._id });
    res.render('landownerdashboard', { name, lands });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching lands", details: err.message });
  }
};


const deleteLand = async (req, res) => {
  try {
    const landId = req.params.id;
    const name = req.user.name;
    // Only allow deletion if the land belongs to the logged-in user
    const deleted = await Land.findOneAndDelete({ _id: landId, owner: req.user._id });
    if (!deleted) {
      return res.status(404).send('Land not found or not authorized');
    }
    // After deletion, fetch updated lands and render dashboard
    const lands = await Land.find({ owner: req.user._id });
    res.render('landownerdashboard', { name, lands });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting land');
  }
};

// const logout = (req, res) => {
//   // res.clearCookie('token');
//   res.redirect('/user/login');
// };

module.exports = { createLand,getLand,deleteLand};