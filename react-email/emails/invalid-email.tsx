import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Text,
    Section,
    Link,
    Tailwind,
} from "@react-email/components";

export default function InvalidEmail() {
    return (
        <Html>
            <Head />
            <Tailwind>
                <Body className="bg-white font-sans text-zinc-900">
                    <Container className="mx-auto max-w-2xl px-5 py-10">
                        {/* Header */}
                        <Section className="mb-4 text-center">
                            <Heading className="mb-2 text-3xl font-semibold text-zinc-950">
                                Email Delivery Notice
                            </Heading>
                            <Text className="text-zinc-600">
                                The email address you are trying to reach does
                                not accept replies.
                            </Text>
                        </Section>

                        <Section>
                            <Text className="text-zinc-900">
                                If you are trying to reach me, and you think
                                this was a mistake, please contact me via my{" "}
                                <Link
                                    className="text-zinc-950 underline"
                                    href="https://ethanglenn.dev"
                                    target="_blank"
                                >
                                    website
                                </Link>
                                , and I will reply as soon as I can.
                            </Text>
                            <Text>- Ethan</Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
