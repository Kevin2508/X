import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-2xl bg-white border border-neutral-200 text-neutral-950 px-3 py-3 text-sm transition-colors outline-none placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-4 focus-visible:ring-neutral-950/5 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
