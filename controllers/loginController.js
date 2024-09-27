const login = (req, res, next) => {
    res.status(201).json({ success: true, message: "User login successfully." });
}

export default login;