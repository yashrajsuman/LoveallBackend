import validator from "validator";
import { Op } from "sequelize";
import { Business } from '../models/association.js';
import { hashPassword } from "../services/passwordHash.js";
import generateOTP from "../services/otpGenerator.js";
import sendMail from "../services/sendMail.js";
import { createJWT } from "../services/jwt.js";

const registerBusiness = async (req, res, next) => {
  const { 
    business_name, 
    business_email, 
     
    business_type, 
    entity_type, 
    contact_number, 
    gstin, 
    tan, 
    owner_name, 
    owner_contact_number 
  } = req.body;

  // Password requirements
  // const passwordRequirements = {
  //   minLength: 8,
  //   minLowercase: 1,
  //   minUppercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1,
  // };
  let errorMessage = "";

  // Validate fields and build an error message
  if (!business_name || !business_email || !business_type || !entity_type || !contact_number || !owner_name || !owner_contact_number || !gstin || !tan) {
    errorMessage = "All fields are compulsory.";
  } else if (!validator.isAlpha(owner_name.replace(/ /g, ''))) {
    errorMessage = "Owner name should contain only alphabets.";
  } else if (business_name.length > 50) {
    errorMessage = "Business name should not exceed 50 characters.";
  } else if (!validator.isEmail(business_email)) {
    errorMessage = "Please enter a valid email.";
  } else if (!validator.isMobilePhone(contact_number) || contact_number.length !== 10) {
    errorMessage = "Please enter a valid 10-digit contact number.";
  } else if (!validator.isMobilePhone(owner_contact_number) || owner_contact_number.length !== 10) {
    errorMessage = "Please enter a valid 10-digit owner contact number.";
  // } else if (!validator.isStrongPassword(password, passwordRequirements)) {
  //   errorMessage = "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.";
  } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/.test(gstin)) {
    errorMessage = "Please enter a valid GSTIN.";
  } else if (!/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(tan)) {
    errorMessage = "Please enter a valid TAN.";
  }

  // Error handler
  if (errorMessage) {
    const error = new Error(errorMessage);
    error.status = 400;
    return next(error);
  }

  try {
    const existingBusiness = await Business.findOne({
      where: {
        [Op.or]: [{ business_email }, { contact_number }, { gstin }, { tan }],
      },
    });
    if (existingBusiness) {
      const error = new Error("Business already exists with this email, contact number, GSTIN, or TAN.");
      error.status = 400;
      return next(error);
    }

    // Generate the hashed password
    //const password_hash = await hashPassword(password);

    // Generate the OTP
    const otp = generateOTP(6);

    // OTP expiration time
    const current_time = new Date();
    const expiration_time = process.env.OTP_EXPIRATION_TIME || 10;
    const otp_expiration_time = new Date(current_time.getTime() + expiration_time * 60000);
    const password_hash="";
    // Adding business into the database
    const newBusiness = await Business.create({
      business_name,
      business_email,
      password_hash,
      business_type,
      entity_type,
      contact_number,
      gstin,
      tan,
      owner_name,
      owner_contact_number,
      otp,
      otp_expiration_time
    });

    // Generate JWT
    const payload = {
      id: newBusiness.business_id,
      email: newBusiness.business_email
    };
    const token = createJWT(payload);

    // Send OTP to the business email
    const subject = "OTP Verification for Business Registration";
    sendMail(otp, business_email, subject);

    // Sending response back to the client
    res.status(201).json({
      message: "Business registered successfully",
      business: {
        business_id: newBusiness.business_id,
        business_name: newBusiness.business_name,
        business_email: newBusiness.business_email,
        contact_number: newBusiness.contact_number,
        owner_name: newBusiness.owner_name,
        owner_contact_number: newBusiness.owner_contact_number,
        gstin: newBusiness.gstin,
        tan: newBusiness.tan
      },
      token
    });
  } catch (error) {
    console.error("registerBusinessController\n" + error);
    return next(error);
  }
};

export default registerBusiness;
