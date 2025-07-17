import { Resend } from "resend";

export async function sendAlertEmail(
    to: string,
    subject: string,
    text: string
): Promise<void> {
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        await resend.emails.send({
            from: "Alert - ethanglenn.dev <alert@hello.eglenn.dev>",
            to,
            subject,
            text,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
}
