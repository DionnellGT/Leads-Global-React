import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        nuevo: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
        contactado:
          "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
        vendido:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
      },
    },
    defaultVariants: { variant: "default" },
  },
)

function Badge({
  className,
  variant,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
