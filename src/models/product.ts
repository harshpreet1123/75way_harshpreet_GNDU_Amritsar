import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
   name:string;
   price:number;
   quantity:number;
   imageUrl:string;
}

const productSchema: Schema<IProduct> = new Schema({
    name: { type: String, required: true, unique:true},
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String },
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;