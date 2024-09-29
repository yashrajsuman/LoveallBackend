import User from "../models/user.js";
import { verifyJWT } from "../services/jwt.js";

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({message: "No token provided", redirectTo: "login"});
    }
    try {
        const decoded = verifyJWT(token);
        const user = await User.findByPk(decoded.user_id);
        if (!user) {
            return res.status(403).json({
                message: "Unauthorized! Kindly register",
                redirectTo: "register"
            });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({
            message: "Unauthorized! Kindly register",
            redirectTo: "register"
        });
    }
}
export default authMiddleware;