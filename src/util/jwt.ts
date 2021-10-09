import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
const error = Error('FATAL ERROR: JWT SECRET undefined');

export const jwtSign = (payload: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!secret) return reject(error);

        jwt.sign(payload, secret, (err: any, token: any) => {
            if (err) return reject(err);

            resolve(token);
        });
    });
};

export const jwtVerify = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!secret) return reject(error);

        jwt.verify(token, secret, (err: any, payload: any) => {
            if (err) return reject(err);
            if (!payload) return reject(Error('Payload is undefiend.'));

            resolve(payload);
        });
    });
};