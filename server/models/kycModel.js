// server/models/kycModel.js
import mongoose from "mongoose";

const kycSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Each user can only have one KYC submission
    },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    documentType: {
        type: String,
        enum: ["Citizenship", "License", "National ID Card", "Passport"],
        required: true,
    },
    documentImage: {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
    },
    status: {
        type: String,
        enum: ["Pending", "Verified", "Rejected"],
        default: "Pending",
    },
    rejectionReason: { // Optional field for admin feedback
        type: String,
    }
}, { timestamps: true });

export const Kyc = mongoose.model("Kyc", kycSchema);
