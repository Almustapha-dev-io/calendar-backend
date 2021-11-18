import express from 'express';

import isAuth from '../middleware/isAuth';
import { validateObjectId } from '../middleware/validateObjectId';
import validateDate from '../middleware/validateDate';
import clearCache from '../middleware/clearCache';

import {
    deleteAppointment,
    getAppointment,
    getAppointments,
    patchAppointment,
    postAppointment,
    putAppointment,
    getAppointmentsForDate
} from '../controllers/appointment';

const router = express.Router();

router.get('/', isAuth, getAppointments);
router.get('/:date/all', [isAuth, validateDate], getAppointmentsForDate)
router.get('/:id', [isAuth, validateObjectId], getAppointment);
router.post('/', [isAuth, clearCache], postAppointment);
router.put('/:id', [isAuth, validateObjectId, clearCache], putAppointment);
router.patch('/:id', [isAuth, validateObjectId, clearCache], patchAppointment);
router.delete('/:id', [isAuth, validateObjectId, clearCache], deleteAppointment);

export default router;