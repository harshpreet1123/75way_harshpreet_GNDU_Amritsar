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
exports.lowQuantityNotification = void 0;
const nodemailer_1 = require("../config/nodemailer");
const product_1 = __importDefault(require("../models/product"));
const user_1 = __importDefault(require("../models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const lowQuantityNotification = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lowQuantityProducts = yield product_1.default.find({ quantity: { $lt: 10 } });
        // Loop through each low quantity product
        for (const product of lowQuantityProducts) {
            const owner = yield user_1.default.findById(product.owner_id);
            if (owner) {
                const ownerEmail = owner.email;
                const html = `<h1>Low Quantity Alert</h1>
                    <h4>${product.name} has low quantity: ${product.quantity}</h4>`;
                var mailOptions = {
                    from: nodemailer_1.nodemailerConfig.mail_user,
                    to: ownerEmail,
                    subject: 'Low Quantity of products in stock',
                    html: html
                };
                nodemailer_1.transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        }
    }
    catch (err) {
        console.error(`Error: ${err}`);
    }
});
exports.lowQuantityNotification = lowQuantityNotification;
