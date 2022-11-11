import { NextFunction, Request, Response } from 'express';
// import clearHash from '../util/cache';

const clearCache = async (req: Request, res: Response, next: NextFunction) => {
    await next();
//     clearHash(req.user._id);
};

export default clearCache;
