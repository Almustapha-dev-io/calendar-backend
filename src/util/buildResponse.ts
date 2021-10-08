import IResponse from '../types/IResponse';

export const response = (message: string, data=null): IResponse => {
    return {
        message,
        data
    }
};