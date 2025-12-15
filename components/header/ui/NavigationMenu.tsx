import React, { useState, useContext, createContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';

const NavigationMenuContext = createContext<{
  activeTrigger: string | null;
  setActiveTrigger: (id: string | null) => void;
  isInsideMobile?: boolean;
}>({
  activeTrigger: null,
  setActiveTrigger: () => {},
});

export const NavigationMenu = ({ children, className }: React.PropsWithChildren<{ className?: string }>) => {
  const [activeTrigger, setActiveTrigger] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on Escape key press and return focus to trigger
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeTrigger && menuRef.current) {
          const triggerElement = menuRef.current.querySelector<HTMLElement>(
            `button[data-parent-id="${activeTrigger}"]`
          );
          triggerElement?.focus();
        }
        setActiveTrigger(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTrigger]);

  // Close menu when focus leaves the component
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (menuRef.current && !menuRef.current.contains(e.relatedTarget as Node)) {
      setActiveTrigger(null);
    }
  };

  return (
    <NavigationMenuContext.Provider value={{ activeTrigger, setActiveTrigger }}>
      <div
        ref={menuRef}
        onMouseLeave={() => setActiveTrigger(null)}
        onBlur={handleBlur}
        className={cn("relative", className)}
      >
        {children}
      </div>
    </NavigationMenuContext.Provider>
  );
};

export const NavigationMenuList = ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
  <ul className={cn("flex items-center space-x-1", className)}>
    {children}
  </ul>
);

export const NavigationMenuItem = ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLLIElement>>) => {
  const id = React.useId();
  const { setActiveTrigger } = useContext(NavigationMenuContext);

  return (
    <li
      // FIX: Changed from onFocusWithin to onFocus. React's onFocus event bubbles, achieving the same goal of detecting focus on descendants, and it's a recognized prop in React's TypeScript types.
      onFocus={() => setActiveTrigger(id)}
      onMouseEnter={() => setActiveTrigger(id)}
      className="relative"
      {...props}
    >
      {React.Children.map(children, (child) => 
        React.isValidElement(child) ? React.cloneElement(child, { 'data-parent-id': id } as any) : child
      )}
    </li>
  );
};

export const NavigationMenuTrigger = ({ children, className, ...props }: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement> & { 'data-parent-id'?: string }>) => {
	const { activeTrigger } = useContext(NavigationMenuContext);
	const parentId = props['data-parent-id'];
	const isOpen = activeTrigger === parentId;

	return (
		<button
			className={cn("group inline-flex h-10 w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none disabled:pointer-events-none disabled:opacity-50", className)}
			aria-haspopup="true"
			aria-expanded={isOpen}
			{...props}
		>
			{children}
			<svg
				className={`relative top-[1px] ml-1 h-3 w-3 transition duration-200 ${isOpen ? 'rotate-180' : ''}`}
				viewBox="0 0 15 15"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64248 10.8182 6.81821L7.81819 9.81821C7.64245 9.99395 7.35753 9.99395 7.18179 9.81821L4.18179 6.81821C4.00605 6.64248 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
			</svg>
		</button>
	);
};


export const NavigationMenuContent = ({ children, className, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement> & { 'data-parent-id'?: string }>) => {
  const { activeTrigger } = useContext(NavigationMenuContext);
  const parentId = props['data-parent-id'];
  const isOpen = activeTrigger === parentId;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="nav-content"
          className={cn("absolute top-full left-0 w-auto", className)}
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ transformOrigin: 'top' }}
        >
          {/* Wrapper div provides padding and ensures there is no gap between the trigger and the content, preventing the menu from closing prematurely on hover. */}
          <div className="pt-2">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement, 
  React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>
>(({ className, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn('block select-none space-y-1 rounded-md leading-none no-underline outline-none transition-colors hover:bg-white/10 focus:bg-white/10', className)}
        {...props}
      >
        {children}
      </a>
    );
  }
);