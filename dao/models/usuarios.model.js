const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Cart = require('./cart.model');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'usuario'], default: 'usuario', required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});
// crea el carrito al user nuevo
userSchema.pre('save', async function(next) {
    if (this.isNew) {
        const cart = new Cart({ user: this._id, products: [] });
        await cart.save();
        this.cart = cart._id;
    }
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
