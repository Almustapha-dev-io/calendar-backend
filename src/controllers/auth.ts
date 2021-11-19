import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import User, { validate } from '../models/User';
import response from '../util/buildResponse'

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = validate(req.body);
    if (error) {
        const msg = error.details[0].message;
        return res.status(422).json(response(msg));
    }

    let user = await User
        .findOne({ email: req.body.email.trim() })
        .catch(next);
    if (user) return res.status(422).json(response('A user with given email exists on our system!'));

    user = new User(req.body);
    await user.hashPassword().catch(next);
    await user.save().catch(next);

    const data = _.pick(user, ['email', 'fullName', '_id']);
    res.status(201).json(response('Signup successful', data));
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    const errMsg = 'Invalid username or password.';
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json(response(errMsg));
    
    const user = await User
        .findOne({ email: email.trim() })
        .catch(next);

    if (!user) return res.status(400).json(response(errMsg));

    const passwordValid = await user.comparePassword(password).catch(next);
    if (!passwordValid) return res.status(400).json(response(errMsg));

    const token = await user
        .generateAuthToken()
        .catch(next);
    const data = { token };
    
    res.status(200).json(response('Login Successful', data));
};