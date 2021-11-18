
import ICacheOptions from '../../src/models/ICacheOptions';
import { IUserModel, IUserDocument } from '../../src/models/User';

declare module 'mongoose' {
    interface Query<T, DocType> {
        cache(options: ICacheOptions): Query<IUserModel, IUserDocument>;
        _useCache: boolean;
        _hashKey: string;
        _fieldKey: string;
        mongooseCollection: any;
    }
}