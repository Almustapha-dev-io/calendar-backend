import { Request, Response } from 'express';

import User, { validate } from '../models/User';
import { response } from '../util/buildResponse';

export const signUp = async (req: Request, res: Response) => {
    const { error } = validate(req.body);
    if (error) {
        const msg = error.details[0].message;
        return res.status(422).json(response(msg));
    }

    const user = new User()
}