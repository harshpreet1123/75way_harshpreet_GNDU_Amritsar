import express from 'express';
import { addProduct } from '../controllers/addProductController';
import { buyProduct } from '../controllers/buyProductController';

const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add-product',verifyToken,addProduct);
router.post('/buy-product',verifyToken,buyProduct);

export default router;