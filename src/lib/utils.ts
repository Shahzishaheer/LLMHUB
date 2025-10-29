import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


// src/lib/utils.ts
// Utility to merge class names (for Tailwind/React)
export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}
