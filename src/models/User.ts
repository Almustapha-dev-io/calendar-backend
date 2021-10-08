import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import _ from 'lodash';

import { hash, compare } from '../util/hasher';

const userSchema = new Schema({
    email: {
        type: String,
        required: true
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

userSchema.methods.hashPassword = async function () {
    this.salt = crypto.randomBytes(16).toString('hex');
    try {
        const hashedPassword = await hash(this.password, this.salt);
        this.password = hashedPassword;
    } catch (err) {
        throw err;
    }
}

userSchema.methods.comparePassword = async function (password: string) {
    try {
        return await compare(password, this.salt, this.password);
    } catch (err) {
        throw err;
    }
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

