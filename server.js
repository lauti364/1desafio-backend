const exphbs = require('express-handlebars').create({});
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRouter = require('./dao/mongodb/routes/user.routers');
const app = express();
const PORT = 8080;

// usa handlebars como plantilla
app.engine('.handlebars', exphbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ruta de chat.hbs
app.get('/', (req, res) => {
  res.render('chat');
});

app.use('/products', userRouter);

//rutas de usuario
app.use('/api', userRouter);

// errores de rutas
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

//conecion a mongodb
mongoose.connect("mongodb+srv://lauti364:brisa2005@cluster0.utj99me.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => { console.log("Conectado a la base de datos") })
  .catch(error => console.error("Error en la conexión", error));

//inbicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});