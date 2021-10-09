import mongoose from 'mongoose';
import Joi from 'joi';

const appointmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    details: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED'],
        default: 'PENDING'
    },
    appointmentDate: {
        type: Date,
        required: true,
        trim: true
    },
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });


const Appointment = mongoose.model('Appointment', appointmentSchema);

export const validate = (object: any, isUpdate = false) => {
    const obj: any = {
        title: Joi.string().min(3).max(24).required(),
        details: Joi.string().max(64),
        appointmentDate: Joi.date().required()
    };

    if (isUpdate) {
        obj.status = Joi.string()
    }
    
    const schema = Joi.object(obj).required();
    
    return schema.validate(object);
};

export const validateForUpdate = (object: any) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(24),
        details: Joi.string().max(64),
        status: Joi.string(),
        appointmentDate: Joi.date()
    }).required();
    
    return schema.validate(object);
};

export default Appointment;