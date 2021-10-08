import IResponse from '../types/IResponse';

export const errorResponse = (error: any, message: string): IResponse => {
    return {
        message,
        data: null,
        error
    };
};

export const successResponse = (message: string, data=null): IResponse => {
    return {
        message,
        data,
        error: null
    }
};