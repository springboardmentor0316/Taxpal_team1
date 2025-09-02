import express from 'express';
import { 
  register, 
  verifyOtp, 
  login, 
  sendResetOtp, 
  resetPassword, 
  changePassword,
  resendOtp
} from '../controllers/authController.js';
const router = express.Router();
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/send-reset-otp', sendResetOtp);
router.post('/reset-password', resetPassword);
router.post('/change-password', changePassword);
router.post('/resend-otp', resendOtp);
export default router;
