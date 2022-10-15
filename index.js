import dotenv from 'dotenv';
import transporter from './transporter.js';

const { parsed: env } = dotenv.config({ path: '../.env.functions' });

const send_email_nodemailer = async (req, res) => {
    const { method, body = {} } = req;
    const { to=null, subject=null, message=null } = body;


    // health check
    if (req.params.health === 'health') {
        res.write(JSON.stringify({ success: true, msg: 'Health check success' }));
        res.end();
    }

    // block requests which is not a post method
    if (method !== 'POST') {
        res.status(405).send({ success: false, msg: 'Only POST method is allowed' })

    }

    if (!to || !subject || !message) {
        res.status(400).send({ success: false, msg: 'to,subject,message fields are missing in the body'})

    }
    const mailOptions = {
        to,
        from: env.EMAIL_ID, // configure your credentials in .env.functions file
        subject,
        html:message,
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        res.status(200).send({ success: true, msg: 'Message send successfully',data:response})
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message })
        
    }
};

export default send_email_nodemailer;
