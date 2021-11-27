import express from 'express';
import { 
    signUp, 
    signIn, 
    verifyEmail, 
    recoverPassword, 
    resetPassword, 
    changePassword
} from '../controllers/auth';
import isAuth from '../middleware/isAuth';

const router = express.Router();

router.post('/', signIn);
router.post('/signup', signUp);
router.post('/verify', verifyEmail);
router.post('/recover-password', recoverPassword);
router.post('/reset-password', resetPassword);
router.patch('/change-password', isAuth, changePassword);

export default router;
