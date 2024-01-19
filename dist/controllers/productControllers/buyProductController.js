"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyProduct = void 0;
const product_1 = __importDefault(require("../../models/product"));
const user_1 = __importDefault(require("../../models/user"));
const order_1 = __importDefault(require("../../models/order"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = require("../../config/nodemailer");
dotenv_1.default.config();
const buyProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(402).json({
                error: 'User does not exist'
            });
        }
        const product_name = req.body.name;
        const quantity = req.body.quantity;
        const product = yield product_1.default.findOne({ name: product_name });
        if (!product) {
            return res.status(402).json({
                error: 'Product does not exist'
            });
        }
        if (product.quantity < quantity) {
            return res.status(402).json({
                error: 'Buy quantity exceeds stock quantity'
            });
        }
        const owner = yield user_1.default.findById(product.owner_id);
        // Update product quantity
        product.quantity = product.quantity - quantity;
        const updateProduct = yield product.save();
        // Save order details
        const order = new order_1.default({
            user_id: userId,
            product_id: product._id,
            quantity: quantity,
            createdAt: new Date()
        });
        const saveOrder = yield order.save();
        // Send email to customer
        const customerMailOptions = {
            from: nodemailer_1.nodemailerConfig.mail_user,
            to: user.email,
            subject: 'Order Confirmation',
            text: `Your order of ${quantity} ${product_name} from ${owner.name} has completed successfully.`
        };
        // Send email to owner
        const remainingQuantity = product.quantity;
        const ownerMailOptions = {
            from: nodemailer_1.nodemailerConfig.mail_user,
            to: owner.email,
            subject: 'New Purchase Notification',
            text: `${user.name} purchased ${quantity} ${product_name} from your inventory. Remaining inventory of ${product_name}: ${remainingQuantity}`
        };
        // Create reusable transporter object using the default SMTP transport
        // Send emails
        nodemailer_1.transporter.sendMail(customerMailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Customer Email sent: ' + info.response);
            }
        });
        nodemailer_1.transporter.sendMail(ownerMailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Owner Email sent: ' + info.response);
            }
        });
        res.status(201).json({ product: updateProduct, order: saveOrder });
    }
    catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'Failed to buy product' });
    }
});
exports.buyProduct = buyProduct;
