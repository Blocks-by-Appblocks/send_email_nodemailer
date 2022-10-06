import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const { parsed: env } = dotenv.config({ path: '../.env.functions' });

const send_email_nodemailer = async (req, res) => {
    const { method, body = {} } = req;
    const { to, subject, message } = body;

    // health check
    if (req.params.health === 'health') {
        res.write(JSON.stringify({ success: true, msg: 'Health check success' }));
        res.end();
    }

    // block requests which is not a post method
    if (method !== 'POST') {
        res.write(JSON.stringify({ success: false, msg: `Only POST method is allowed` }));
        res.end();
    }

    if (!to || !subject || !message) {
        res.write(JSON.stringify({ success: false, msg: `to,subject,message fields are missing in the body` }));
        res.end();
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: env.GMAIL_ID, // configure your credentials in .env.functions file
            pass: env.GMAIL_PASSWORD, // configure your credentials in .env.functions file
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        to,
        from: env.GMAIL_ID, // configure your credentials in .env.functions file
        subject,
        html:message,
    };

    try {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.write(JSON.stringify({ success: false, msg: error }));
                res.end();
            } else {
                res.write(JSON.stringify({ success: true, msg: `Email send successfully` }));
                res.end();
            }
        });
    } catch (error) {
        res.write(JSON.stringify({ success: false, msg: 'Internal Error' }));
        res.end();
    }
};

export default send_email_nodemailer;
