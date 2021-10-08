import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import auth from './routes/auth';
import error from './middleware/error';

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Calendar app API running...')
});

app.use('/api/auth', auth);
app.use(error);

if (!process.env.DB_URI) throw 'FATAL ERROR: Mongo DB URL not provided!';

mongoose
    .connect(process.env.DB_URI)
    .then(() => {
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`Running on PORT: ${PORT}...`);
        });
    })
    .catch(console.error);
