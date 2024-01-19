"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../../models/user"));
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }
        const file = req.files.image;
        if (!file.tempFilePath) {
            return res.status(500).json({ error: 'Temporary file path is missing.' });
        }
        // Upload file to Cloudinary
        const result = yield cloudinary_1.default.uploader.upload(file.tempFilePath, {
            resource_type: 'auto',
            public_id: file.name.substring(0, file.name.lastIndexOf('.'))
        });
        const user = new user_1.default({
            email: req.body.email,
            password: yield bcrypt_1.default.hash(req.body.password, 10),
            name: req.body.name,
            gender: req.body.gender,
            age: req.body.age,
            profileImg: result.secure_url,
            role: req.body.role || 'customer'
        });
        const savedUser = yield user.save();
        console.log('User Saved:', savedUser);
        res.status(201).json({ message: 'User registered successfully', user: savedUser });
    }
    catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'Registration failed' });
    }
});
exports.register = register;
