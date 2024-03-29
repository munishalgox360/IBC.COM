import express from 'express';
import { RegisterUser, ReadUser, UpdateUser, DeleteUser } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();
// --------- REST API -----------

router.post('/create', RegisterUser);
router.get('/read', verifyToken, ReadUser);
router.put('/update', verifyToken, UpdateUser);
router.delete('/delete', verifyToken, DeleteUser);


export default router;