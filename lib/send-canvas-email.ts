import { Resend } from "resend";
import CanvasAssignmentsEmail from "../react-email/emails/canvas-assignments";
import type { CanvasAssignmentWithCourse } from "@/lib/types";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendCanvasEmailResult {
    success: boolean;
    error?: string;
    emailId?: string;
}

/**
 * Send Canvas assignments email to owner
 * @param assignments - Array of Canvas assignments due today
 * @returns Result object with success status
 */
export async function sendCanvasAssignmentsEmail(
    assignments: CanvasAssignmentWithCourse[]
): Promise<SendCanvasEmailResult> {
    try {
        const fromEmail = process.env.FROM_EMAIL;
        const ownerEmail = process.env.OWNER_EMAIL;

        if (!fromEmail || !ownerEmail) {
            throw new Error(
                "FROM_EMAIL or OWNER_EMAIL environment variables not configured"
            );
        }

        // Format date for subject line
        const today = new Date();
        const dateString = today.toLocaleDateString("en-US", {
            timeZone: "America/Denver",
            month: "short",
            day: "numeric",
            year: "numeric",
        });

        const { data, error } = await resend.emails.send({
            from: `Canvas Assignments <${fromEmail}>`,
            to: ownerEmail,
            subject: `Canvas Assignments Due Today - ${dateString}`,
            react: CanvasAssignmentsEmail({
                assignments: assignments.map((a) => ({
                    name: a.name,
                    course_name: a.course_name,
                    due_at: a.due_at || "",
                    points_possible: a.points_possible,
                    html_url: a.html_url,
                    description: a.description,
                })),
            }),
        });

        if (error) {
            return {
                success: false,
                error: error.message,
            };
        }

        return {
            success: true,
            emailId: data?.id,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}
