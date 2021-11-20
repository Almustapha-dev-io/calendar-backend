import redis from 'redis';

const REDIS_URL = (process.env.REDIS_TLS_URL || process.env.REDIS_URL) || 'redis://127.0.0.1:6379';

let client = redis.createClient(REDIS_URL);

export const redisGet = (key: string, field: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!client) return reject('Client is unavailable');
        client.hget(key, field, (err, value) => {
            if (err) return reject(err);

            resolve(value);
        });
    });
};

export default client;