"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const node_cron_1 = __importDefault(require("node-cron"));
const cronmail_1 = require("./middleware/cronmail");
const lowQuantity_1 = require("./middleware/lowQuantity");
dotenv_1.default.config();
const port = process.env.PORT;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// DB_CONNECTION_STRING = mongodb+srv://${dbUser}:${dbPass}@cluster0.3k159nx.mongodb.net/?retryWrites=true&w=majority
try {
    mongoose_1.default.connect(`mongodb://localhost:27017`);
    console.log('DB connected');
}
catch (error) {
    console.log(error);
}
node_cron_1.default.schedule('0 18 * * *', cronmail_1.sendCronMail, { timezone: 'Asia/Kolkata' });
node_cron_1.default.schedule('* 59 * * * *', lowQuantity_1.lowQuantityNotification, { timezone: 'Asia/Kolkata' });
app.use((0, express_fileupload_1.default)({ useTempFiles: true, tempFileDir: '/tmp/' }));
app.use('/user', authRoutes_1.default);
app.use('/product', productRoutes_1.default);
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});
