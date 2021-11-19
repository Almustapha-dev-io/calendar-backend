import redis from 'redis';

const PORT = process.env.REDIS_PORT;
const HOST = process.env.REDIS_HOST;
const REDIS_USER = process.env.REDIS_USER;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const DEFAULT_URL = 'redis://127.0.0.1:6379';

let client: redis.RedisClient;

if (!PORT || !HOST) {
    client = redis.createClient(DEFAULT_URL);
} else {
    client = redis.createClient(Number(PORT), HOST);
}

export const redisGet = (key: string, field: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        client.hget(key, field, (err, value) => {
            if (err) return reject(err);

            resolve(value);
        });
    });
};

export default client;