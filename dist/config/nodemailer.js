"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = exports.nodemailerConfig = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.nodemailerConfig = {
    service: process.env.MAIL_SERVICE || 'gmail',
    mail_user: process.env.MAIL_USER || 'harshpreet.75way@gmail.com',
    mail_pass: process.env.MAIL_PASS || 'ivnccezufcmbhjxu'
};
exports.transporter = nodemailer_1.default.createTransport({
    service: exports.nodemailerConfig.service,
    auth: {
        user: exports.nodemailerConfig.mail_user,
        pass: exports.nodemailerConfig.mail_pass
    }
});
