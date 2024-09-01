const express = require('express');
const logger = require('../util/logger');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');
const { renderLogin, renderRegister, renderProfile } = require('../controllers/user.controlers');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../dao/models/usuarios.model');
const multer = require('multer');

const resetTokens = new Map();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

router.get('/login', isNotAuthenticated, renderLogin);

router.get('/register', isNotAuthenticated, renderRegister);

router.get('/current', isAuthenticated, renderProfile);

// desafio de logger, comprueba todos los logs
router.get('/desafiologger', (req, res) => {
    logger.debug('Debug log');
    logger.http('HTTP log');
    logger.info('Info log');
    logger.warning('Warning log');
    logger.error('Error log');
    logger.fatal('Fatal log');
    res.send('testeo de logger');
});

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'lautivp16@gmail.com',
        pass: 'nutw zcqi wneu yscg' 
    },
    tls: {
        rejectUnauthorized: false
    }
});

// ruta para solicitar el restablecimiento de la contraseña
router.post('/api/session/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // verifica que el emil exista
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('Correo no encontrado');
        }

        //genera un token
        const token = crypto.randomBytes(20).toString('hex');

        resetTokens.set(token, email);

        const mailOptions = {
            from: 'lautivp16@gmail.com', 
            to: email, 
            subject: 'Restablecer Contraseña', 
            text: `Haz clic en el siguiente enlace para restablecer tu contraseña:http://localhost:8080/reset-password/${token}`
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Correo de restablecimiento de contraseña enviado a ${email}`);
        res.status(200).send('Correo de restablecimiento de contraseña enviado');
    } catch (error) {
        logger.error('Error al enviar el correo:', error);
        res.status(500).send('Error al enviar el correo de restablecimiento de contraseña');
    }
});

//ruta de restablecimiento con token
router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
//verifica el token
    if (!resetTokens.has(token)) {
        return res.status(400).send('Token inválido o expirado');
    }

    res.send(`
        <form action="/api/session/reset-password" method="post">
            <input type="hidden" name="token" value="${token}" />
            <label for="new-password">Nueva Contraseña:</label>
            <input type="password" id="new-password" name="password" required />
            <button type="submit">Restablecer Contraseña</button>
        </form>
    `);
});

router.post('/api/session/reset-password', async (req, res) => {
    const { token, password } = req.body;

    if (!resetTokens.has(token)) {
        return res.status(400).send('Token inválido o expirado');
    }

    const email = resetTokens.get(token);
    resetTokens.delete(token);

    try {
        await updateUserPassword(email, password);
        logger.info(`Contraseña actualizada para el usuario con correo: ${email}`);
        res.status(200).send('Contraseña restablecida con éxito');
    } catch (error) {
        logger.error('Error al actualizar la contraseña:', error);
        res.status(500).send('Error al restablecer la contraseña');
    }
});
// actualiza y le hace un hash a la contra nueva
async function updateUserPassword(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, { password: hashedPassword });
}

router.post('/users/admin/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        const requiredDocuments = ['dni', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];

        const getFileNameWithoutExtension = (filename) => {
            return filename.split('.').slice(0, -1).join('.');
        };

        const uploadedDocuments = user.documents.map(doc => getFileNameWithoutExtension(doc.name));

        const hasUploadedAll = requiredDocuments.every(doc => uploadedDocuments.includes(doc));

        if (!hasUploadedAll) {
            return res.status(400).json({
                error: 'Documentación incompleta',
                message: 'Debe subir todos los documentos requeridos para convertirse en usuario admin',
                missingDocuments: requiredDocuments.filter(doc => !uploadedDocuments.includes(doc))
            });
        }

        user.role = 'admin';
        await user.save();

        res.status(200).send('Usuario actualizado a admin exitosamente');
    } catch (error) {
        console.error('Error al actualizar usuario a admin:', error);
        res.status(500).send('Error al actualizar usuario a admin');
    }
});

//sube los dcimuentos
router.post('/users/:uid/documents', upload.any(), async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No se subieron documentos');
        }

        req.files.forEach(file => {
            user.documents.push({ name: file.originalname, reference: file.path });
        });

        await user.save();

        res.status(200).send('Documentos subidos exitosamente');
    } catch (error) {
        console.error('Error al subir documentos:', error);
        res.status(500).send('Error al subir documentos');
    }
});

module.exports = router;