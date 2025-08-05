import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import { Kyc } from "../models/kycModel.js";
import { v2 as cloudinary } from "cloudinary";

// User: Submit their KYC details
export const submitKyc = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, middleName, phone, documentType } = req.body;
    const documentImage = req.files && req.files.documentImage;

    if (!firstName || !lastName || !phone || !documentType || !documentImage) {
        return next(new ErrorHandler("Please fill all required fields and upload a document.", 400));
    }

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(documentImage.mimetype)) {
        return next(new ErrorHandler("Invalid file format. Please upload a PNG, JPG, or WEBP file.", 400));
    }

    const existingKyc = await Kyc.findOne({ user: req.user._id });

    // MODIFIED LOGIC HERE
    if (existingKyc && (existingKyc.status === "Pending" || existingKyc.status === "Verified")) {
        return next(new ErrorHandler("You have already submitted a KYC request that is pending or verified.", 400));
    }

    // If resubmitting a rejected application, delete the old image from Cloudinary
    if (existingKyc && existingKyc.status === "Rejected") {
        await cloudinary.uploader.destroy(existingKyc.documentImage.public_id);
    }
    
    const cloudinaryResponse = await cloudinary.uploader.upload(documentImage.tempFilePath, {
        folder: "BOOKNEST_KYC_DOCUMENTS"
    });

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
        return next(new ErrorHandler("Failed to upload document.", 500));
    }

    const kycDetails = {
        user: req.user._id,
        firstName,
        lastName,
        middleName,
        phone,
        documentType,
        documentImage: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
        status: "Pending", // Always set to Pending on new submission/resubmission
        rejectionReason: null, // Clear previous rejection reason
    };

    if (existingKyc) {
        // Update the existing rejected document
        await Kyc.findByIdAndUpdate(existingKyc._id, kycDetails, { new: true, runValidators: true });
    } else {
        // Create a new document
        await Kyc.create(kycDetails);
    }

    await User.findByIdAndUpdate(req.user._id, { kycStatus: "Pending" });

    res.status(201).json({
        success: true,
        message: "KYC details submitted successfully. Please wait for admin approval.",
    });
});

// User: Get their own KYC status
export const getMyKycStatus = catchAsyncErrors(async (req, res, next) => {
    const kyc = await Kyc.findOne({ user: req.user._id });
    const user = await User.findById(req.user._id).select("kycStatus");

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        status: user.kycStatus,
        details: kyc, // This will be null if not submitted
    });
});

// Admin: Get all KYC submissions
export const getAllKycSubmissions = catchAsyncErrors(async (req, res, next) => {
    const submissions = await Kyc.find().populate("user", "name email");
    res.status(200).json({
        success: true,
        submissions,
    });
});

// Admin: Update a user's KYC status
export const updateKycStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params; // This is the KYC submission ID
    const { status, rejectionReason } = req.body;

    if (!status || !["Verified", "Rejected"].includes(status)) {
        return next(new ErrorHandler("Invalid status provided.", 400));
    }

    const kycSubmission = await Kyc.findById(id);
    if (!kycSubmission) {
        return next(new ErrorHandler("KYC submission not found.", 404));
    }
    
    kycSubmission.status = status;
    if (status === "Rejected") {
        kycSubmission.rejectionReason = rejectionReason || "No reason provided.";
    }

    await kycSubmission.save();
    await User.findByIdAndUpdate(kycSubmission.user, { kycStatus: status });

    res.status(200).json({
        success: true,
        message: `User KYC has been ${status}.`,
    });
});