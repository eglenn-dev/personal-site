"use server";
import sanitizeHtml from "sanitize-html";
import { Resend } from "resend";
import ContactFormEmail from "../react-email/emails/contact-form";

export async function sendContactEmail(
    name: string,
    userEmail: string,
    reason: string,
    responseToken: string
): Promise<boolean> {
    if (responseToken === "") {
        console.error("Captcha token is empty");
        return false;
    }
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
            bcc: "ethan@ethanglenn.dev",
            subject: `Thanks for reaching out!`,
            react: ContactFormEmail({
                name: safeName,
                email: userEmail,
                message: safeReason,
            }),
        });
        console.log("Email sent successfully to ", userEmail);
        return true;
    } else {
        console.error("Captcha verification failed", data);
        return false;
    }
}
