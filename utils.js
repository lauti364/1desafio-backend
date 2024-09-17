const bcrypt = require('bcryptjs');

// Crea el hash de la contraseña
const createHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

// Verifica si la contraseña es válida
const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

module.exports = {
    createHash,
    isValidPassword
};