import { generateVerificationOtpEmailTemplate } from "./emailTemplate.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(verificationCode,email,res) {
    try{
        const message =generateVerificationOtpEmailTemplate(verificationCode);

        sendEmail({
            email,
            subject:"Verification Code(Book Nest Library Management system",
            message,
        });
        res.status(200).json({
            success:true,
            message:"Verification Code Sent Successfully",
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message:"verification code failed to send",
        })
    }
    
}