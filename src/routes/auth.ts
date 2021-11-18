import express from 'express';
import { signUp, signIn } from '../controllers/auth';

const router = express.Router();

router.post('/', signIn);
router.post('/signup', signUp);

export default router;
