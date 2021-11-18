import { Response, Request, NextFunction } from 'express';

import User from '../models/User';
import { response } from '../util/buildResponse';
import { jwtVerify } from '../util/jwt';

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json(response('Full authentication is required!'));

    const token = authorization.split('Bearer')[1];
    if (!token) return res.status(401).json(response('Bearer token not present in headers!'));

    try {
        const payload = await jwtVerify(token.trim());
        const user = await User.findById(payload._id);
        if (!user) return res.status(401).json(response('Could not verify user\'s identity.'));

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

export default isAuth;
