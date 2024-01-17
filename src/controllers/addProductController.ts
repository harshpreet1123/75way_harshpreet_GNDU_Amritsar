import { Request, Response } from "express";
import Product, { IProduct } from "../models/product";
import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { UploadedFile } from "express-fileupload";
import User from "../models/user";

export const addProduct = async (req: any, res: Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if(!user){
            return res.status(402).json({
                error:'user doesnot exists'
            })
        }
        const userRole=user.role;
        // console.log(req);
        // console.log(userRole);
        if (userRole != 'owner') {
            return res.status(403).json({
                error:'Only Owner can add products'
            });
        };
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

        const file = req.files.image as UploadedFile;

        if (!file.tempFilePath) {
            return res.status(500).json({ error: 'Temporary file path is missing.' });
        }

        // Upload file to Cloudinary
        const result: UploadApiResponse = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'auto',
            public_id: file.name.substring(0, file.name.lastIndexOf('.'))
        });
        const product: IProduct = new Product({
            name:req.body.name,
            price:req.body.price,
            quantity:req.body.quantity,
            imageUrl:result.secure_url
        })
        const savedProduct = await product.save();
        console.log('Product saved: ', savedProduct);
        res.status(201).json({message:'Product added',product:savedProduct});
    }catch(error){
        console.error(`Error: ${error}`);
        res.status(500).json({error:'Failed to add Product'});
    }
}