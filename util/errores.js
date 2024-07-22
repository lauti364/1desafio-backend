const ERROR_products = {
    no_se_puede_crear: 'no_se_puede_crear',
    no_se_puede_añadir: 'no_se_puede_añadir',
    producto_no_encontrado: 'producto_no_encontrado',
    sin_stock: 'sin_stock',
    autenticacion_de_usuario: 'autenticacion_de_usuario',
};
class CustomError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
module.exports = { ERROR_products,CustomError };