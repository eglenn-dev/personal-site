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

interface Assignment {
    name: string;
    course_name: string;
    due_at: string;
    points_possible: number;
    html_url: string;
}

interface CanvasAssignmentsEmailProps {
    assignments: Assignment[];
    date?: string;
}

export default function CanvasAssignmentsEmail({
    assignments = [
        {
            name: "Sample Assignment",
            course_name: "Sample Course",
            due_at: "2025-11-23T23:59:00Z",
            points_possible: 100,
            html_url: "https://canvas.instructure.com",
        },
        {
            name: "Sample Assignment 2",
            course_name: "Sample Course",
            due_at: "2025-11-23T23:59:00Z",
            points_possible: 100,
            html_url: "https://canvas.instructure.com",
        },
    ],
    date = new Date().toLocaleDateString("en-US", {
        timeZone: "America/Denver",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }),
}: CanvasAssignmentsEmailProps) {
    const formatDueTime = (dueAt: string) => {
        const date = new Date(dueAt);
        return date.toLocaleString("en-US", {
            timeZone: "America/Denver",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <Html>
            <Head />
            <Tailwind>
                <Body className="bg-zinc-950 font-sans text-zinc-50">
                    <Container className="mx-auto max-w-2xl px-4 py-6">
                        {/* Header */}
                        <Section className="mb-6">
                            <Heading className="mb-1 text-2xl font-semibold text-white">
                                Assignments Due Today
                            </Heading>
                            <Text className="text-sm text-zinc-400">
                                {date}
                            </Text>
                        </Section>

                        {/* Assignments List */}
                        {assignments.map((assignment, index) => (
                            <div key={index}>
                                <Section className="mb-6">
                                    <Heading className="mb-2 text-lg font-semibold text-white">
                                        {assignment.name}
                                    </Heading>

                                    <Text className="mb-2 text-sm text-zinc-300">
                                        {assignment.course_name} • Due{" "}
                                        {formatDueTime(assignment.due_at)} MST •{" "}
                                        {assignment.points_possible} pts
                                    </Text>

                                    <div className="mt-3">
                                        <Link
                                            className="inline-block rounded-md bg-white px-2 py-1 text-sm font-semibold text-black no-underline"
                                            href={assignment.html_url}
                                            target="_blank"
                                        >
                                            View in Canvas
                                        </Link>
                                    </div>
                                </Section>
                                {index < assignments.length - 1 && (
                                    <Hr className="my-4 border-zinc-800" />
                                )}
                            </div>
                        ))}

                        {/* Footer */}
                        <Section className="mt-8 text-center">
                            <Text className="text-xs text-zinc-600">
                                Daily Canvas reminder • &copy;{" "}
                                {new Date().getFullYear()} Ethan Glenn
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
