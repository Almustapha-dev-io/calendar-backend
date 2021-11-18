import IResponse from '../models/IResponse';

export const response = (message: string, data: any = null): IResponse => {
    return { message, data };
};