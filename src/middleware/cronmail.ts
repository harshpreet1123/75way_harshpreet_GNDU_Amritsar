import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from '../models/user';
import Product from '../models/product';
dotenv.config();

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
            service: process.env.MAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.MAIL_USER || 'harshpreet.75way@gmail.com',
                pass: process.env.MAIL_PASS || 'ivnccezufcmbhjxu'
            }
        });

        var mailOptions = {
            from: process.env.MAIL_USER,
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