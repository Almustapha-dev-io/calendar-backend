import IResponse from '../models/IResponse';

const response = (message: string, data: any = null): IResponse => {
    return { message, data };
};

export default response;