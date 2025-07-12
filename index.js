const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
// Serve uploaded images statically
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

//const mongoURL = process.env.MONGODB_URL_LOCAL;
const mongoURL = process.env.MONGODB_URL;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

//app.use--------------------------------

const authRoutes = require('./routes/authRoutes');
const landRoutes = require('./routes/landRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/user', authRoutes);
app.use('/landownerdashboard', landRoutes);
app.use('/userdashboard', userRoutes);

// Direct route for /admindashboard (admin dashboard)
const { adminDashboard } = require('./controller/authController');
const { jwtAuthMiddleware, adminOnly } = require('./middleware/jwt');
app.get('/admindashboard', jwtAuthMiddleware, adminOnly, adminDashboard);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
