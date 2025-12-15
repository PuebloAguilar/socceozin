import React from 'react';
import { cn } from '../header/utils';

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline', size?: 'default' | 'icon' }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white disabled:pointer-events-none disabled:opacity-50';
  const variantClasses = variant === 'outline'
    ? 'border border-white/30 bg-transparent hover:bg-white/10 text-white'
    : 'bg-white text-black hover:bg-neutral-200';
  const sizeClasses = size === 'icon' ? 'h-10 w-10' : 'h-10 px-4 py-2';

  return (
    <button
      className={cn(baseClasses, variantClasses, sizeClasses, className)}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";
