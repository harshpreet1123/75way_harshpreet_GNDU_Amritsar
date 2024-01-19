"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addProductController_1 = require("../controllers/productControllers/addProductController");
const buyProductController_1 = require("../controllers/productControllers/buyProductController");
const updateProductController_1 = require("../controllers/productControllers/updateProductController");
const verifyToken = require('../middleware/authMiddleware');
const router = express_1.default.Router();
router.post('/add-product', verifyToken, addProductController_1.addProduct);
router.post('/buy-product', verifyToken, buyProductController_1.buyProduct);
router.put('/update-product/:productId', verifyToken, updateProductController_1.updateProduct);
exports.default = router;
