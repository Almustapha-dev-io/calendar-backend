import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import User, { validate } from '../models/User';
import response from '../util/buildResponse';
import { genSalt } from '../util/hasher';
import { sendAccountVerification } from '../util/mailer';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = validate(req.body);
    if (error) {
        const msg = error.details[0].message;
        return res.status(400).json(response(msg));
    }

    let user = await User.findOne({ email: req.body.email.trim() }).catch(next);
    if (user) return res.status(422).json(response('A user with given email exists on our system!'));

    user = new User(req.body);
    const token = await genSalt(32).catch(next);
    if (!token) return next(Error('Could not generate salt.'));
    user.verificationToken = token;
    await user.hashPassword().catch(next);
    await user.save().catch(next);

    const data = _.pick(user, ['email', 'firstName', 'lastName', '_id']);
    res.status(201).json(response('Signup successful', data));
    sendAccountVerification(user.email, token);
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    const errMsg = 'Invalid username or password.';
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json(response(errMsg));
    
    const user = await User.findOne({ email: email.trim() }).catch(next);

    if (!user) return res.status(400).json(response(errMsg));

    const passwordValid = await user.comparePassword(password).catch(next);
    if (!passwordValid) return res.status(400).json(response(errMsg));

    if (!user.verified) return res.status(401).json(response('Account email not verfied!'));

    const token = await user.generateAuthToken().catch(next);
    
    res.status(200).json(response('Login Successful', { token }));
};


export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    if (!token) return res.status(400).json(response('Invalid token'));

    const query = { verificationToken: token };
    const update = { $set: { verificationToken: '', verified: true } };
    const user = await User.findOneAndUpdate(query, update, { new: true }).catch(next);
    if (!user) return res.status(400).json(response('Invalid token'));

    res.status(200).json(response('Email verified successfully!'));
};

// request new verification token


// verify token
