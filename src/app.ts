import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import logErrors from './startup/logging';
import registerRoutes from './startup/routes';
import enableProdMode from './startup/prod';

import logger from './util/logger';

const app = express();

logErrors();
if (process.env.NODE_ENV === 'production') enableProdMode(app);
registerRoutes(app);

if (!process.env.DB_URI) {
    const msg = 'FATAL ERROR: Mongo DB URL not provided!';
    logger.error(msg);
    throw Error(msg);
}

mongoose
    .connect(process.env.DB_URI)
    .then(() => {
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            logger.info(`Application running on PORT ${PORT}...`);
        });
    })
    .catch(e => logger.error(e.message));
