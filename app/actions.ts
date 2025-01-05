"use server";
import sanitizeHtml from "sanitize-html";
import { sendEmail } from "@/lib/email";

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

export async function sendContactEmail(
    name: string,
    userEmail: string,
    reason: string,
    responseToken: string
) {
    if (responseToken === "") return "";
    const response = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `secret=${process.env.CAPTCHA_SECRET_KEY}&response=${responseToken}`,
        }
    );
    const data = await response.json();
    if (data.success && data.hostname === process.env.DOMAIN) {
        const safeName = sanitizeHtml(name);
        const safeReason = sanitizeHtml(reason);

        const data: EmailOptions = {
            options: {
                from: "no-reply@eglenn.dev",
                to: userEmail,
                bcc: "ethansglenn@gmail.com",
                replyTo: "no-reply@eglenn.dev",
                subject: "Thanks for Reaching Out!",
                text: `Hey ${safeName}, Thank you for reaching out to me. I've got your email and will get back to you as soon as possible. Reason: ${safeReason}`,
                html: `<p>Hey ${safeName},</p><p>Thank you for reaching out to me. I've got your email and will get back to you as soon as possible.</p><p>Reason: ${safeReason}</p><p>- Ethan</p>`,
            },
        };
        await sendEmail(data);
    } else {
        return `Failed to verify captcha token: ${data}`;
    }
}
