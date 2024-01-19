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
exports.updateUser = void 0;
const user_1 = __importDefault(require("../../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield user_1.default.findById(userId);
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
            user.password = yield bcrypt_1.default.hash(req.body.password, 10);
        }
        const updatedUser = yield user.save();
        res.status(200).json({
            message: 'User info updated successfully',
            user: updatedUser,
        });
    }
    catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'Failed to update user' });
    }
});
exports.updateUser = updateUser;
