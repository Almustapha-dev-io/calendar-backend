import { Request, Response } from 'express';
import User, { validate } from '../models/User';

export const signUp = async (req: Request, res: Response) => {
    const { error } = validate(req.body);
    if (error) return res.status(422).json()
};