import express from 'express';
import isAuth from '../middleware/isAuth';
import { 
    signUp, 
    signIn, 
    verifyEmail, 
    recoverPassword, 
    resetPassword, 
    changePassword,
    changeEmail
} from '../controllers/auth';

const router = express.Router();

router.post('/', signIn);
router.post('/signup', signUp);
router.post('/verify', verifyEmail);
router.post('/recover-password', recoverPassword);
router.post('/reset-password', resetPassword);
router.patch('/change-password', isAuth, changePassword);
router.patch('/change-email', isAuth, changeEmail);

export default router;
