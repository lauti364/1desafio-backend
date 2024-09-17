const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../../dao/models/usuarios.model');
const authorizeRole = require('../../middleware/authorize');
const logger = require('../../util/logger.js');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const newUser = new User({ first_name, last_name, email, age, password });
        await newUser.save();
        req.flash('success_msg', 'Registro exitoso, por favor inicia sesión');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error al registrar usuario');
        res.status(500).redirect('/register');
    }
});

// ruta para el login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Received login request with email:', email);
    console.log('Received password:', password);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        console.log('User found:', user);

        const isMatch = await user.comparePassword(password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            return res.status(401).send('Contraseña incorrecta');
        }

        await user.updateLastConnection();

        const populatedUser = await User.findById(user._id).populate('cart.products.product');

        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            rol: user.role,
            cart: populatedUser.cart
        };

        console.log('Session user set:', req.session.user);
        res.redirect('/api/products');
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).send('Error al iniciar sesión');
    }
});



// logout y actualiza conexion
router.post('/logout', async (req, res) => { 
    try {
        if (req.session.user) {
            const user = await User.findById(req.session.user.id);
            await user.updateLastConnection();
        }
        req.logout((err) => {
            if (err) { return next(err); }
            res.redirect('/login');
        });
    } catch (err) {
        console.error('Error al cerrar sesión:', err);
        res.status(500).send('Error al cerrar sesión');
    }
});

// rutas de GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        req.session.user = {
            id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            rol: req.user.role,
            cart: req.user.cart
        };
        res.redirect('/api/products');
    }
);

module.exports = router;
