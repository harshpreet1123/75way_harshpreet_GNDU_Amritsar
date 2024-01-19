import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import User, { IUser } from "../../models/user";
import { UploadedFile } from "express-fileupload";
import cloudinary from "../../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const register = async (req: Request, res: Response) => {
    try {
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
        const user: IUser = new User({
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            name: req.body.name,
            gender: req.body.gender,
            age: req.body.age,
            profileImg: result.secure_url,
            role: req.body.role||'customer'
        });
        const savedUser = await user.save();
        console.log('User Saved:', savedUser);
        res.status(201).json({ message: 'User registered successfully',user:savedUser });
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'Registration failed' });
    }
}
