import { Response, Request, NextFunction } from 'express';
import response from '../util/buildResponse';
import logger from '../util/logger';

const error = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    res.status(500).json(response('Something failed on the server!'));
};

export default error;