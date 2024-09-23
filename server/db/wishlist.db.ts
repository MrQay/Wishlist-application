import {Schema, Model} from "mongoose";
import { Wishlist } from '../src/model/wishlist.model';
import { conn } from "./conn";

const wishlistSchema : Schema = new Schema({
  wishlist_id: { type: Number, required: true, unique: true  },
  user_id: { type: Number, required: true},
  title: { type: String, required: true },
  description: { type: String, required: false },
  date_created: { type: Date, default: Date.now },
  is_public: { type: Boolean, default: true }
});

export const wishlistModel = conn.model<Wishlist>("Wishlist", wishlistSchema);