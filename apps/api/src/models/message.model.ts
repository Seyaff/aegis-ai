import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  whatsappMessageId: string;
  fromNumber: string;
  customerName: string;
  messageType: "text" | "other";
  textBody: string;
  status: "received" | "processed" | "failed";
  classification?: {
    category: string;
    confidence: number;
    reasoning: string;
  };
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
 
    whatsappMessageId: { type: String, required: true, unique: true },
    fromNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    messageType: { type: String, required: true, enum: ["text", "other"] },
    textBody: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ["received", "processed", "failed"], 
      default: "received" 
    },
    classification: {
      category: { type: String },
      confidence: { type: Number },
      reasoning: { type: String }
    }
  },
  { timestamps: true } 
);

export const Message = model<IMessage>("Message", MessageSchema);