require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const exphbs = require('express-handlebars').create({});
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const userRouter = require('./routes/msj.routes');
const productsRouter = require('./routes/products.routes');
const cartRouter = require('./routes/carts.routes');
const sessionRoutes = require('./routes/api/session.routes');
const viewRoutes = require('./routes/views.users');
const initializePassport = require('./config/passport.config');
const authorizeRole = require('./middleware/authorize');

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error('Error: La variable de entorno MONGO_URL no está definida');
    process.exit(1);
}

// Configuración de Handlebars
app.engine('.handlebars', exphbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de sesiones
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        ttl: 14 * 24 * 60 * 60, // Tiempo de vida de la sesión en segundos (14 días)
    }),
}));

// Middleware de mensajes flash
app.use(flash());
// Inicialización de Passport.js
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Middleware para manejar mensajes flash en todas las vistas
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user; // Agrega el usuario al contexto de la vista
    next();
});

// Middleware para parsear cuerpos de solicitud
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/api/session', sessionRoutes);
app.use('/', viewRoutes); // Rutas para vistas de usuario
app.use('/api', userRouter); // Rutas para API de usuarios
app.use('/api', cartRouter); // Rutas para API de carritos
app.use('/api', productsRouter); // Rutas para API de productos

// Ruta principal
app.get('/', (req, res) => {
    res.render('chat'); // Renderiza la vista principal
});

// Manejador para rutas no encontradas
app.use((req, res) => {
    res.status(404).send('Ruta no encontrada');
});

// Conexión a MongoDB
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado a la base de datos');
}).catch(error => {
    console.error('Error en la conexión a la base de datos:', error);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
