import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1 p-4 pb-2", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-sm font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardValue({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="card-value"
      className={cn("text-2xl font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("p-4 pt-2", className)} {...props} />
  )
}

export { Card, CardHeader, CardTitle, CardValue, CardContent }
