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

const startup = async () => {
    try {
        await mongoose.connect(process.env.DB_URI!);
        const port = process.env.PORT || 5000;

        console.log('Connected to DB...');
        app.listen(port, () => console.log(`Listening on ${port}`));
    } catch (ex) {
        console.log(ex)
    }
};

startup();
