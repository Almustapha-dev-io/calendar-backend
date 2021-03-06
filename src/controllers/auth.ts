import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import User, { validate, validatePassword, validateEmail } from '../models/User';
import response from '../util/buildResponse';
import { genSalt } from '../util/hasher';
import { sendMail, MailType } from '../util/mailer';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = validate(req.body);
    if (error) {
        const msg = error.details[0].message;
        return res.status(400).json(response(msg));
    }

    try {
        let user = await User.findOne({ email: req.body.email.trim() });
        if (user) return res.status(422).json(response('A user with given email exists on our system!'));

        user = new User(req.body);

        const token = await genSalt(32);
        user.verificationToken = token;

        await user.hashPassword();
        await user.save();

        const data = _.pick(user, ['email', 'firstName', 'lastName', '_id']);
        res.status(201).json(response('Signup successful', data));
        sendMail(user.email, token, MailType.ACCOUNT_VERIFY);
    } catch (err) {
        next(err);
    }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    const errMsg = 'Invalid email or password.';
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json(response(errMsg));

    try {
        const user = await User.findOne({ email: email.trim() });

        if (!user) return res.status(400).json(response(errMsg));

        const passwordValid = await user.comparePassword(password);
        if (!passwordValid) return res.status(400).json(response(errMsg));
        if (!user.verified) return res.status(401).json(response('Account email not verfied!'));

        const token = await user.generateAuthToken();
        const userInfo = _.pick(user, ['firstName', 'lastName', 'email', 'verified']);
        res.status(200).json(response('Login Successful', { token, userInfo }));
    } catch (err) {
        next(err);
    }
};


export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;
    if (!token) return res.status(400).json(response('Invalid token'));

    try {
        const query = { verificationToken: token };
        const update = { $set: { verificationToken: '', verified: true } };
        const user = await User.findOneAndUpdate(query, update, { new: true })
        if (!user) return res.status(400).json(response('Invalid verification token!'));

        res.status(200).json(response('Email verified successfully!'));
    } catch (err) {
        next(err);
    }
};


export const recoverPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) return res.status(400).json(response('Invalid email address'));

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json(response('No users with email found'));

        const token = await genSalt(32);
        user.passwordResetToken = token;
        user.passwordResetTokenExp = Date.now() + 3600000; // Expires in an hour

        await user.save();
        res.status(200).json(response('Password reset request sent!'));

        sendMail(user.email, token, MailType.PASSWORD_RESET);
    } catch (err) {
        next(err);
    }
};


export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { token, password, confirmPassword } = req.body;
    if (!token) return res.status(400).json(response('Invalid token'));

    const errors = validatePassword(
        { label: 'Password', value: password },
        { label: 'Confirm password', value: confirmPassword },
    );
    if (errors.length) {
        const msg = errors[0].details[0].message;
        return res.status(400).json(response(msg));
    }

    if (password !== confirmPassword) {
        return res.status(422).json(response('Password and confirm password not same'));
    }

    try {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetTokenExp: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json(response('Invalid token or token expired!'));

        user.passwordResetToken = '';
        user.passwordResetTokenExp = 0;
        user.password = password;

        await user.hashPassword();
        await user.save();

        res.status(200).json(response('Password reset successful!'));
    } catch (err) {
        next(err);
    }
};


export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const errors = validatePassword(
        { label: 'New password', value: newPassword },
        { label: 'Old password', value: oldPassword }
    );

    if (errors.length) {
        const msg = errors[0].details[0].message;
        return res.status(400).json(response(msg));
    }

    try {
        const user = req.user;
        const oldPasswordValid = await user.comparePassword(oldPassword);
        if (!oldPasswordValid) return res.status(400).json(response('Your current password is incorrect!'));

        user.password = newPassword;
        await user.hashPassword();
        await user.save();

        res.status(200).json(response('Password changed!'));
    } catch (err) {
        next(err);
    }
};


export const changeEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const { error } = validateEmail(email);
    if (error) {
        const msg = error.details[0].message;
        return res.status(400).json(response(msg));
    }

    if (!password) return res.status(400).json(response('Password is required'));

    const user = req.user;
    if (email === user.email) return res.status(422).json(response('New email same as current email.'));

    try {
        const passwordValid = await user.comparePassword(password);
        if (!passwordValid) return res.status(400).json(response('Wrong password. Enter your correct password.'));

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json(response('A user exists with the given email!'));

        user.email = email.trim();
        await user.save();

        res.status(200).json(response('Your email address was updated!'));
    } catch (err) {
        next(err);
    }
};