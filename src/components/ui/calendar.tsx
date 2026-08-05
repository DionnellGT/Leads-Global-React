import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, type DayButtonProps } from "react-day-picker"
import "react-day-picker/style.css"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn("p-3", className)}
      classNames={{
        root: "w-fit",
        months: "flex flex-col gap-4",
        month: "flex flex-col gap-3",
        month_caption: "flex items-center justify-center gap-2 px-8",
        caption_label: "text-sm font-medium",
        dropdowns: "flex items-center gap-1.5 text-sm font-medium",
        dropdown_root:
          "relative rounded-md border border-input has-focus:ring-2 has-focus:ring-ring/50",
        dropdown: "absolute inset-0 opacity-0",
        months_dropdown: "px-2 py-1",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between px-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 p-0",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 p-0",
        ),
        month_grid: "w-full border-collapse mt-2",
        weekdays: "flex",
        weekday:
          "w-8 text-center text-xs font-normal text-muted-foreground",
        week: "flex w-full mt-1",
        day: "relative size-8 p-0 text-center text-sm",
        day_button: cn(
          "size-8 rounded-md p-0 font-normal text-foreground transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "aria-selected:opacity-100",
        ),
        range_start: "rounded-l-md bg-accent",
        range_end: "rounded-r-md bg-accent",
        range_middle: "bg-accent/50",
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
        today: "[&>button]:border [&>button]:border-primary",
        outside: "text-muted-foreground/40",
        disabled: "text-muted-foreground/40 opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
          if (orientation === "left")
            return <ChevronLeft className={cn("size-4", chevronClassName)} {...chevronProps} />
          if (orientation === "right")
            return <ChevronRight className={cn("size-4", chevronClassName)} {...chevronProps} />
          return <ChevronDown className={cn("size-4", chevronClassName)} {...chevronProps} />
        },
        DayButton: ({ className: dayButtonClassName, ...dayButtonProps }: DayButtonProps) => (
          <button type="button" className={dayButtonClassName} {...dayButtonProps} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
