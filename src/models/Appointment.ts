import mongoose, { Document, Types, Model } from 'mongoose';
import Joi from 'joi';

import { IUserDocument as User } from './User';

enum AppointmentStatus {
    PENDING = 0,
    COMPLETED = 1
}

const appointmentSchema = new mongoose.Schema<IAppointmentDocument, IAppointmentModel>({
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
        type: Number,
        enum: [0, 1],
        default: 0,
        required: true
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

export interface IAppointment {
    title: string;
    details: string;
    status: AppointmentStatus;
    appointmentDate: Date;
    _user: Types.ObjectId | Record<string, unknown> | User;
};

interface IAppointmentBaseDocument extends IAppointment, Document {
    getStatus(): string;
}

export interface IAppointmentDocument extends IAppointmentBaseDocument {
    _user: User['_id']
}

export interface IAppointmentPopulatedDocument extends IAppointmentBaseDocument {
    _user: User
}

export interface IAppointmentModel extends Model<IAppointmentDocument> {}

appointmentSchema.methods.getStatus = function() {
    return this.status > 0 ? 'COMPLETED' : 'PENDING';
}

export const validate = (object: any, isUpdate = false) => {
    const obj: any = {
        title: Joi.string().min(3).max(24).required(),
        details: Joi.string().max(64),
        appointmentDate: Joi.date().required()
    };

    if (isUpdate) obj.status = Joi.string();
    
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

export default mongoose.model<IAppointmentDocument, IAppointmentModel>('Appointment', appointmentSchema);