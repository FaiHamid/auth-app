import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

const send = (email, subject, html) => {

    return transporter.sendMail({
        to: email,
        subject,
        html
    });
}

export const sendActivationEmail = (email, activationToken) => {

    const activationHref = `${process.env.HOST}/activate/${activationToken}`;

    const html = `
        <div>
            <h1>Activate your account</h1>
            <p>Click the link below to activate your account:</p>
            <a href="${activationHref}">${activationHref}</a>
        </div>
    `;

    const subject = "Activate your acccount";
    return send(email, subject, html);
}





