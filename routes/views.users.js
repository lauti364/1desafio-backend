const express = require('express');
const logger = require('../util/logger');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');
const { renderLogin, renderRegister, renderProfile } = require('../controllers/user.controlers');
const router = express.Router();

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




module.exports = router;