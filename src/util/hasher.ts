import crypto from 'crypto';

const ITERATIONS = 1000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

export const hash = (str: string, salt: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(str, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, key) => {
            if (err) return reject(err);

            resolve(key.toString('hex'));
        });
    });
};

export const compare = (str: string, salt: string, hash: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(str, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, key) => {
            if (err) return reject(err);
            
            resolve(hash === key.toString('hex'));
        });
    })
};

export const genSalt = () => crypto.randomBytes(16).toString('hex');