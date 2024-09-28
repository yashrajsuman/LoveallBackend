import MAIL_TEMPLATE from "../config/mailTemplate.js"
import transporter from "../config/mailConfig.js";

const sendMail = (otp, to) => {
    const options = {
        from: process.env.EMAIL, // sender address
        to, // receiver email
        subject, // Subject line
        text: otp,
        html: MAIL_TEMPLATE(otp),
    }
    transporter.sendMail(options, (error, info) => {
        if (error) {
            return console.log('Error occurred: ' + error.message);
        }
        console.log('Email sent: ' + info.response);
    });
}

export default sendMail;