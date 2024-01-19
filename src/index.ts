import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import fileUpload from 'express-fileupload';
import cron from 'node-cron';
import { sendCronMail } from './middleware/cronmail';
import { lowQuantityNotification } from './middleware/lowQuantity';
dotenv.config();
const port = process.env.PORT;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;
const app = express();
app.use(express.json());
// DB_CONNECTION_STRING = mongodb+srv://${dbUser}:${dbPass}@cluster0.3k159nx.mongodb.net/?retryWrites=true&w=majority
try {
    mongoose.connect(`mongodb://localhost:27017`);
    console.log('DB connected')
} catch (error) {
    console.log(error);
}
cron.schedule('0 18 * * *',sendCronMail,{timezone:'Asia/Kolkata'});
cron.schedule('* 59 * * * *',lowQuantityNotification,{timezone:'Asia/Kolkata'});

app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }))
app.use('/user', authRoutes);
app.use('/product',productRoutes);

app.listen(port, () => {
    console.log(`Server started at ${port}`);
})