import { Response } from 'express';
import User from '../../models/user';
import bcrypt from 'bcrypt';

export const updateUser = async (req: any, res: Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        // Allow users to update these fields
        user.name = req.body.name || user.name;
        user.gender = req.body.gender || user.gender;
        user.age = req.body.age || user.age;

        // Update password if provided
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();
        res.status(200).json({
            message: 'User info updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'Failed to update user' });
    }
};
