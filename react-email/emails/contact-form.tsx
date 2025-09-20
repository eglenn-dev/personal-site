import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Text,
    Section,
    Hr,
    Link,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

interface ContactFormEmailProps {
    name: string;
    email: string;
    message: string;
}

export default function ContactFormEmail({
    name = "John Doe",
    email = "john@example.com",
    message = "Hello, I'd like to get in touch about a potential project.",
}: ContactFormEmailProps) {
    return (
        <Html>
            <Head />
            <Tailwind>
                <Body className="bg-zinc-950 font-sans text-zinc-50">
                    <Container className="mx-auto max-w-2xl px-5 py-10">
                        {/* Header */}
                        <Section className="mb-8 text-center">
                            <Heading className="mb-2 text-3xl font-semibold text-white">
                                Contact Form Submission
                            </Heading>
                            <Text className="text-zinc-400">
                                You reached out via the contact form on{" "}
                                <Link
                                    className="text-white underline"
                                    href="https://ethanglenn.dev"
                                    target="_blank"
                                >
                                    ethanglenn.dev
                                </Link>
                            </Text>
                        </Section>

                        <Section>
                            <Text>
                                Thanks for reaching out! I&apos;ve received your
                                message and will get back to you as soon as
                                possible. In the meantime, feel free to explore
                                some of{" "}
                                <Link
                                    className="text-white underline"
                                    target="_blank"
                                    href="https://ethanglenn.dev/blog"
                                >
                                    my thoughts
                                </Link>
                                .
                            </Text>
                            <Text>- Ethan</Text>
                        </Section>

                        <Hr className="my-8 border-zinc-700" />

                        {/* Contact Details */}
                        <Section className="mb-8">
                            <Heading className="mb-4 text-xl font-semibold text-zinc-50">
                                Contact Information
                            </Heading>

                            <div className="mb-4">
                                <Text className="mb-1 text-sm font-semibold tracking-wide text-zinc-400">
                                    NAME:{" "}
                                    <span className="text-zinc-50 font-normal">
                                        {name}
                                    </span>
                                </Text>
                            </div>

                            <div className="mb-4">
                                <Text className="mb-1 text-sm font-semibold tracking-wide text-zinc-400">
                                    EMAIL:{" "}
                                    <span className="text-zinc-50 font-normal">
                                        {email}
                                    </span>
                                </Text>
                            </div>
                        </Section>

                        <Hr className="my-8 border-zinc-700" />

                        {/* Message */}
                        <Section className="mb-8">
                            <Heading className="mb-4 text-xl font-semibold text-zinc-50">
                                Message
                            </Heading>
                            <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-5">
                                <Text className="whitespace-pre-wrap text-zinc-50 leading-relaxed">
                                    {message}
                                </Text>
                            </div>
                        </Section>

                        <Hr className="my-8 border-zinc-700" />

                        {/* Footer */}
                        <Section className="mt-10 text-center">
                            <Text className="mb-2 text-sm text-zinc-500">
                                This message was sent from the contact form on{" "}
                                <Link
                                    className="text-white underline"
                                    href="https://ethanglenn.dev/contact"
                                    target="_blank"
                                >
                                    ethanglenn.dev/contact
                                </Link>
                                . If you were not the intended recipient, feel
                                free to let me know, or disregard this email.
                            </Text>
                            <Text className="mb-2 text-sm text-zinc-500">
                                &copy; {new Date().getFullYear()} Ethan Glenn
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
