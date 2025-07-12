const express = require('express');
const router = express.Router();
const { createLand,getLand,deleteLand} = require('../controller/landOwner');
const upload = require('../middleware/multer');
// const { signup, login, logout } = require('../controller/authController');
const { jwtAuthMiddleware, adminOnly } = require('../middleware/jwt');
const { landOwnerOnly } = require('../middleware/role');

// router.get('/:username/',jwtAuthMiddleware, function(req, res) {
//     const username = decodeURIComponent(req.params.username);
//      res.render('landownerdashboard',{ name: username })}
//     );
router.get('/', jwtAuthMiddleware, landOwnerOnly, getLand);
router.post('/', jwtAuthMiddleware, landOwnerOnly, upload.single('landImage'), createLand);
router.post('/delete/:id', jwtAuthMiddleware, landOwnerOnly, deleteLand);
//router.get('/',getLand);

//router.post('/', logout);
module.exports = router;