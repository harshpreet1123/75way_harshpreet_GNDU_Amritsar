import { Response } from "express";
import Product from "../../models/product";
import User from "../../models/user";
import Order, { IOrder } from "../../models/order";
import dotenv from 'dotenv';
import { nodemailerConfig, transporter } from "../../config/nodemailer";
dotenv.config();

export const buyProduct = async (req: any, res: Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(402).json({
                error: 'User does not exist'
            });
        }

        const product_name = req.body.name;
        const quantity = req.body.quantity;
        const product = await Product.findOne({ name: product_name });

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

        const owner = await User.findById(product.owner_id);

        // Update product quantity
        product.quantity = product.quantity - quantity;
        const updateProduct = await product.save();

        // Save order details
        const order: IOrder = new Order({
            user_id: userId,
            product_id: product._id,
            quantity: quantity,
            createdAt: new Date()
        });
        const saveOrder = await order.save();

        // Send email to customer
        const customerMailOptions = {
            from: nodemailerConfig.mail_user,
            to: user.email,
            subject: 'Order Confirmation',
            text: `Your order of ${quantity} ${product_name} from ${owner!.name} has completed successfully.`
        };

        // Send email to owner
        const remainingQuantity = product.quantity;
        const ownerMailOptions = {
            from: nodemailerConfig.mail_user,
            to: owner!.email,
            subject: 'New Purchase Notification',
            text: `${user.name} purchased ${quantity} ${product_name} from your inventory. Remaining inventory of ${product_name}: ${remainingQuantity}`
        };

        // Create reusable transporter object using the default SMTP transport

        // Send emails
        transporter.sendMail(customerMailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Customer Email sent: ' + info.response);
            }
        });

        transporter.sendMail(ownerMailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Owner Email sent: ' + info.response);
            }
        });

        res.status(201).json({ product: updateProduct, order: saveOrder });
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'Failed to buy product' });
    }
};