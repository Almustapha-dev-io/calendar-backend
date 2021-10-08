import IResponse from '../types/IResponse';

export const response = (message: string, data: any = null): IResponse => {
    return {
        message,
        data
    }
};