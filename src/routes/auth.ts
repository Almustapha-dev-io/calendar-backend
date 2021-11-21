import express from 'express';
import { 
    signUp, 
    signIn, 
    verifyEmail, 
    recoverPassword, 
    resetPassword 
} from '../controllers/auth';

const router = express.Router();

router.post('/', signIn);
router.post('/signup', signUp);
router.post('/verify', verifyEmail);
router.post('/recover-password', recoverPassword);
router.post('/reset-password', resetPassword);

export default router;
