import type {
    CanvasAssignment,
    CanvasCourse,
    CanvasAssignmentWithCourse,
} from "@/lib/types";

// MST timezone identifier
const MST_TIMEZONE = "America/Denver";

/**
 * Get date range for the next 7 days from now (rolling window)
 */
function getNext7DaysRange() {
    // Get current date/time in MST
    const now = new Date();
    const mstNow = new Date(
        now.toLocaleString("en-US", { timeZone: MST_TIMEZONE })
    );

    // Start from the beginning of today in MST
    const start = new Date(mstNow);
    start.setHours(0, 0, 0, 0);

    // End 7 days from now at 11:59:59 PM MST
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    end.setHours(23, 59, 59, 999);

    return {
        start,
        end,
    };
}

/**
 * Get date range for a specific date (00:00:00 to 23:59:59 on that date in MST)
 */
function getSpecificDateRange(targetDate: Date) {
    // Convert to MST
    const mstDate = new Date(
        targetDate.toLocaleString("en-US", { timeZone: MST_TIMEZONE })
    );

    // Start at beginning of day
    const start = new Date(mstDate);
    start.setHours(0, 0, 0, 0);

    // End at end of day
    const end = new Date(mstDate);
    end.setHours(23, 59, 59, 999);

    return {
        start,
        end,
    };
}

/**
 * Check if an assignment is due within the given date range
 */
function isDueInRange(dueAt: string | null, start: Date, end: Date): boolean {
    if (!dueAt) return false;

    // Convert Canvas due date to MST
    const dueDate = new Date(dueAt);
    const dueDateMST = new Date(
        dueDate.toLocaleString("en-US", { timeZone: MST_TIMEZONE })
    );

    return dueDateMST >= start && dueDateMST <= end;
}

/**
 * Fetch all enrolled courses from Canvas
 */
async function fetchCourses(): Promise<CanvasCourse[]> {
    const baseUrl = process.env.CANVAS_BASE_URL;
    const token = process.env.CANVAS_API_TOKEN;

    if (!baseUrl || !token) {
        throw new Error("Canvas API credentials not configured");
    }

    const response = await fetch(
        `${baseUrl}/api/v1/courses?enrollment_state=active&per_page=100`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.text();
        console.error("Error fetching Canvas courses:", errorData);
        throw new Error(`Canvas API error: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch assignments for a specific course
 */
async function fetchCourseAssignments(
    courseId: number
): Promise<CanvasAssignment[]> {
    const baseUrl = process.env.CANVAS_BASE_URL;
    const token = process.env.CANVAS_API_TOKEN;

    if (!baseUrl || !token) {
        throw new Error("Canvas API credentials not configured");
    }

    const response = await fetch(
        `${baseUrl}/api/v1/courses/${courseId}/assignments?per_page=100`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.text();
        console.error(
            `Error fetching assignments for course ${courseId}:`,
            errorData
        );
        return [];
    }

    return response.json();
}

/**
 * Fetch Canvas assignments
 * @param specificDate - Optional. If provided, returns assignments due on that specific date only.
 *                       If not provided, returns assignments due in the next 7 days.
 * @returns Array of assignments with course information
 */
export async function getCanvasAssignments(
    specificDate?: Date
): Promise<CanvasAssignmentWithCourse[]> {
    try {
        // Determine date range based on whether a specific date was provided
        const { start, end } = specificDate
            ? getSpecificDateRange(specificDate)
            : getNext7DaysRange();

        const courses = await fetchCourses();

        const assignmentsPromises = courses.map(async (course) => {
            const assignments = await fetchCourseAssignments(course.id);

            const matchingAssignments = assignments.filter((assignment) =>
                isDueInRange(assignment.due_at, start, end)
            );

            return matchingAssignments.map((assignment) => ({
                ...assignment,
                course_name: course.name,
            }));
        });

        const assignmentArrays = await Promise.all(assignmentsPromises);
        const results = assignmentArrays.flat();

        return results;
    } catch (error) {
        console.error("Error fetching Canvas assignments:", error);
        throw error;
    }
}
