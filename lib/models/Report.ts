import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  userId: mongoose.Types.ObjectId | string;
  displayId: string; // CL-XXXX format
  photoUrl: string;
  faultType: string;
  severity: string;
  description: string;
  location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  };
  authority: {
    name: string;
    department: string;
    email: string;
    phone: string;
    hours: string;
    officeName?: string;
    officeAddress?: string;
    officeLocation?: {
      lat?: number;
      lng?: number;
    };
    distanceKm?: number;
    sourceUrl?: string;
  };
  status: string;
  followUpAt?: Date;
  duplicateCount: number;
  emailSent: boolean;
  socialPostPublished: boolean;
  timeline: Array<{
    id: string;
    type: string;
    label: string;
    date: Date;
  }>;
  createdAt: Date;
  resolvedAt?: Date;
}

const ReportSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    displayId: { type: String, required: true, unique: true },
    photoUrl: { type: String },
    faultType: { type: String },
    severity: { type: String },
    description: { type: String },
    location: {
      address: { type: String },
      city: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    authority: {
      name: { type: String },
      department: { type: String },
      email: { type: String },
      phone: { type: String },
      hours: { type: String },
      officeName: { type: String },
      officeAddress: { type: String },
      officeLocation: {
        lat: { type: Number },
        lng: { type: Number },
      },
      distanceKm: { type: Number },
      sourceUrl: { type: String },
    },
    status: { type: String, default: "pending" },
    followUpAt: { type: Date },
    duplicateCount: { type: Number, default: 0 },
    emailSent: { type: Boolean, default: false },
    socialPostPublished: { type: Boolean, default: false },
    timeline: [
      {
        id: { type: String },
        type: { type: String },
        label: { type: String },
        date: { type: Date },
      },
    ],
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Report ||
  mongoose.model<IReport>("Report", ReportSchema);
