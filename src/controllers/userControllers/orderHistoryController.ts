import { Response } from 'express';
import Order from '../../models/order';

export const getOrderHistory = async (req: any, res: Response) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({ user_id: userId });

        res.status(200).json({
            message: 'Order history retrieved successfully',
            orders,
        });
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'Failed to fetch order history' });
    }
};
