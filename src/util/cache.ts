import mongoose from 'mongoose';
import client from './redisClient';

const exec = mongoose.Query.prototype.exec;

const redisGet = (key: string, field: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        client.hget(key, field, (err, value) => {
            if (err) return reject(err);

            resolve(value);
        });
    });
}

(mongoose.Query.prototype as any).cache = function (opts: any = {}) {
    this._useCache = true;
    this._hashKey = JSON.stringify(opts.key || '');
    return this;
}

mongoose.Query.prototype.exec = async function () {
    if (!(this as any)._useCache) {
        return exec.apply(this, arguments as any);
    }

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: (this as any).mongooseCollection.name
    }));

    const cachedValue = await redisGet((this as any)._hashKey, key);
    if (cachedValue) {
        const doc = JSON.parse(cachedValue);

        console.log('FROM CACHE ====> REDIS');
        return Array.isArray(doc) ?
            doc.map(d => new this.model(d))
            : new this.model(doc);
    }

    console.log('FROM MONGO')
    const result = await exec.apply(this, arguments as any);
    client.hset((this as any)._hashKey, key, JSON.stringify(result));

    return result;
};

const clearHash = (hashKey: string) => {
    client.del(JSON.stringify(hashKey));
};

export default clearHash;