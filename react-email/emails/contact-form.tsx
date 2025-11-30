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
                <Body className="bg-white font-sans text-zinc-900">
                    <Container className="mx-auto max-w-2xl px-5 py-10">
                        {/* Header */}
                        <Section className="mb-8 text-center">
                            <Heading className="mb-2 text-3xl font-semibold text-zinc-950">
                                Contact Form Submission
                            </Heading>
                            <Text className="text-zinc-600">
                                You reached out via the contact form on{" "}
                                <Link
                                    className="text-zinc-950 underline"
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
                                possible.
                            </Text>
                            <Text>- Ethan</Text>
                        </Section>

                        <Hr className="my-8 border-zinc-200" />

                        {/* Contact Details */}
                        <Section className="mb-8">
                            <Heading className="mb-4 text-xl font-semibold text-zinc-950">
                                Contact Information
                            </Heading>

                            <div className="mb-4">
                                <Text className="mb-1 text-sm font-semibold tracking-wide text-zinc-600">
                                    NAME:{" "}
                                    <span className="text-zinc-900 font-normal">
                                        {name}
                                    </span>
                                </Text>
                            </div>

                            <div className="mb-4">
                                <Text className="mb-1 text-sm font-semibold tracking-wide text-zinc-600">
                                    EMAIL:{" "}
                                    <span className="text-zinc-900 font-normal">
                                        {email}
                                    </span>
                                </Text>
                            </div>
                        </Section>

                        <Hr className="my-8 border-zinc-200" />

                        {/* Message */}
                        <Section className="mb-8">
                            <Heading className="mb-4 text-xl font-semibold text-zinc-950">
                                Message
                            </Heading>
                            <div className="rounded-lg border border-zinc-300 bg-zinc-100 p-5">
                                <Text className="whitespace-pre-wrap text-zinc-900 leading-relaxed">
                                    {message}
                                </Text>
                            </div>
                        </Section>

                        <Hr className="my-8 border-zinc-200" />

                        {/* Footer */}
                        <Section className="mt-10 text-center">
                            <Text className="mb-2 text-sm text-zinc-600">
                                This message was sent from the contact form on{" "}
                                <Link
                                    className="text-zinc-950 underline"
                                    href="https://ethanglenn.dev/contact"
                                    target="_blank"
                                >
                                    ethanglenn.dev/contact
                                </Link>
                                . If you were not the intended recipient, feel
                                free to let me know, or disregard this email.
                            </Text>
                            <Text className="mb-2 text-sm text-zinc-600">
                                &copy; {new Date().getFullYear()} Ethan Glenn
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
