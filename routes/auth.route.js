import express from 'express';
import { UserLogin, UserLogout, UpdatePassword, ForgetPassword, VerifyOTP } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
const router = express.Router();
// ---------- REST API -------- //

router.post('/login', UserLogin);
router.get('/logout', verifyToken, UserLogout);
router.put('/updatePassword', verifyToken, UpdatePassword);
router.put('/forgetPassword', ForgetPassword);
router.post('/verifyOTP', VerifyOTP);

export default router;
