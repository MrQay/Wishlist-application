import {Schema, Model} from "mongoose";
import { Product } from '../src/model/product.model';
import { conn } from "./conn";

const productSchema : Schema = new Schema({
  product_id: { type: Number, required: true, unique: true },
  wishlist_id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  url: { type: String, required: true },
  imageUrl: { type: String, required: false },
  price: { type: Number, required: true },
  amount: { type: Number, required: false },
  ranking: { type: String, required: false },
  date_added: { type: Date, default: Date.now}
});

export const productModel = conn.model<Product>("Product", productSchema);
