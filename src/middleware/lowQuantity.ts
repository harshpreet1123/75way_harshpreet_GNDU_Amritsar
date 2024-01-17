import Product from "../models/product"
import User from "../models/user";
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();
const service = process.env.MAIL_SERVICE;
const mail_user = process.env.MAIL_USER;
const mail_pass = process.env.MAIL_PASS

export const lowQuantityNotification = async () => {
    try {
        const lowQuantityProducts = await Product.find({ quantity: { $lt: 10 } });
        if (lowQuantityProducts.length > 0) {
            const owners = await User.find({ role: 'owner' });
            const ownerEmails = owners.map((owner) => owner.email);


            const html = `<h1>Low Quantity Alert</h1>
        <h4>Following products have low quantity</h4>
        <ul>${lowQuantityProducts.map((product) => `<li>${product.name} : ${product.quantity}</li>`)}</ul>`;

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
                subject: 'Low Quantity of products in stock',
                html: html
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
}catch (err) {

        }
    }