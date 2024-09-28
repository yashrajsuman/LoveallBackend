import validator from "validator";
import sequelize from "../config/dbConfig.js";

const register = async (req, res, next) => {
    const {name, email, phone, password} = req.body;

    // Password structure
    const passwordReqirement = {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }
    let errorMessage = "";

    // Validate fields and build an error message
    if (!name || !email || !phone || !password) {
        errorMessage = "All fields are compulsory.";
    } else if (!validator.isEmail(email)) {
        errorMessage = "Please enter a valid email.";
    } else if (!validator.isNumeric(phone) || phone.length !== 10) {
        errorMessage = "Please enter a valid 10-digit phone number.";
    } else if (!validator.isStrongPassword(password, passwordReqirement)) {
        errorMessage = "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
    }

    // Error handler
    if (errorMessage) {
        const error = new Error(errorMessage);
        error.status = 400;  // Bad Request
        return next(error);
    }


    res.status(201).json(req.body);
};

export default register;
