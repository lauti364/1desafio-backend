const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../../dao/models/usuarios.model');
const { createHash, isValidPassword } = require('../../utils.js');

// Ruta para registro
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const hashedPassword = createHash(password);
        const newUser = new User({ first_name, last_name, email, age, password: hashedPassword });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al registrar usuario');
    }
});

//login cn passsport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/api/products',
    failureRedirect: '/login',
    failureFlash: true
}));

//rutas de logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

// autenticacion de git
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

module.exports = router;
