const exphbs = require('express-handlebars').create({});
const session = require('express-session');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const userRouter = require('./routes/user.routers');
const products = require('./routes/products.routes');
const carrito = require('./routes/carts.routes');
const sessionRoutes = require('./routes/api/session.routes');
const viewRoutes = require('./routes/views.users');
const passport = require('passport');
const initializePassport = require('./config/passport.config');
const app = express();
const PORT = 8080;

// usa handlebars como plantilla
app.engine('.handlebars', exphbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configura express-session
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://lauti364:brisa2005@cluster0.utj99me.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' }),
}));

// Inicia passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/api/session', sessionRoutes);
app.use('/', viewRoutes);

// Ruta de chat.hbs
app.get('/', (req, res) => {
  res.render('chat');
});

// Rutas de usuario
app.use('/api', userRouter, carrito, products);

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login');
});

// Errores de rutas
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// Conexión a MongoDB
mongoose.connect("mongodb+srv://lauti364:brisa2005@cluster0.utj99me.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => { console.log("Conectado a la base de datos") })
  .catch(error => console.error("Error en la conexión", error));

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
