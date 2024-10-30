// businessAuthRoute.js
import { Router } from 'express';
import businessRegister from '../controllers/BusinessRegister.js';
import businessLogin from '../controllers/BusinessLogin.js';
import businessVerifyOtp from '../controllers/BusinessVerifyOtp.js';
import businessForgetPassword from '../controllers/BForgetPassword.js';
import businessSendOTP from '../controllers/BSendOtp.js';
import manualverify from '../controllers/manualverification.js';
import changePassword from '../controllers/BChangePassword.js';

const router = Router(); // Instantiate the Router

// Define the route and associate it with the controller
router.post('/register', businessRegister);       // Business Register route
router.post('/login', businessLogin);             // Business Login route
router.post('/forget-password', businessForgetPassword);  // Business Forget Password route
router.post('/verify-otp', businessVerifyOtp);    // Business Verify OTP route
router.post('/send-otp', businessSendOTP);        // Business Send OTP route
router.post('/manualverify', manualverify);        // Business Send OTP route
router.post('/ChangePass', changePassword);        // Business Send OTP route

// Export the router as the default export
export default router;
