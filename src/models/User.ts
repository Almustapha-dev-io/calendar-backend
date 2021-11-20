import mongoose, { Schema, Document, Model } from 'mongoose';
import Joi from 'joi';
import _ from 'lodash';

import { jwtSign } from '../util/jwt';
import { hash, compare, genSalt } from '../util/hasher';

const userSchema = new Schema<IUserDocument, IUserModel>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    password:  {
        type: String,
        required: true
    },
    salt: {
        type: String,
        default: ''
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: ''
    }
}, { timestamps: true });

export interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    salt: string;
    verificationToken: string;
    verified: boolean;
};

export interface IUserDocument extends IUser, Document {
    hashPassword(): Promise<IUser>;
    comparePassword(password: string): Promise<boolean>;
    generateAuthToken(): Promise<string>;
};

export interface IUserModel extends Model<IUserDocument> {}

userSchema.methods.generateAuthToken = function () {
    const payload = _.pick(this, ['_id', 'fullName', 'email']);
    
    return new Promise(async (resolve, reject) => {
        const token = await jwtSign(payload).catch(reject);
        resolve(token);
    });
};


userSchema.methods.hashPassword = async function () {
    return new Promise(async (resolve, reject) => {
        try {
            this.salt = await genSalt()
        } catch (e) {
            return reject(e);
        }

        const hashedPassword = await hash(this.password, this.salt).catch(reject);
        this.password = hashedPassword!;
        resolve(this);
    });
}

userSchema.methods.comparePassword = function (password: string) {
    return new Promise(async (resolve, reject) => {
        const isValid = await compare(password, this.salt, this.password).catch(reject);
        resolve(isValid);
    });
};

const validateUser = (obj: any) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().min(8).required(),
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required()
    }).required();
    
    return schema.validate(obj);
};

export const validate = validateUser;
export default mongoose.model<IUserDocument, IUserModel>('User', userSchema);