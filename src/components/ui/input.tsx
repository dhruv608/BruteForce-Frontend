import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      style={{
        height: 'var(--spacing-lg)',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.06)',
        color: 'var(--foreground)',
        fontSize: 'var(--text-base)',
        padding: '16px 20px',
        outline: 'none',
        transition: 'all 0.2s ease',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(204, 255, 0, 0.2)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      {...props}
    />
  )
}

export { Input }
