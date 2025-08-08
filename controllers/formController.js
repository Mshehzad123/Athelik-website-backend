import { sendFormSubmissionEmail } from "../utils/emailService.js";

// Handle form submission and send welcome email
export const submitForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }

    console.log("📝 Form submission received:", { firstName, lastName, email, phone });

    // Prepare form data for email
    const formData = {
      firstName,
      lastName,
      email,
      phone
    };

    // Send welcome email
    const emailSent = await sendFormSubmissionEmail(formData);

    if (emailSent) {
      console.log("✅ Form submission processed successfully");
      return res.status(200).json({
        success: true,
        message: "Thank you for joining the Athlekt family! Check your email for a welcome message."
      });
    } else {
      console.log("⚠️ Form submitted but email failed to send");
      return res.status(200).json({
        success: true,
        message: "Thank you for joining the Athlekt family! We'll be in touch soon."
      });
    }

  } catch (error) {
    console.error("❌ Form submission error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
};
