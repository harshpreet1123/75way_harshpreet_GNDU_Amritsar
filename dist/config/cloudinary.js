"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY || 'dk53ba1lv',
    api_key: process.env.CLOUDINARY_KEY || '811655578181272',
    api_secret: process.env.CLOUDINARY_SECRET || 'UP1TE9RF58i3L5D6GGGeRtnbvtU',
});
exports.default = cloudinary_1.v2;
