"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../header/utils"

const Switch = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ className, checked, onCheckedChange, ...props }, ref) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange && onCheckedChange(!checked)}
    className={cn(
      'peer inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50',
      checked ? 'bg-white' : 'bg-neutral-700',
      className
    )}
    {...props}
    ref={ref}
  >
    <motion.span
      layout
      transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-full bg-black shadow-lg ring-0 transition-transform',
        checked ? 'translate-x-4' : 'translate-x-0'
      )}
    />
  </button>
))
Switch.displayName = "Switch"

export { Switch }
