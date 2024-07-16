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
const nodemailer = require('nodemailer');
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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'estilos')));


// Configuración de sesiones
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        ttl: 14 * 24 * 60 * 60, 
    }),
}));

app.use(flash());

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user; 
    next();
});


// Rutas
app.use('/api/session', sessionRoutes);
app.use('/', viewRoutes); 
app.use('/api', userRouter); 
app.use('/api', cartRouter,); 
app.use('/api', productsRouter); 

// Ruta principals
app.get('/', (req, res) => {
    res.render('chat');
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
