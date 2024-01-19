import { Request, Response } from "express";
import Product, { IProduct } from "../../models/product";
import User from "../../models/user";

export const updateProduct = async (req: any, res: Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(402).json({
                error: 'User does not exist'
            });
        }

        const userRole = user.role;
        if (userRole !== 'owner') {
            return res.status(403).json({
                error: 'Only Owner can update products'
            });
        }

        const productId = req.params.productId;
        const updatedProduct = req.body;

        // Check if the product belongs to the owner
        const product = await Product.findOne({ _id: productId, owner_id: userId });

        if (!product) {
            return res.status(404).json({
                error: 'Product not found or you do not have permission to update this product'
            });
        }

        // Update product details
        product.name = updatedProduct.name || product.name;
        product.price = updatedProduct.price || product.price;
        product.quantity = updatedProduct.quantity || product.quantity;

        const savedProduct = await product.save();

        res.status(200).json({ message: 'Product updated successfully', product: savedProduct });
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'Failed to update Product' });
    }
};
