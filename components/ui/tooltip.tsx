"use client"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../header/utils"

// FIX: Explicitly typed components with React.FC to resolve a TypeScript inference issue where the `children` prop was not being correctly recognized.
const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const TooltipContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen }}>
      <div 
        className="relative inline-block"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocusCapture={() => setIsOpen(true)}
        onBlurCapture={() => setIsOpen(false)}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
};

const TooltipTrigger: React.FC<{ children: React.ReactElement, asChild?: boolean }> = ({ children, asChild }) => {
  if (asChild) {
    return React.cloneElement(React.Children.only(children));
  }
  return <span>{children}</span>; // default wrapper
};

const TooltipContent: React.FC<React.ComponentProps<typeof motion.div>> = ({ children, className, ...props }) => {
  const { isOpen } = React.useContext(TooltipContext);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5, scale: 0.95 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className={cn(
            "absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/20 bg-neutral-950 px-3 py-1.5 text-sm text-white shadow-md",
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
