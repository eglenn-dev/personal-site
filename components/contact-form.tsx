"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendContactEmail } from "@/app/actions";

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        };
    }, [error]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitSuccess(false);
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("name")?.toString() || "";
        const email = formData.get("email")?.toString() || "";
        const message = formData.get("message")?.toString() || "";
        const responseToken =
            formData.get("g-recaptcha-response")?.toString() || "";

        if (!name || !email || !message || !responseToken) {
            setIsSubmitting(false);
            return;
        }
        const response = await sendContactEmail(
            name,
            email,
            message,
            responseToken
        );
        if (!response) {
            setError(true);
            setIsSubmitting(false);
            setTimeout(() => setError(false), 5000);
            return;
        }
        setIsSubmitting(false);
        setSubmitSuccess(true);
    }

    if (error) {
        return (
            <div>
                <p className="text-red-600 mt-4">
                    An error occurred while sending your message. Please try
                    again later.
                </p>
            </div>
        );
    }

    if (submitSuccess) {
        return (
            <div>
                <p className="text-green-600 mt-4">
                    Thank you for your message! I&#39;ll get back to you soon.
                </p>
            </div>
        );
    }

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name</label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your Email"
                    required
                />
            </div>
            <div>
                <label htmlFor="message">Message</label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="Your Message"
                    className="h-24"
                    required
                />
            </div>
            <div
                className="g-recaptcha rounded-md"
                data-sitekey="6LeyQHUqAAAAAKBc193G987C3kL40yFHwAmg-LQ5"
            ></div>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
        </form>
    );
}
