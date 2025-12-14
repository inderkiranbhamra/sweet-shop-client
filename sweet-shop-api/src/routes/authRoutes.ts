import { Router } from 'express';
import { register, login, googleLogin, verifyOtp } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp); // New Route
router.post('/login', login);
router.post('/google', googleLogin);

export default router;