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
exports.updateProduct = void 0;
const product_1 = __importDefault(require("../../models/product"));
const user_1 = __importDefault(require("../../models/user"));
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                error: 'Only Owner can update products'
            });
        }
        const productId = req.params.productId;
        const updatedProduct = req.body;
        // Check if the product belongs to the owner
        const product = yield product_1.default.findOne({ _id: productId, owner_id: userId });
        if (!product) {
            return res.status(404).json({
                error: 'Product not found or you do not have permission to update this product'
            });
        }
        // Update product details
        product.name = updatedProduct.name || product.name;
        product.price = updatedProduct.price || product.price;
        product.quantity = updatedProduct.quantity || product.quantity;
        const savedProduct = yield product.save();
        res.status(200).json({ message: 'Product updated successfully', product: savedProduct });
    }
    catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'Failed to update Product' });
    }
});
exports.updateProduct = updateProduct;
