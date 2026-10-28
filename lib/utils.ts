import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function headingId(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")
}
