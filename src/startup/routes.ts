import express, { Express } from 'express';

import error from '../middleware/error';
import auth from '../routes/auth';
import appointments from '../routes/appointments';

export default (app: Express) => {
    app.use(express.json())

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });

    app.get('/', (req, res) => {
        res.send('Calendar app API running...')
    });

    app.use('/api/auth', auth);
    app.use('/api/appointments', appointments);
    app.use(error);
};