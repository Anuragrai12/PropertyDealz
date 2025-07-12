// models/Land.js
const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
  landTitle: {
    type: String,
    required: true
  },
  address: {
    street: { type: String, required: true },
    city:   { type: String, required: true },
    state:  { type: String, required: true },
    pincode:{ type: String, required: true }
  },
  areaInSqFt: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  location: {
    latitude:  { type: Number, required: false },
    longitude: { type: Number, required: false }
  },
  imageUrl: {
    type: String,
    required: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
   registerdAt:{
        type:Date,
        default:Date.now()
    }
});

// Create User model
const Land = mongoose.model('LandInfo', landSchema);
module.exports = Land;