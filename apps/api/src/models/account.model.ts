import mongoose, { Schema, type Document, type Types } from "mongoose";
import type { ProviderEnumType } from "../enums/account-provider.enum";
import { comparePassword, hashPassword } from "../utils/hash";

export interface IAccount extends Document {
  provider: ProviderEnumType; 
  providerId?: string;
  userId: Types.ObjectId;
  password?: string; 
  accessToken?: string; 
  refreshToken?: string;
  comparePassword(password: string): Promise<boolean>; 
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    provider: {
      type: String,
      required: true,
      enum: ["GOOGLE", "FACEBOOK", "GITHUB", "EMAIL"],
    },
 
    providerId: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    password: {
      type: String,
     
      required: function (this: IAccount) {
        return this.provider === "EMAIL";
      },
    },
    accessToken: {
      type: String,
      
      required: function (this: IAccount) {
        return this.provider !== "EMAIL";
      },
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

accountSchema.pre("save", async function () {
  if (this.isModified("password") && this.password) {
    if (this.password.length > 0) {
      this.password = await hashPassword(this.password);
    }
  }

});

accountSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  
  if (!this.password) return false; 
  
  return await comparePassword(password, this.password);
};

accountSchema.index({ provider: 1, providerId: 1 }, { unique: true });


const AccountModel = mongoose.model<IAccount>("Account", accountSchema);
export default AccountModel;
