import { Schema, Model } from "mongoose";
import { User } from "../src/model/user.model";
import { conn } from "./conn";

const userSchema: Schema = new Schema({
  user_id: { type: Number, required: true, unique: true },
  username: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  wishlists: { type: [], required: false },
});

export const userModel = conn.model<User>("User", userSchema);
