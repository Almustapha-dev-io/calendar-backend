
import ICacheOptions from '../../src/models/ICacheOptions';
import { IUserModel, IUserDocument } from '../../src/models/User';

declare module 'mongoose' {
    interface Query {
        cache(options: ICacheOptions): Query<T>;
        _useCache: boolean;
        _hashKey: string;
        _fieldKey: string;
        mongooseCollection: any;
    }
}