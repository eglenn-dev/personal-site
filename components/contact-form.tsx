"use client";
import { useState, useEffect } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { sendContactEmail } from "@/app/actions";
import Link from "next/link";

interface ReCaptchaV3 {
    ready: (cb: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

declare global {
    interface Window {
        grecaptcha?: ReCaptchaV3;
    }
}

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState<boolean>(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);

    useEffect(() => {
        queueMicrotask(() => {
            if (sessionStorage.getItem("contactFormSuccess") === "true") {
                setSubmitSuccess(true);
            }
        });
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitSuccess(false);
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("name")?.toString() || "";
        const email = formData.get("email")?.toString() || "";
        const message = formData.get("message")?.toString() || "";

        if (!name || !email || !message) {
            setIsSubmitting(false);
            return;
        }

        const siteKey = process.env.NEXT_PUBLIC_CAPTCHA;
        const captcha = window.grecaptcha;
        const failWithError = () => {
            setError(true);
            setIsSubmitting(false);
            setTimeout(() => setError(false), 5000);
        };

        if (!captcha || !siteKey) {
            // Script not loaded yet (very fast submit) or misconfigured key.
            failWithError();
            return;
        }

        let responseToken = "";
        try {
            responseToken = await new Promise<string>((resolve, reject) => {
                captcha.ready(() => {
                    captcha
                        .execute(siteKey, { action: "contact" })
                        .then(resolve)
                        .catch(reject);
                });
            });
        } catch {
            failWithError();
            return;
        }

        if (!responseToken) {
            failWithError();
            return;
        }

        const response = await sendContactEmail(
            name,
            email,
            message,
            responseToken,
        );

        if (!response) {
            failWithError();
            return;
        }

        setIsSubmitting(false);
        setSubmitSuccess(true);
        sessionStorage.setItem("contactFormSuccess", "true");
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
            <div className="py-8">
                <h3 className="text-lg font-semibold mb-2">Message sent</h3>
                <p className="text-muted-foreground mb-6">
                    Thanks for reaching out. I&apos;ll get back to you as soon
                    as possible.
                </p>
                <div className="flex gap-3">
                    <Link href="/blog">
                        <Button size="sm">View Blog</Button>
                    </Link>
                    <Link href="/projects">
                        <Button size="sm" variant="secondary">
                            View Projects
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <Script
                src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_CAPTCHA}`}
                strategy="afterInteractive"
            />
            <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium">
                    Name
                </label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                />
            </div>
            <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                    Email
                </label>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your email"
                    required
                />
            </div>
            <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-medium">
                    Message
                </label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message"
                    className="h-32"
                    required
                />
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <Checkbox
                    id="privacy"
                    name="privacy"
                    required
                    checked={acceptTerms}
                    onClick={() => setAcceptTerms((prev) => !prev)}
                />
                <span>I agree to the</span>
                <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="link"
                            type="button"
                            className="p-0 h-auto underline text-sm"
                        >
                            Privacy Policy
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Privacy Policy</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="mb-6">
                                By submitting this form, you agree to the
                                following:
                            </p>
                            <ul className="list-disc list-outside pl-6 space-y-2">
                                <li>
                                    You will receive a response via email to the
                                    provided email address.
                                </li>
                                <li>
                                    Your information will be kept confidential
                                    and used solely for the purpose of
                                    responding to your inquiry.
                                </li>
                                <li>
                                    Your email will only be saved in server
                                    logs, and my personal email inbox for the
                                    purpose of responding to your inquiry.
                                </li>
                            </ul>
                        </div>
                        <div className="w-full flex items-center justify-end gap-4">
                            <Button
                                className="w-full shrink"
                                onClick={() => {
                                    setAcceptTerms(true);
                                    setTermsOpen(false);
                                }}
                            >
                                Accept
                            </Button>
                            <DialogClose asChild>
                                <Button
                                    className="w-full shrink"
                                    variant="secondary"
                                >
                                    Close
                                </Button>
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
            <p className="text-xs text-muted-foreground">
                This site is protected by reCAPTCHA and the Google{" "}
                <a
                    href="https://policies.google.com/privacy"
                    className="underline"
                >
                    Privacy Policy
                </a>{" "}
                and{" "}
                <a
                    href="https://policies.google.com/terms"
                    className="underline"
                >
                    Terms of Service
                </a>{" "}
                apply.
            </p>
        </form>
    );
}
