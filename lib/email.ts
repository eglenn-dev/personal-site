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
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
        const info = await transporter.sendMail(data.options);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
}
