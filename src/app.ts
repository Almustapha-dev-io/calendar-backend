import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import users from './routes/users';

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Calendar app API running...')
});

app.use('/users', users);

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
