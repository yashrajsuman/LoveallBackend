const forgetPassword = (req, res, next) => {
    res.status(201).json({"success": true, "message": "Forget link sent successfully"});
}

export default forgetPassword;