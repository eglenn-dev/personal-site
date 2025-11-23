import { NextResponse } from "next/server";
import { getCanvasAssignments } from "@/lib/canvas";
import { sendCanvasAssignmentsEmail } from "@/lib/send-canvas-email";

export const GET = async () => {
    try {
        // Get today's date in MST
        const today = new Date();
        const todayMST = today.toLocaleDateString("en-US", {
            timeZone: "America/Denver",
            month: "long",
            day: "numeric",
            year: "numeric",
        });

        // Fetch assignments due today
        const assignments = await getCanvasAssignments(today);

        // If no assignments, don't send email
        if (assignments.length === 0) {
            return NextResponse.json({
                success: true,
                sent: false,
                count: 0,
                message: "No assignments due today",
                date: todayMST,
            });
        }

        // Send email with today's assignments
        const emailResult = await sendCanvasAssignmentsEmail(assignments);

        if (!emailResult.success) {
            console.error("❌ Failed to send email:", emailResult.error);
            return NextResponse.json(
                {
                    success: false,
                    sent: false,
                    count: assignments.length,
                    error: emailResult.error || "Failed to send email",
                    date: todayMST,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            sent: true,
            count: assignments.length,
            emailId: emailResult.emailId,
            date: todayMST,
            assignments: assignments.map((a) => ({
                name: a.name,
                course: a.course_name,
                due_at: a.due_at,
            })),
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                sent: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error occurred",
            },
            { status: 500 }
        );
    }
};
