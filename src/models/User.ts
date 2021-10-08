import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import _ from 'lodash';

import { hash, compare } from '../util/hasher';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    password:  {
        type: String,
        required: true
    },
    salt: {
        type: String,
        default: ''
    }
});

userSchema.methods.generateAuthToken = function () {
    const payload = _.pick(this, ['_id', 'fullName', 'email']);
    const secret = process.env.JWT_SECRET;
    
    if (!secret) throw 'FATAL ERROR: JWT TOKEN Not available';
    const token = jwt.sign(payload, secret);
    return token;
};

userSchema.methods.hashPassword = function () {
    this.salt = crypto.randomBytes(16).toString('hex');

    return new Promise(async (resolve, reject) => {
        try {
            const hashedPassword = await hash(this.password, this.salt);
            this.password = hashedPassword;
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
        password: Joi.string().min(8).alphanum().required(),
        fullName: Joi.string().min(2).required()
    }).required();
    
    return schema.validate(obj);
};

const User = mongoose.model('User', userSchema);

export const validate = validateUser;
export default User;