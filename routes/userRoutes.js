const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require('../middleware/jwt');
const { userOnly } = require('../middleware/role');

// Route for /userdashboard (GET)
const Land = require('../models/landInfo');
// Show all lands to user (cart style)
router.get('/', jwtAuthMiddleware, userOnly, async (req, res) => {
    try {
        const name = req.user.name;
        // Show all lands (not just user's)
        const lands = await Land.find({});
        res.render('userdashboard', { name, lands });
    } catch (err) {
        res.status(500).send('Error loading lands');
    }
});


module.exports = router;