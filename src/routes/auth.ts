import express from 'express';
import { signUp, signIn, verifyEmail } from '../controllers/auth';

const router = express.Router();

router.post('/', signIn);
router.post('/signup', signUp);
router.post('/verify', verifyEmail);

export default router;
