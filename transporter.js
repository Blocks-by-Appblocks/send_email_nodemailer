import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const { parsed: env } = dotenv.config({ path: '../.env.functions' });


const transporter = nodemailer.createTransport({
    service: env.EMAIL_HOST,
    secure: env.EMAIL_IS_SECURE || true,
    port:env.EMAIL_PORT || 465,

    auth: {
        user: env.EMAIL_ID, // configure your credentials in .env.functions file
        pass: env.EMAIL_PASSWORD, // configure your credentials in .env.functions file
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export default transporter