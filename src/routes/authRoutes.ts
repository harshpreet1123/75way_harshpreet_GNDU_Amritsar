import express from 'express';
import {register} from '../controllers/userControllers/registerController';
import { login } from '../controllers/userControllers/loginController';
import { updateUser } from '../controllers/userControllers/updateController';
import { getOrderHistory } from '../controllers/userControllers/orderHistoryController';
const verifyToken = require('../middleware/authMiddleware')

const router= express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/user', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' });
    });
router.put('/update-user', verifyToken, updateUser);
router.get('/order-history', verifyToken, getOrderHistory);
export default router;