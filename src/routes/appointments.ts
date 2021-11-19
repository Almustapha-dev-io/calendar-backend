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
    getAppointmentsForMonth
} from '../controllers/appointment';

const router = express.Router();

router.get('/', isAuth, getAppointments);
router.get('/:month/:year', isAuth, getAppointmentsForMonth);
router.get('/:id', [isAuth, validateObjectId], getAppointment);
router.post('/', [isAuth, validateDate, clearCache], postAppointment);
router.put('/:id', [isAuth, validateObjectId, validateDate, clearCache], putAppointment);
router.patch('/:id', [isAuth, validateObjectId, validateDate, clearCache], patchAppointment);
router.delete('/:id', [isAuth, validateObjectId, clearCache], deleteAppointment);

export default router;