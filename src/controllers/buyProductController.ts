import { Request, Response } from "express";
import Product, { IProduct } from "../models/product";
import User from "../models/user";
import Order, { IOrder } from "../models/order";

export const buyProduct = async (req: any, res: Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if(!user){
            return res.status(402).json({
                error:'user does not exists'
            })
        }
        const product_name=req.body.name;
        const quantity=req.body.quantity;
        const product=await Product.findOne({name:product_name})

        if(!product){
            return res.status(402).json({
                error:'product doesnot exist'
            });
        }
        if(product.quantity < quantity){
            return res.status(402).json({
                error:'buy quantity exceeds stock quantity'
            });
        }
        
        product.quantity=product.quantity-quantity;
        const order: IOrder = new Order({
            user_id:userId,
            product_id:product._id,
            quantity:quantity
        });
        const updateProduct = await product.save();
        const saveOrder = await order.save();
        console.log('Product Update: ', updateProduct);
        res.status(201).json({product:updateProduct,order:saveOrder});
    }catch(error){
        console.error(`Error: ${error}`);
        res.status(500).json({error:'failed to buy product'});
    }
}