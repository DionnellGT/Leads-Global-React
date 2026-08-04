import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { isAxiosError } from "axios"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extrae un mensaje de error legible de una respuesta de NestJS
 * (que suele venir como { message: string | string[], statusCode, error })
 * o cae al mensaje por defecto si no logra interpretarlo.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined
    const message = data?.message
    if (Array.isArray(message)) return message[0] ?? fallback
    if (typeof message === "string") return message
  }
  return fallback
}
