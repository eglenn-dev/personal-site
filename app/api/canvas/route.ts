import { NextResponse } from "next/server";
import { getCanvasAssignments } from "@/lib/canvas";

export const GET = async (request: Request) => {
    try {
        // Parse query parameters for optional date filtering
        const { searchParams } = new URL(request.url);
        const dateParam = searchParams.get("date");

        let specificDate: Date | undefined;
        if (dateParam) {
            // Parse the date string as a local date (not UTC)
            // This ensures "2025-11-15" is treated as Nov 15 in MST, not UTC
            const dateParts = dateParam.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (!dateParts) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Invalid date parameter. Use ISO format (YYYY-MM-DD)",
                    },
                    { status: 400 }
                );
            }

            const [, year, month, day] = dateParts;
            specificDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
            );

            if (isNaN(specificDate.getTime())) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Invalid date parameter. Use ISO format (YYYY-MM-DD)",
                    },
                    { status: 400 }
                );
            }
        }

        const rangeDescription = specificDate
            ? `on ${specificDate.toLocaleDateString("en-US", { timeZone: "America/Denver" })}`
            : "in the next 7 days";

        console.log(
            `\nFetching Canvas assignments due ${rangeDescription}...`
        );

        const assignments = await getCanvasAssignments(specificDate);

        console.log(
            `\n========== CANVAS ASSIGNMENTS (${assignments.length}) ==========`
        );

        if (assignments.length === 0) {
            console.log(`No assignments found ${rangeDescription}!`);
        } else {
            assignments.forEach((assignment, index) => {
                console.log(`\n${index + 1}. ${assignment.name}`);
                console.log(`   Course: ${assignment.course_name}`);
                console.log(`   Due: ${assignment.due_at}`);
                console.log(`   Points: ${assignment.points_possible}`);
                console.log(`   URL: ${assignment.html_url}`);
            });
        }

        console.log("\n" + "=".repeat(60) + "\n");

        return NextResponse.json({
            success: true,
            count: assignments.length,
            range: rangeDescription,
            assignments: assignments.map((a) => ({
                name: a.name,
                course: a.course_name,
                due_at: a.due_at,
                points: a.points_possible,
                url: a.html_url,
                description: a.description,
            })),
        });
    } catch (error) {
        console.error("Failed to fetch Canvas assignments:", error);

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch assignments",
            },
            { status: 500 }
        );
    }
};
