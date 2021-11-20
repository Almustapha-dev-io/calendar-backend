import Nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

import logger from './logger';

const transportOptions = {
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
};

const transport = Nodemailer.createTransport(sendgridTransport(transportOptions));

export const sendAccountVerification = async (email: string, token: string) => {
    await transport.sendMail({  
        to: email,
        from: process.env.MAILER,
        subject: 'Verify your email',
        html: `
            <p>By clicking on the following link, you are verifying your email</p>,
            <a href="${process.env.CLIENT_VERIFY_ACCOUNT}${token}">Verify</a>
        `
    }).catch(logger.error);
};


