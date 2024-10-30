import { Business } from '../models/association.js';
import BsendMail from "../services/BsendMail.js";

const verifyBusinessOtp = async (req, res, next) => {
  try {
    const { business_email, otp } = req.body;

    // Check if email and OTP fields are present
    if (!business_email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP fields should not be empty" });
    }

    // Find the business by email
    const business = await Business.findOne({ where: { business_email } });

    // Check if the business exists in the database
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not registered.", redirectTo: "register" });
    }

    // Check if the business is already verified
    if (business.verified) {
      return res.status(404).json({ success: false, message: "This business is already verified." });
    }

    // Check if the entered OTP is correct
    if (business.otp !== otp) {
      return res.status(401).json({ success: false, message: "Incorrect verification code." });
    }

    // Check if the OTP has expired
    const current_time = new Date().getTime();
    const expiration_time = new Date(business.otp_expiration_time).getTime();
    if (current_time > expiration_time) {
      return res.status(403).json({ success: false, message: "OTP has expired. Please resend the OTP." });
    }

    // Update the business as verified
    const [updatedBusiness] = await Business.update(
      { otp: null, verified: true },
      { where: { business_email } }
    );

    // Send a thank-you email after successful verification
    const subject = "Business Registration Successful";
    //const message = "Thank you for registering your business with us!";
    BsendMail(business_email, subject,"");

    return res.status(200).json({ success: true, message: "Business successfully verified" });
  } catch (error) {
    return next(error);
  }
};

export default verifyBusinessOtp;
