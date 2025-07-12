const express = require('express');
const router = express.Router();
 const { signup, login } = require('../controller/authController');

const { jwtAuthMiddleware, adminOnly } = require('../middleware/jwt');


// Signup page
router.get('/signup', function(req, res){
    res.render('signup');
});
// Signup POST
router.post('/signup', signup);



router.get('/login', function(req, res) { 
    res.render('login');
    router.post('/login', login);
});

// router.get('/userdashboard', jwtAuthMiddleware, (req, res) => res.render('userdashboard', { name: req.user.name }));
// router.get('/landownerdashboard',  (req, res) =>res.render('landownerdashboard', { name: req.user.name }));

// Admin dashboard route
const { adminDashboard } = require('../controller/authController');
router.get('/admindashboard', jwtAuthMiddleware, adminOnly, adminDashboard);

//router.post('/signup/', signup);
// router.post('/login', login);
// router.get('/logout', logout);


module.exports = router;