import dotenv from 'dotenv';
import User from '../models/user';
import Product from '../models/product';
import {nodemailerConfig,transporter} from '../config/nodemailer';

dotenv.config();

export const sendCronMail = async () => {
    try {
        const owners = await User.find({ role: 'owner' });

        // Loop through each owner
        for (const owner of owners) {
            const ownerEmail = owner.email;
            
            const products = await Product.find({ owner_id: owner._id });

            const html = `<h1>Inventory Details for ${owner.name}</h1>
                <ul>
                    ${products.map(product => `<li>${product.name} : ${product.quantity}</li>`)}
                </ul>`;

            var mailOptions = {
                from: nodemailerConfig.mail_user,
                to: ownerEmail,
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
        }
    } catch (error) {
        console.log("Automatic email sending failed. Error: ", error);
    }
};
