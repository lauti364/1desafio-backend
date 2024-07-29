const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    format: combine(
        timestamp(),
        customFormat
    ),
    transports: [
        new transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: combine(
                timestamp(),
                customFormat
            ),
        }),
        new transports.File({
            filename: 'errors.log',
            level: 'error'
        })
    ],
});

module.exports = logger;
