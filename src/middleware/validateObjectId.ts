import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { response } from '../util/buildResponse';

export const validateParamsObjectId = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(response('Provide a valid Id'))
    }

    next();
};

export const validateQueryObjectId = (req: Request, res: Response, next: NextFunction) => {
    const id = req.query.id;
    
    if (id && !mongoose.Types.ObjectId.isValid(id.toString())) {
        return res.status(400).json(response('Provide a valid Id'))
    }

    next();
};