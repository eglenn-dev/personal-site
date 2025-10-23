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

export default function InvalidEmail() {
    return (
        <Html>
            <Head />
            <Tailwind>
                <Body className="bg-zinc-950 font-sans text-zinc-50">
                    <Container className="mx-auto max-w-2xl px-5 py-10">
                        {/* Header */}
                        <Section className="mb-4 text-center">
                            <Heading className="mb-2 text-3xl font-semibold text-white">
                                Email Delivery Notice
                            </Heading>
                            <Text className="text-zinc-400">
                                The email address you are trying to reach does
                                not accept replies.
                            </Text>
                        </Section>

                        <Section>
                            <Text className="text-zinc-50">
                                If you are trying to reach me, and you think
                                this was a mistake, please contact me via my
                                website:{" "}
                                <Link
                                    className="text-white underline"
                                    href="https://ethanglenn.dev"
                                    target="_blank"
                                >
                                    ethanglenn.dev
                                </Link>
                            </Text>
                            <Text>- Ethan</Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
