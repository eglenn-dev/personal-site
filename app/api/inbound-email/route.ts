import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { Webhook } from "svix";
import InvalidEmail from "@/react-email/emails/invalid-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (request: NextRequest) => {
    const payload = await request.text();

    try {
        const wh = new Webhook(process.env.RESEND_WEBHOOK_SECRET || "");
        wh.verify(payload, {
            "svix-id": request.headers.get("svix-id") || "",
            "svix-timestamp": request.headers.get("svix-timestamp") || "",
            "svix-signature": request.headers.get("svix-signature") || "",
        });
    } catch {
        console.error("Invalid webhook signature", request.headers);
        return new NextResponse("Invalid webhook", { status: 400 });
    }

    const event = JSON.parse(payload);

    if (event.type === "email.received") {
        const { data, error } = await resend.emails.send({
            from: `Email Delivery <${process.env.NO_REPLY_EMAIL || ""}>`,
            to: event.data.from,
            subject: `Re: ${event.data.subject}`,
            react: InvalidEmail(),
            text: `The email address you are trying to reach does not exist.`,
            headers: {
                "In-Reply-To": event.data.message_id,
            },
        });

        if (error) {
            console.error("Failed to send invalid email response", error);
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json(data);
    }

    return NextResponse.json({});
};
