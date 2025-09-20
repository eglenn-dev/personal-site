"use client";
import type React from "react";
import { useState, useEffect } from "react";
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
import { useTheme } from "next-themes";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
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
            <div className="flex flex-col items-center text-center space-y-6 py-8">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400">
                        Message Sent Successfully!
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                        Thank you for reaching out! I&apos;ve received your
                        message and will get back to you as soon as possible.
                    </p>
                </div>
                <div className="space-y-3 flex gap-4 flex-col">
                    <p className="text-sm text-muted-foreground">
                        In the meantime, feel free to explore my other work
                    </p>
                    <div className="flex gap-2 items-center justify-center">
                        <Link href="/blog">
                            <Button className="group">
                                View Blog
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link href="/projects">
                            <Button className="group" variant="secondary">
                                View Projects
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
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
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="privacy"
                    name="privacy"
                    required
                    checked={acceptTerms}
                    onClick={() => setAcceptTerms((prev) => !prev)}
                    className="w-5 h-5"
                />
                <span>I agree to the</span>
                <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="link"
                            type="button"
                            className="p-0 h-auto underline"
                        >
                            Privacy Policy
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] rounded-lg sm:max-w-lg">
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
                                className="w-full"
                                onClick={() => {
                                    setAcceptTerms(true);
                                    setTermsOpen(false);
                                }}
                            >
                                Accept
                            </Button>
                            <DialogClose asChild>
                                <Button className="w-full" variant="secondary">
                                    Close
                                </Button>
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            {mounted && (
                <div
                    className="g-recaptcha rounded-md"
                    data-sitekey={process.env.NEXT_PUBLIC_CAPTCHA}
                    data-theme={theme === "dark" ? "dark" : "light"}
                ></div>
            )}
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
        </form>
    );
}
