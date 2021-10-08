import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

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
    }
});

userSchema.methods.generateAuthToken = function () {
    const payload = _.pick(this, ['_id', 'fullName', 'email']);
    const secret = process.env.JWT_SECRET;
    
    if (!secret) throw 'FATAL ERROR: JWT TOKEN Not available';
    const token = jwt.sign(payload, secret);
    return token;
};

const User = mongoose.model('User', userSchema);

const validateUser = (obj: any) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).alphanum().required(),
        fullName: Joi.string().min(2).required()
    }).required();

    return schema.validate(obj);
};

export const validate = validateUser;
export default User;

