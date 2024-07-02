const express = require('express');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');
const { renderLogin, renderRegister, renderProfile } = require('../controllers/user.controlers');
const router = express.Router();

router.get('/login', isNotAuthenticated, renderLogin);

router.get('/register', isNotAuthenticated, renderRegister);

router.get('/profile', isAuthenticated, renderProfile);

module.exports = router;




module.exports = router;