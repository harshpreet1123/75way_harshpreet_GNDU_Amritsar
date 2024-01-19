import express from 'express';
import { addProduct } from '../controllers/productControllers/addProductController';
import { buyProduct } from '../controllers/productControllers/buyProductController';
import { updateProduct } from '../controllers/productControllers/updateProductController';

const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add-product',verifyToken,addProduct);
router.post('/buy-product',verifyToken,buyProduct);
router.put('/update-product/:productId', verifyToken, updateProduct); 

export default router;