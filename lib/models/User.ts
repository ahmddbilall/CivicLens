import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  street?: string;
  area?: string;
  zip?: string;
  city?: string;
  avatarUrl?: string;
  preferences?: {
    pushNotifications: boolean;
    emailAlerts: boolean;
    language: string;
  };
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional for oauth
    phone: { type: String },
    street: { type: String },
    area: { type: String },
    zip: { type: String },
    city: { type: String },
    avatarUrl: { type: String },
    preferences: {
      pushNotifications: { type: Boolean, default: true },
      emailAlerts: { type: Boolean, default: true },
      language: { type: String, default: "en" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
