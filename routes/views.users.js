const express = require('express');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');
const User = require('../dao/models/usuarios.model');
const router = express.Router();

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});


router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id).lean();
        res.render('profile', { user });
    } catch (err) {
        res.status(500).send('Error al obtener el perfil del usuario');
    }
});




module.exports = router;