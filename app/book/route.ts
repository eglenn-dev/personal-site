import { redirect } from "next/navigation";

export function GET() {
    return redirect(process.env.BOOKING_URL ?? "/");
}
