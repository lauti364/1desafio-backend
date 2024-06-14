const express = require('express');
const passport = require('passport');
const router = express.Router();
const { flash } = require('express-flash');
const User = require('../../dao/models/usuarios.model');
const { createHash, isValidPassword } = require('../../utils.js');

//rutas de register
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const hashedPassword = createHash(password);
        const newUser = new User({ first_name, last_name, email, age, password: hashedPassword });
        await newUser.save();
        req.flash('success_msg', 'Registro exitoso, por favor inicia sesión');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error al registrar usuario');
        res.status(500).redirect('/register');
    }
});

// rutas de login
router.post('/login', passport.authenticate('local', {
    //va ahi si los campos son correctos
    successRedirect: '/login',
    //va ahi si son incorrectos
    failureRedirect: '/api/products',
    failureFlash: true
}));

// Ruta para logout
router.post('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Sesión cerrada correctamente');
    res.redirect('/login');
});
//rutas de git

// Ruta para iniciar la autenticación con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Ruta de callback para GitHub
router.get('/githubcallback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        // Autenticación exitosa
        res.redirect('/');
    }
);
module.exports = router;