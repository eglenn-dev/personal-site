"use server";
import sanitizeHtml from "sanitize-html";
import { Resend } from "resend";
import { render } from "@react-email/components";
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

    const SCORE_THRESHOLD = 0.5;
    const isHuman =
        data.success &&
        data.hostname === process.env.DOMAIN &&
        typeof data.score === "number" &&
        data.score >= SCORE_THRESHOLD &&
        data.action === "contact";

    if (isHuman) {
        const safeName = sanitizeHtml(name);
        const safeReason = sanitizeHtml(reason);

        const resend = new Resend(process.env.RESEND_API_KEY);

        const emailHtml = await render(
            ContactFormEmail({
                name: safeName,
                email: userEmail,
                message: safeReason,
            })
        );

        await resend.emails.send({
            from: `${safeName} Form Submission <${process.env.FROM_EMAIL || ""}>`,
            to: process.env.OWNER_EMAIL || "",
            replyTo: userEmail,
            subject: `Contact from ${safeName}`,
            html: emailHtml,
        });

        await resend.emails.send({
            from: `Ethan Glenn <${process.env.FROM_EMAIL || ""}>`,
            to: userEmail,
            subject: `Thanks for reaching out!`,
            html: emailHtml,
        });

        return true;
    } else {
        console.error("Captcha verification failed", data);
        return false;
    }
}
