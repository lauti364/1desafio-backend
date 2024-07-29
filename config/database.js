const mongoose = require('mongoose');
const logger = require('../util/logger');
mongoose.connect('mongodb+srv://lauti364:brisa2005@cluster0.utj99me.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    logger.info('Connectao a mongodb');
});

module.exports = db;
