import mongoose from 'mongoose';
import client, { redisGet } from './redisClient';
import ICacheOptions from '../models/ICacheOptions';
import logger from '../util/logger';

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (opts: ICacheOptions) {
    this._useCache = true;
    this._hashKey = JSON.stringify(opts.key);
    this._fieldKey = JSON.stringify(opts.fieldKey);

    return this;
}

mongoose.Query.prototype.exec = async function () {
    if (!this._useCache) {
        return exec.apply(this, arguments as any);
    }

    const hashKey = this._hashKey;
    const key = this._fieldKey;

    const cachedValue = await redisGet(hashKey, key);

    if (cachedValue) {
        const doc = JSON.parse(cachedValue);

        return Array.isArray(doc) ?
            doc.map(d => new this.model(d))
            : new this.model(doc);
    }

    const result = await exec.apply(this, arguments as any);
    if (result) client.hset(hashKey, key, JSON.stringify(result));

    return result;
};

const clearHash = (hashKey: string) => {
    client.del(JSON.stringify(hashKey));
};

export default clearHash;