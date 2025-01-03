import nodemailer from "nodemailer";

interface EmailOptions {
    options: {
        from: string;
        to: string;
        bcc: string;
        replyTo?: string;
        subject: string;
        text: string;
        html: string;
    };
}

export async function sendEmail(data: EmailOptions) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    transporter.sendMail(
        data.options,
        (error: Error | null | undefined, info: nodemailer.SentMessageInfo) => {
            if (error) {
                console.error(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        }
    );
}
