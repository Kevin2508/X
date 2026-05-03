import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl bg-white border border-neutral-200 text-neutral-950 px-3 py-2 text-sm transition-colors outline-none placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-4 focus-visible:ring-neutral-950/5 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
