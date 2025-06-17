"use server";
import sanitizeHtml from "sanitize-html";
import { Resend } from "resend";

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

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: "Ethan Glenn <ethan@hello.eglenn.dev>",
            to: userEmail,
            bcc: "ethan@eglenn.dev",
            subject: `Thanks for reaching out!`,
            text: `Hey ${safeName},

Thank you for reaching out! I received your message and will get back to you as soon as possible.

Reason for contact: ${safeReason}

Best regards,

Ethan Glenn`,
        });
    } else {
        return `Failed to verify captcha token: ${data}`;
    }
}
