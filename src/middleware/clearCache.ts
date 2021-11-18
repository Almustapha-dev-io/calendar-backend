import { NextFunction, Request, Response } from 'express';
import clearHash from '../util/cache';

const clearCache = async (req: Request, res: Response, next: NextFunction) => {
    await next();

    const _user = req.user._id;
    clearHash(_user);
};

export default clearCache;