const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Producto = require('./products.model');
const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Producto' },
            quantity: { type: Number, default: 1 }
        }
    ]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
