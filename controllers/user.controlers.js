const User = require('../dao/models/usuarios.model');

const renderLogin = (req, res) => {
    res.render('login');
};

const renderRegister = (req, res) => {
    res.render('register');
};

const renderProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id).lean();
        res.render('profile', { user });
    } catch (err) {
        res.status(500).send('Error al obtener el perfil del usuario');
    }
};

module.exports = {
    renderLogin,
    renderRegister,
    renderProfile
};