import { createLogger, transports, format } from 'winston';
import 'winston-mongodb';

const errorTransports = [];

if (process.env.DB_LOG_URI) {
    errorTransports.push(new transports.MongoDB({
        level: 'error',
        db: process.env.DB_LOG_URI,
        collection: 'logs',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }));
}

errorTransports.push(new transports.File({
    filename: 'errors.log',
    level: 'error',
}));


const logger = createLogger({
    level: 'info',
    format: format.json(),
    exceptionHandlers: errorTransports
});


if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({ 
        format: format.simple()
    }));
}

export default logger;