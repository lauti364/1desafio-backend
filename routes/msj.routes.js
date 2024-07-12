const express = require('express');
const router = express.Router();
const  Mensaje  = require('../dao/models/user.model');
const  authorizeRole   = require('../middleware/authorize');
router.post('/chat', authorizeRole(['usuario']), async (req, res) => {
    try {
        const { email, mensaje } = req.body;

        // crea un mensaje con los datos qu se reciben
        const nuevoMensaje = new Mensaje({ email, mensaje });

        await nuevoMensaje.save();

        res.send('Mensaje enviado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/chat', authorizeRole(['usuario']), (req, res) => {
    res.render('chat');
});

module.exports = router;