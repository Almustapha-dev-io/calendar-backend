import mongoose, { Schema, Document, Model } from 'mongoose';
import Joi from 'joi';
import _ from 'lodash';

import { jwtSign } from '../util/jwt';
import { hash, compare, genSalt } from '../util/hasher';
import IPasswordValidation from './IPasswordValidation';

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
    password: {
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
    verificationToken: String,
    passwordResetToken: String,
    passwordResetTokenExp: Number
}, { timestamps: true });

export interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    salt: string;
    verificationToken: string;
    passwordResetToken: string;
    passwordResetTokenExp: number;
    verified: boolean;
};

export interface IUserDocument extends IUser, Document {
    hashPassword(): Promise<IUser>;
    comparePassword(password: string): Promise<boolean>;
    generateAuthToken(): Promise<string>;
};

export interface IUserModel extends Model<IUserDocument> { }

userSchema.methods.generateAuthToken = function () {
    const payload = _.pick(this, ['_id', 'fullName', 'email']);

    return new Promise(async (resolve, reject) => {
        try {
            const token = await jwtSign(payload);
            resolve(token);
        } catch (err) {
            reject(err);
        }
    });
};


userSchema.methods.hashPassword = async function () {
    return new Promise(async (resolve, reject) => {
        try {
            this.salt = await genSalt()
            const hashedPassword = await hash(this.password, this.salt);
            this.password = hashedPassword!;
            resolve(this);
        } catch (err) {
            reject(err);
        }

    });
}

userSchema.methods.comparePassword = function (password: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const isValid = await compare(password, this.salt, this.password);
            resolve(isValid);
        } catch (err) {
            reject(err);
        }
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

const passwordValidator = (...args: IPasswordValidation[]) => {
    const validator = Joi.string().alphanum().min(8).required();
    const results: Joi.ValidationError[] = [];
    args.forEach(arg => {
        const { error } = validator.label(arg.label).validate(arg.value);
        if (error) results.push(error);
    });
    return results;
};

export const validate = validateUser;
export const validatePassword = passwordValidator;
export default mongoose.model<IUserDocument, IUserModel>('User', userSchema);