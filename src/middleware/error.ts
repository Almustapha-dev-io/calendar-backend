import { Response, Request, Errback, NextFunction } from 'express';
import { response } from '../util/buildResponse';

const error = (err: Errback, req: Request, res: Response, next: NextFunction) => {
    console.log(err);

    res.status(500).json(response('Something failed on the server!'));
};

export default error;