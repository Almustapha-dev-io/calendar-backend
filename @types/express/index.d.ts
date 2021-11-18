import {  IUserDocument } from '../../src/models/User';

declare global {
    namespace Express {
        interface Request {
            user: IUserDocument;
        }
    }
}