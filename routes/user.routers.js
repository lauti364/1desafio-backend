const express = require('express');
const router = express.Router();
const {Mensaje} = require('../dao/models/user.model');

//rutas de messages
router.post('/msj', async (req, res) => {
    try {
      const { email, mensaje } = req.body;
  
      //hace el mesage con loos datos
      const nuevoMensaje = new Mensaje({ email, mensaje: mensaje });
      
      // lo guarda en la base de datos
      await nuevoMensaje.save();
  
      //muestra un mensaje si sale bien o mal
      res.send('Mensaje enviado correctamente');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  });
  
router.get('/chat', (req, res) => {
    res.render('chat');
});
module.exports = router;