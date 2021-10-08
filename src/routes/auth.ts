import express from 'express';
import { signUp } from '../controllers/auth';

const router = express.Router();

router.post('/signin');
router.post('/signup', signUp);

export default router;
