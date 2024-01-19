import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
   user_id:String;
   product_id:String;
   quantity:Number;
   createdAt: Date;
}

const orderSchema: Schema<IOrder> = new Schema({
    user_id: { type: String, required: true, },
    product_id: { type: String, required: true },
    quantity: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;