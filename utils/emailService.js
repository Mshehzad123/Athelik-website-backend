import nodemailer from "nodemailer";

// Create transporter for Gmail with proper SMTP settings
export const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shehzadali.6714349@gmail.com",
      pass: "koqb gdpq uouj gygq"
    }
  });
};

export const sendOTPEmail = async (email, otp, type = "verification") => {
  try {
    console.log("📧 Attempting to send email to:", email);

    const transporter = createTransporter();

    const subject = type === "verification" 
      ? "Email Verification - Athelik" 
      : "Password Reset - Athelik";
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Athelik</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3 style="color: #333; margin-bottom: 20px;">
            ${type === "verification" ? "Email Verification" : "Password Reset"}
          </h3>
          <p style="color: #666; margin-bottom: 20px;">
            ${type === "verification" 
              ? "Please verify your email address by entering the OTP below:" 
              : "Please use the OTP below to reset your password:"}
          </p>
          <div style="background-color: #007bff; color: white; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">
            This OTP will expire in 10 minutes.
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: "shehzadali.6714349@gmail.com",
      to: email,
      subject: subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    // For development, still return true and log the OTP
    console.log(`📧 OTP for ${email}: ${otp} (Email failed - check console)`);
    return true; // Return true for testing
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}; 