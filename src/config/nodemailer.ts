import nodemailer from 'nodemailer';
export const nodemailerConfig = {
    service: process.env.MAIL_SERVICE || 'gmail',
    mail_user: process.env.MAIL_USER || 'harshpreet.75way@gmail.com',
    mail_pass: process.env.MAIL_PASS || 'ivnccezufcmbhjxu'
}

export const transporter = nodemailer.createTransport({
    service: nodemailerConfig.service,
    auth: {
        user: nodemailerConfig.mail_user,
        pass: nodemailerConfig.mail_pass
    }
});