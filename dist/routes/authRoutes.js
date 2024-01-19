"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = require("../controllers/userControllers/registerController");
const loginController_1 = require("../controllers/userControllers/loginController");
const updateController_1 = require("../controllers/userControllers/updateController");
const orderHistoryController_1 = require("../controllers/userControllers/orderHistoryController");
const verifyToken = require('../middleware/authMiddleware');
const router = express_1.default.Router();
router.post('/register', registerController_1.register);
router.post('/login', loginController_1.login);
router.get('/user', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' });
});
router.put('/update-user', verifyToken, updateController_1.updateUser);
router.get('/order-history', verifyToken, orderHistoryController_1.getOrderHistory);
exports.default = router;
