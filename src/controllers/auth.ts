import { Request, Response, NextFunction } from 'express';

import User, { validate } from '../models/User';
import { response } from '../util/buildResponse';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = validate(req.body);
    if (error) {
        const msg = error.details[0].message;
        return res.status(422).json(response(msg));
    }

    const body = {
        email: req.body.email.trim(),
        password: req.body.password.trim(),
        fullName: req.body.fullName.trim()
    };
    
    let user = new User(body);

    try {
        await user.hashPassword();
        await user.save();
        res.status(201).json(response('Signup successful', user));
    } catch (err) {
        next(err);
    }
};