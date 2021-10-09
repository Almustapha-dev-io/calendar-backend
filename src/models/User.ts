import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';
import _ from 'lodash';

import { jwtSign } from '../util/jwt';
import { hash, compare, genSalt } from '../util/hasher';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
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
    }
}, { timestamps: true });

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

userSchema.methods.hashPassword = function () {
    this.salt = genSalt();

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
        password: Joi.string().alphanum().min(8).required(),
        fullName: Joi.string().min(2).required()
    }).required();
    
    return schema.validate(obj);
};

const User = mongoose.model('User', userSchema);

export const validate = validateUser;
export default User;