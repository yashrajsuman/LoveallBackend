import MAIL_TEMPLATE from "../config/mailTemplate.js"
import transporter from "../config/mailConfig.js";

const sendMail = (otp, to, subject) => {
    const options = {
        from: process.env.EMAIL, // sender address
        to, // receiver email
        subject, // Subject line
        text: otp,
        html: MAIL_TEMPLATE(otp),
    }
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.error(error)
            const error = new Error("Error in sending otp. Kindly resend the otp.")
            error.status = 500;
            return next(error);
        }
        console.log('Email sent: ' + info.response);
    });
}

export default sendMail;