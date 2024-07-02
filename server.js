require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const exphbs = require('express-handlebars').create({});
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const userRouter = require('./routes/user.routers');
const products = require('./routes/products.routes');
const carrito = require('./routes/carts.routes');
const sessionRoutes = require('./routes/api/session.routes');
const viewRoutes = require('./routes/views.users');
const initializePassport = require('./config/passport.config');

const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error('Error: La variable de entorno MONGO_URL no está definida');
    process.exit(1);
}

// hbs
app.engine('.handlebars', exphbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

//session
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: MONGO_URL
    }),
}));

app.use(flash());

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// rutas
app.use('/api/session', sessionRoutes);
app.use('/', viewRoutes);
app.use('/api', userRouter, carrito, products);

app.get('/', (req, res) => {
    res.render('chat');
});

app.use((req, res) => {
    res.status(404).send('Ruta no encontrada');
});

// conecta a Mongo
mongoose.connect(MONGO_URL)
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => console.error("Error en la conexión", error));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});