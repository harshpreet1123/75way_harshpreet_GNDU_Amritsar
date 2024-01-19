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
exports.sendCronMail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("../models/user"));
const product_1 = __importDefault(require("../models/product"));
const nodemailer_1 = require("../config/nodemailer");
dotenv_1.default.config();
const sendCronMail = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const owners = yield user_1.default.find({ role: 'owner' });
        // Loop through each owner
        for (const owner of owners) {
            const ownerEmail = owner.email;
            const products = yield product_1.default.find({ owner_id: owner._id });
            const html = `<h1>Inventory Details for ${owner.name}</h1>
                <ul>
                    ${products.map(product => `<li>${product.name} : ${product.quantity}</li>`)}
                </ul>`;
            var mailOptions = {
                from: nodemailer_1.nodemailerConfig.mail_user,
                to: ownerEmail,
                subject: 'Inventory info Mail',
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
    catch (error) {
        console.log("Automatic email sending failed. Error: ", error);
    }
});
exports.sendCronMail = sendCronMail;
