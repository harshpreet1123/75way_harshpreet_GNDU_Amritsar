import express from 'express';
import {register} from '../controllers/registerController';
import { login } from '../controllers/loginController';
const verifyToken = require('../middleware/authMiddleware')

const router= express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/user', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' });
    });
export default router;