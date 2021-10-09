import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import User, { validate } from '../models/User';
import { response } from '../util/buildResponse';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = validate(req.body);
    if (error) {
        const msg = error.details[0].message;
        return res.status(422).json(response(msg));
    }

    let user = new User(req.body);

    try {
        await user.hashPassword();
        await user.save();

        const data = _.pick(user, ['email', 'fullName', '_id']);
        res
            .status(201)
            .json(response('Signup successful', data));
    } catch (err) {
        next(err);
    }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    const errMsg = 'Invalid username or password.';
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json(response(errMsg));
    
    try {
        const user = await User.findOne({ email: email.trim() });
        if (!user) return res.status(400).json(response(errMsg));

        const passwordValid = await user.comparePassword(password);
        if (!passwordValid) return res.status(400).json(response(errMsg));

        const token = await user.generateAuthToken();
        const data = { token };
        res
            .status(200)
            .json(response('Login Successful', data));
    } catch (err) {
        next(err);
    }
};