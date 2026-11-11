import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Post dates are plain YYYY-MM-DD strings. Building the Date from parts keeps
// it in local time, so the day never shifts across a timezone boundary.
export function formatPostDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function headingId(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")
}
