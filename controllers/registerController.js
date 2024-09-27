// registerController.js
const register = async (req, res, next) => {
    res.status(201).json({ success: true, message: "User registered successfully." });
};

export default register;
