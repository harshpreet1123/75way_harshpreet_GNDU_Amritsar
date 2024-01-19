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
exports.addProduct = void 0;
const product_1 = __importDefault(require("../../models/product"));
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const user_1 = __importDefault(require("../../models/user"));
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(402).json({
                error: 'User does not exist'
            });
        }
        const userRole = user.role;
        if (userRole !== 'owner') {
            return res.status(403).json({
                error: 'Only Owner can add products'
            });
        }
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
        const product = new product_1.default({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            imageUrl: result.secure_url,
            owner_id: userId, // Set owner_id to the current user's ID
        });
        const savedProduct = yield product.save();
        console.log('Product saved: ', savedProduct);
        res.status(201).json({ message: 'Product added', product: savedProduct });
    }
    catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'Failed to add Product' });
    }
});
exports.addProduct = addProduct;
