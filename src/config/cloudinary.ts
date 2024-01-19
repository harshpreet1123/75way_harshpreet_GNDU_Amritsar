import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name:process.env.CLOUDINARY||'dk53ba1lv',
    api_key:process.env.CLOUDINARY_KEY||'811655578181272',
    api_secret:process.env.CLOUDINARY_SECRET||'UP1TE9RF58i3L5D6GGGeRtnbvtU',
});

export default cloudinary;