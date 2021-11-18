import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';

import response from '../util/buildResponse';


const validateDate = (req: Request, res: Response, next: NextFunction) => {
    const { date } = req.params ?? req.body;

    if (!date || !dayjs(date).isValid()) {
        return res.status(400).json(response('Provide a valid date'));
    }

    next();
}

export default validateDate;