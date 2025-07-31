import nodemailer from "nodemailer";

const testEmail = async () => {
  try {
    console.log("🧪 Testing Gmail SMTP...");
    
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "shehzadali.6714349@gmail.com",
        pass: "koqb gdpq uouj gygq"
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log("📧 Verifying connection...");
    await transporter.verify();
    console.log("✅ Connection verified!");

    console.log("📧 Sending test email...");
    const info = await transporter.sendMail({
      from: "shehzadali.6714349@gmail.com",
      to: "shehzadali.6714349@gmail.com",
      subject: "Test Email from Athelik",
      text: "This is a test email to verify SMTP is working.",
      html: "<h1>Test Email</h1><p>This is a test email from Athelik Backend.</p>"
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    
  } catch (error) {
    console.error("❌ Email test failed:", error);
    console.error("Error details:", error.message);
  }
};

testEmail(); 