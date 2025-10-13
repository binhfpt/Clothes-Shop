import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'
import User from '../models/user'

type emailProps = {
    email: string,
    emailType: string,
    userId: string,
    resetPasswordLink?: string
}

export const sendEmail = async ({ email, emailType, userId }: emailProps) => {
    //TODO: config something idk but not now
    // config send token verify email
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
        await User.findByIdAndUpdate(userId,
            {
                $set: {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                }

            })
    }
    else if (emailType === "RESET") {
        await User.findByIdAndUpdate(userId,
            {
                $set: {
                    forgotPasswordLink: `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`,
                    forgotPasswordLinkExpiry: Date.now() + 3600000
                }

            })
    }
    //
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_DEVER,
                pass: process.env.APP_PASSWORD_MAILER,
            },
        });
        const mailPayload = {
            from: 'binhpthe181706@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            text: "Watch invincible asap", // plain‑text body
            html: emailType === "VERIFY" ? `<a href="${process.env.DOMAIN}/verify?token=${hashedToken}">Click me!</a>` : `<b> reset password here:<a href="${process.env.DOMAIN}/reset?token=${hashedToken}">Click on me!</a></b>`, // HTML body
        }
        const mailRes = await transporter.sendMail(mailPayload)
        return mailRes
    } catch (error: any) {
        throw new Error(error.message)
    }

}