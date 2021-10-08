import crypto from 'crypto';

export const hash = (str: string, salt: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(str, salt, 1000, 64, 'sha512', (err, key) => {
            if (err) return reject(err);

            resolve(key.toString('hex'));
        });
    });
};

export const compare = (str: string, salt: string, hash: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(str, salt, 1000, 64, 'sha512', (err, key) => {
            if (err) return reject(err);
            
            resolve(hash === key.toString('hex'));
        });
    })
};