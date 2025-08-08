import nodemailer from "nodemailer";

// Create transporter for Mandrill SMTP with new credentials
export const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.mandrillapp.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || "Athlekt",
      pass: process.env.EMAIL_PASS || "md-2bFOzTgMNPHJH1Wi0AcvJg"
    }
  });
};

// New function for sending form submission emails
export const sendFormSubmissionEmail = async (formData) => {
  try {
    console.log("📧 Attempting to send form submission email to:", formData.email);

    const transporter = createTransporter();

    const subject = "Welcome to the Athlekt Family!";
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <div style="background-color: #2a2a2a; padding: 30px; text-align: center;">
          <h1 style="color: #cbf26c; margin: 0; font-size: 28px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
            ATHLEKT
          </h1>
        </div>
        
        <div style="padding: 30px; background-color: white;">
          <h2 style="color: #333; margin-bottom: 20px; font-size: 24px;">
            Welcome to the Athlekt Family! 🏋️‍♂️
          </h2>
          
          <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">
            Thank you for joining the Athlekt family! We're excited to have you on board.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px; font-size: 18px;">Your Information:</h3>
            <p style="color: #666; margin: 5px 0;"><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${formData.email}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Phone:</strong> ${formData.phone}</p>
          </div>
          
          <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">
            We'll keep you updated with the latest news, exclusive offers, and fitness tips to help you achieve your goals.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #cbf26c; color: #2a2a2a; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
              EXPLORE OUR PRODUCTS
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px; text-align: center;">
            Thank you for choosing Athlekt! 💪
          </p>
        </div>
        
        <div style="background-color: #2a2a2a; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 12px;">
            © 2024 Athlekt. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "marketing@athlekt.com",
      to: formData.email,
      subject: subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Form submission email sent successfully to ${formData.email}`);
    return true;
  } catch (error) {
    console.error("Form submission email sending error:", error);
    return false;
  }
};

export const sendOTPEmail = async (email, otp, type = "verification") => {
  try {
    console.log("📧 Attempting to send email to:", email);

    const transporter = createTransporter();

    const subject = type === "verification" 
      ? "Email Verification - Athlekt" 
      : "Password Reset - Athlekt";
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Athlekt</h2>
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
      from: process.env.EMAIL_FROM || "marketing@athlekt.com",
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