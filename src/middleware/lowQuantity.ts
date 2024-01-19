import { nodemailerConfig, transporter } from "../config/nodemailer";
import Product from "../models/product"
import User from "../models/user";
import dotenv from 'dotenv';

dotenv.config();

export const lowQuantityNotification = async () => {
    try {
        const lowQuantityProducts = await Product.find({ quantity: { $lt: 10 } });

        // Loop through each low quantity product
        for (const product of lowQuantityProducts) {
            const owner = await User.findById(product.owner_id);

            if (owner) {
                const ownerEmail = owner.email;

                const html = `<h1>Low Quantity Alert</h1>
                    <h4>${product.name} has low quantity: ${product.quantity}</h4>`;


                var mailOptions = {
                    from: nodemailerConfig.mail_user,
                    to: ownerEmail,
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
        }
    } catch (err) {
        console.error(`Error: ${err}`);
    }
};