const bcrypt = require('bcrypt');
//comprueba la contraseña
async function isValidPassword(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error('Error al comparar contraseñas');
    }
}
// hace el hassheo
async function createHash(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

module.exports = { createHash, isValidPassword };
