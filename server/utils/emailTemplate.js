export function generateVerificationOtpEmailTemplate(otpCode){
    return  `<div style="
    background:#fff;
    width:400px;
    padding:30px;
    border-radius:12px;
    box-shadow:0 6px 18px rgba(0,0,0,0.1);
    text-align:center;
    color:#333;
  ">
    <h2 style="color:#2f80ed; margin-bottom:10px;">Your Verification Code</h2>
    <p style="font-size:16px; color:#555; margin-bottom:30px;">
      Use the following One-Time Password (OTP) to complete your verification process. It is valid for 185 minutes.
    </p>
    <div style="
      font-size:36px;
      font-weight:700;
      letter-spacing:12px;
      background:#f0f4ff;
      border:2px dashed #2f80ed;
      padding:15px 40px;
      border-radius:8px;
      color:#2f80ed;
      user-select: all;
      margin-bottom: 30px;
      display: inline-block;
    ">
      ${otpCode}
    </div>
    <p style="font-size:14px; color:#999; margin-bottom:0;">
      If you did not request this code, please ignore this email.
    </p>
  </div>`
    
}

export function generateForgotPasswordEmailTemplate(resetPasswordUrl){
  return `
  <div style="
      background:#fff;
      width:400px;
      padding:30px;
      border-radius:12px;
      box-shadow:0 6px 18px rgba(0,0,0,0.1);
      text-align:center;
      color:#333;
    ">
      <h2 style="color:#2f80ed; margin-bottom:10px;">Password Reset</h2>
      <p style="font-size:16px; color:#555; margin-bottom:30px;">
        Click the button below to reset your password. The link is valid for 15 minutes.
      </p>

      <a href="${resetPasswordUrl}" target="_blank" style="
        background-color:#2f80ed;
        color:#fff;
        padding:12px 24px;
        text-decoration:none;
        border-radius:6px;
        font-weight:bold;
        font-size:16px;
        display:inline-block;
        margin-bottom:30px;
      ">
        Reset Password
      </a>

      <p style="font-size:14px; color:#999; margin-bottom:0;">
        If you did not request a password reset, please ignore this email.
      </p>
        <p style="font-size:14px; color:#999; margin-bottom:0;">
        ${resetPasswordUrl}
      </p>
    </div>
  `
}
