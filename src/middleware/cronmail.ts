import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from '../models/user';
import Product from '../models/product';
dotenv.config();
const service = process.env.MAIL_SERVICE;
const mail_user =process.env.MAIL_USER;
const mail_pass= process.env.MAIL_PASS

export const sendCronMail = async () => {
    try {

        const owners = await User.find({ role: 'owner' });
        const ownerEmails = owners.map((owner) => owner.email);
        const products = await Product.find();

        const html = `<h1>Inventory Details</h1>
        <ul>
        ${products.map((product) => `<li>${product.name} : ${product.quantity}</li>`)}
        </ul>`;

        var transporter = nodemailer.createTransport({
            service: service,
            auth: {
                user: mail_user,
                pass: mail_pass
            }
        });

        var mailOptions = {
            from: mail_user,
            to: ownerEmails,
            subject: 'Inventory info Mail',
            html: html
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.log("Automatic email sending failed. Error: ", error);
    }
}