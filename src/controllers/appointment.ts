import { Request, Response, NextFunction } from 'express';

import response from '../util/buildResponse';
import Appointment, { validate, validateForUpdate } from '../models/Appointment';
import formatDate from '../util/formatDate';

const { isInteger } = Number;


export const getAppointments = async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const _user = req.user._id;
        
    const totalDocs = await Appointment
        .countDocuments({ _user })
        .catch(next);

    const appointments = await Appointment
        .find({ _user })
        .populate('_user', 'fullName')
        .select('-__v')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .cache({ 
            key: _user.toString(), 
            fieldKey: `allAppointments_${page}_${pageSize}`
        })
        .catch(next);

    const data = { appointments, totalDocs };
    res.status(200).json(response('Appointments fetched', data));
};


export const getAppointmentsForMonth = async (req: Request, res: Response, next: NextFunction) => {
    const _user = req.user._id;
    const  month = +req.params.month;
    const  year = +req.params.year;

    if (!month || !year || !isInteger(month) || !isInteger(year)) {
        return res.status(400).json(response('Month and year must be valid integers'));
    }

    if (month > 12 || month <= 0) {
        return res.status(400).json(response('Enter a valid month 1~12'));
    }

    const firstDay = new Date(`${year}-${month}-01T00:00:00Z`);
    const lastDay = new Date(year, month, 1);
    
    const appointments = await Appointment
        .find({ appointmentDate: { $gte: firstDay, $lte: lastDay }, _user })
        .cache({ key: req.user._id, fieldKey: `appointments_${firstDay}_${lastDay}` })
        .catch(next);

    res.status(200).json(response('Appointments fetched', appointments));
};

export const getAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const _user = req.user._id;
    const appointment = await Appointment
        .findOne({ _user, _id: req.params.id })
        .populate('_user', 'fullName')
        .select('-__v')
        .cache({
            key: _user.toString(),
            fieldKey: `appointment_${req.params.id}`
        })
        .catch(next);

    if (!appointment) {
        return res.status(404).json(response('We don\'t have that!'));
    }

    res.status(200).json(response('Appointment fetched', appointment));
};

export const postAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).json(response(error.details[0].message));
    }

    const now = new Date().getTime();
    const date = new Date(req.body.appointmentDate);

    if (now >= date.getTime())
        return res.status(400).json(response('Provide a future date!'));

    const _user = (req).user._id;
    const body: any = {
        ...req.body,
        appointmentDate: formatDate(date),
        _user
    };

    const appointment = new Appointment(body);
    await appointment.save().catch(next);
    res.status(201).json(response('Appointment added', appointment));
};

export const patchAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const _user = (req).user._id;
    const _id = req.params.id;

    const { error } = validateForUpdate(req.body);
    if (error) {
        return res.status(422).json(response(error.details[0].message));
    }

    if (req.body.appointmentDate) {
        const now = new Date().getTime();
        const date = new Date(req.body.appointmentDate);
        req.body.appointmentDate = formatDate(date);

        if (now >= date.getTime())
            return res.status(422).json(response('Provide a future date!'));
    }

    const query = { _user, _id };
    const updates = { $set: req.body };
    const options = { new: true };
    const appointment = await Appointment
        .findOneAndUpdate(query, updates, options)
        .catch(next);

    if (!appointment) {
        const errMsg = 'We dont have what you tried to update!';
        return res.status(404).json(response(errMsg));
    }

    res.status(200).json(response('Appointment updated.', appointment));

};

export const putAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const _user = (req).user._id;
    const _id = req.params.id;

    const { error } = validate(req.body, true);
    if (error) {
        return res.status(422).json(response(error.details[0].message));
    }

    const now = new Date().getTime();
    const date = new Date(req.body.appointmentDate);
    req.body.appointmentDate = formatDate(date);

    if (now >= date.getTime()) {
        return res.status(422).json(response('Provide a future date!'));
    }

    const cond = { _user, _id };
    const updates = { $set: req.body };
    const options = { new: true };
    let msg = 'Appointment updated';

    let appointment = await Appointment
        .findOneAndUpdate(cond, updates, options)
        .catch(next);

    if (!appointment) {
        delete req.body.status;
        appointment = new Appointment({ ...req.body, _user });

        await appointment.save().catch(next);
        msg = 'Appointment added.';
    }

    res.status(200).json(response(msg, appointment));
};

export const deleteAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const _user = req.user._id;
    const _id = req.params.id;
    
    const query = { _user, _id };
    const options = { new: true };

    const appointment = await Appointment
        .findOneAndDelete(query, options)
        .catch(next);

    if (!appointment) {
        return res.status(404).json(response('We don\'t have what you want to delete!'));
    }

    res.status(200).json(response('Appointment deleted!', appointment));
};

