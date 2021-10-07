import express from 'express';
import User from '../models/User';

const router = express.Router();

router.get('/', async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({ users });
});

router.post('/', async (req, res) => {
    const user = new User({
        email: 'test@test.com',
        fullName: 'John Doe',
        password: 'password'
    });


    await user.save();
    res.status(201).json({ user });
});

router.put('/:id', async (req, res) => {
    
})

export default router;