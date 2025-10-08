import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "../../lib/utils"
import "react-day-picker/dist/style.css"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm w-fit">
      <DayPicker
        showOutsideDays={showOutsideDays}
        weekStartsOn={0} // Sunday start, like your screenshot
        className={cn("text-[#333333]", className)}
        classNames={{
          months: "space-y-4",
          month: "space-y-4",
          caption: "flex justify-center items-center relative mb-2",
          caption_label: "text-base font-semibold text-[#002B4C]",
          nav: "flex items-center gap-1",
          nav_button:
            "p-1 rounded-md text-[#002B4C] hover:text-[#14A0C4] transition-opacity",
          nav_button_previous: "absolute left-2",
          nav_button_next: "absolute right-2",

          // ✅ Don’t override display, let it be a proper table layout
          table: "w-full border-collapse text-sm",
          head_row: "",
          head_cell:
            "text-[#002B4C] text-center font-semibold w-9 h-8 text-[0.85rem]",
          row: "",
          cell: "text-center align-middle p-[2px]",

          // ✅ Only color and shape styling for days
          day: cn(
            "w-9 h-9 p-0 rounded-md text-[#333333] font-normal hover:bg-[#14A0C4]/10 hover:text-[#002B4C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14A0C4]"
          ),
          day_selected:
            "bg-[#14A0C4] text-white hover:!bg-[#14A0C4] focus:bg-[#14A0C4]",
          day_today:
            "border border-[#14A0C4] text-[#002B4C] font-semibold",
          day_outside: "text-gray-400 opacity-70",
          day_disabled: "text-gray-300 opacity-50 pointer-events-none",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          left: ({ className, ...props }: { className?: string }) => (
    <ChevronLeft className={cn("size-4", className)} {...props} />
  ),
 right: ({ className, ...props }: { className?: string }) => (
    <ChevronRight className={cn("size-4", className)} {...props} />
  ),
}}
        {...props}
      />
    </div>
  )
}

export { Calendar }
