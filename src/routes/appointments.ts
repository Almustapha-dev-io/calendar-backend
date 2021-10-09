import express from 'express';

import isAuth from '../middleware/isAuth';
import { 
    validateParamsObjectId, 
    validateQueryObjectId 
} from '../middleware/validateObjectId';

import {
    getAppointment,
    getAppointments,
    patchAppointment,
    postAppointment,
    putAppointment
} from '../controllers/appointment';

const router = express.Router();

router.post('/', isAuth, postAppointment);
router.get('/', isAuth, getAppointments);
router.get('/:id', [isAuth, validateParamsObjectId], getAppointment);
router.put('/', [isAuth, validateQueryObjectId], putAppointment);
router.patch('/:id', [isAuth, validateParamsObjectId], patchAppointment);

export default router;