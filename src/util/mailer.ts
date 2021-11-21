import Nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

import logger from './logger';

const transportOptions = {
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
};

const transport = Nodemailer.createTransport(sendgridTransport(transportOptions));

const getMailContent = (mailType: MailType, token: string) => {
    const opts = {
        [MailType.ACCOUNT_VERIFY]: {
            subject: 'Verify your email',
            html: `
                <p>By clicking on the following link, you are verifying your email.</p>
                <a href="${process.env.CLIENT_VERIFY_ACCOUNT}${token}">Verify</a>
            `
        },
        [MailType.PASSWORD_RESET]: {
            subject: 'Recover your password',
            html: `
                <p>Click on the following link to reset your password.</p>
                <a href="${process.env.CLIENT_PASSWORD_RESET}${token}">Verify</a>
            `
        }
    };

    return opts[mailType];
}

export const sendMail = async (email: string, token: string, mailType: MailType) => {
    const { subject, html } = getMailContent(mailType, token);

    try {
        await transport.sendMail({  
            to: email,
            from: process.env.MAILER,
            subject,
            html
        });
    } catch (err) {
        logger.error(err);
    }
};

export enum MailType {
    ACCOUNT_VERIFY = 'ACCOUNT_VERIFY',
    PASSWORD_RESET = 'PASSWORD_RESET'
};
