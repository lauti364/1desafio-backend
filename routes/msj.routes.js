const express = require('express');
const router = express.Router();
const  Mensaje  = require('../dao/models/user.model');
const  authorizeRole   = require('../middleware/authorize');
router.post('/chat', authorizeRole(['usuario']), async (req, res) => {
    try {
        const { email, mensaje } = req.body;

        // Crear el mensaje con los datos recibidos
        const nuevoMensaje = new Mensaje({ email, mensaje });

        // Guardar el mensaje en la base de datos
        await nuevoMensaje.save();

        // Enviar respuesta de éxito
        res.send('Mensaje enviado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/chat', authorizeRole(['usuario']), (req, res) => {
    res.render('chat'); // Renderiza la vista 'chat' solo si el usuario tiene el rol 'usuario'
});

module.exports = router;