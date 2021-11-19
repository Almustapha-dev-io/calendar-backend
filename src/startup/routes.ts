import express, { Express } from 'express';

import error from '../middleware/error';
import auth from '../routes/auth';
import appointments from '../routes/appointments';

export default function (app: Express) {
    app.use(express.json())

    app.get('/', (req, res) => {
        res.send('Calendar app API running...')
    });
    
    app.use('/api/auth', auth);
    app.use('/api/appointments', appointments);
    app.use(error);
};