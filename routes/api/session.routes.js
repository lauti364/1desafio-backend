const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../../dao/models/usuarios.model');
const { createHash, isValidPassword } = require('../../utils.js');

// Ruta de registro
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const hashedPassword = await createHash(password);
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

// Ruta de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    try {
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) return res.status(404).send('Usuario no encontrado');
        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
        };
        console.log(req.session.user)
        res.redirect('/profile');

    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
});

// Ruta de logout
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

// Rutas de GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        // Autenticación exitosa
        res.redirect('/api/products');
    }
);

module.exports = router;
