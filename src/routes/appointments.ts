import express from 'express';

import isAuth from '../middleware/isAuth';
import { 
    validateParamsObjectId, 
    validateQueryObjectId 
} from '../middleware/validateObjectId';
import clearCache from '../middleware/clearCache';

import {
    deleteAppointment,
    getAppointment,
    getAppointments,
    patchAppointment,
    postAppointment,
    putAppointment
} from '../controllers/appointment';

const router = express.Router();

router.post('/', [isAuth, clearCache], postAppointment);
router.get('/', isAuth, getAppointments);
router.get('/:id', [isAuth, validateParamsObjectId], getAppointment);
router.put('/', [isAuth, validateQueryObjectId, clearCache], putAppointment);
router.patch('/:id', [isAuth, validateParamsObjectId, clearCache], patchAppointment);
router.delete('/:id', [isAuth, validateParamsObjectId, clearCache], deleteAppointment);

export default router;