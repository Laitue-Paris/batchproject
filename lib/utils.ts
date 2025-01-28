import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    month:'long',
    day: "numeric",
    year: "numeric"
  })
}

export function formatViews(totalViews: number): string {
  return `${totalViews === 1 ? "Vue" : "Vues"}`
}

export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response));
}