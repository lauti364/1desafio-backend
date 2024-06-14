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
const PORT = 8080;

// Configuración de Handlebars
app.engine('.handlebars', exphbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de express-session
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://lauti364:brisa2005@cluster0.utj99me.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    }),
}));

// Configuración de express-flash
app.use(flash());

// Inicialización de Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Middleware para manejar mensajes flash
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Middleware para parsear body de las peticiones
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/api/session', sessionRoutes);
app.use('/', viewRoutes);
app.use('/api', userRouter, carrito, products);

// Ruta de chat.hbs
app.get('/', (req, res) => {
    res.render('chat');
});

// Ruta para manejar errores 404
app.use((req, res) => {
    res.status(404).send('Ruta no encontrada');
});

// Conexión a MongoDB
mongoose.connect("mongodb+srv://lauti364:brisa2005@cluster0.utj99me.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => console.error("Error en la conexión", error));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});