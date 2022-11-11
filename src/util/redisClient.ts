// import redis from 'redis';

// let client: redis.RedisClient;
// const REDIS_URL = (process.env.REDIS_TLS_URL || process.env.REDIS_URL);

// if (REDIS_URL) {
//     client = redis.createClient(REDIS_URL)
// } else {
//     client = redis.createClient({
//         host: process.env.REDIS_HOST,
//         password: process.env.REDIS_PASS,
//         port: +process.env.REDIS_PORT!
//     });
// }

// export const redisGet = (key: string, field: string): Promise<string> => {
//     return new Promise((resolve, reject) => {
//         if (!client) return reject('Client is unavailable');
        
//         client.hget(key, field, (err, value) => {
//             if (err) return reject(err);

//             resolve(value);
//         });
//     });
// };

// export default client;
