import mongoose from "mongoose";
import { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  // Note: password, comparePassword, and omitPassword are gone!
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;