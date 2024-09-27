const verifyOtp = (req, res, next) => {
    res.status(201).json({"success": true, "message": "Otp verified successfully"})
}

export default verifyOtp;