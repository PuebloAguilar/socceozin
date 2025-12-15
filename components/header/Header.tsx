
'use client';
import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from './ui/Button';
import { cn } from './utils';
import { MenuToggleIcon } from './ui/MenuToggleIcon';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from './ui/NavigationMenu';
import {
	WordmarkIcon,
} from './ui/Icons';

type LinkItem = {
	title: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	description?: string;
};

interface HeaderProps {
    onLoginClick?: () => void;
    onBlogClick?: () => void;
}

export function Header({ onLoginClick, onBlogClick }: HeaderProps) {
	const [open, setOpen] = React.useState(false);
	const menuButtonRef = React.useRef<HTMLButtonElement>(null);

	const [hidden, setHidden] = React.useState(false);
    const lastYRef = React.useRef(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            // Hide if scrolling down and past the header height, show if scrolling up
            // Added logic to always show when at the very top (bounce effect on iOS)
            if (currentY < 0) {
                setHidden(false);
                return;
            }
            if (currentY > lastYRef.current && currentY > 100) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            lastYRef.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

	// Return focus to the menu button when the mobile menu is closed.
	React.useEffect(() => {
		if (!open) {
			menuButtonRef.current?.focus();
		} else {
            // Disable body scroll when menu is open
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        }
	}, [open]);


	const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const handleBlogClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (onBlogClick) {
          onBlogClick();
      }
  };

	return (
		<motion.header
			variants={{
                visible: { y: 0 },
                hidden: { y: '-100%' },
            }}
            animate={hidden ? 'hidden' : 'visible'}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
			className={cn(
				'fixed top-0 z-50 w-full border-b border-white/20 bg-black/80 backdrop-blur-lg supports-[backdrop-filter]:bg-black/60'
			)}
		>
			<nav
				className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4"
				aria-label="Main navigation"
			>
				<div className="flex items-center gap-5">
					<a
						href="#"
						className="hover:bg-white/10 rounded-md p-2 transition-colors active:bg-white/10"
						aria-label="Socceo homepage"
					>
						<WordmarkIcon className="h-4 text-white" />
					</a>
					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList>
                            <NavigationMenuItem>
								<NavigationMenuLink
									href="#por-que-criamos"
									onClick={handleAnchorClick}
									className="text-white hover:bg-white/10 rounded-md p-2 px-4 text-sm font-medium"
								>
									Manifesto
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									href="#como-funciona"
									onClick={handleAnchorClick}
									className="text-white hover:bg-white/10 rounded-md p-2 px-4 text-sm font-medium"
								>
									Como Funciona
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									href="#recursos"
									onClick={handleAnchorClick}
									className="text-white hover:bg-white/10 rounded-md p-2 px-4 text-sm font-medium"
								>
									Recursos
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									href="#impacto-real"
                                    onClick={handleAnchorClick}
									className="text-white hover:bg-white/10 rounded-md p-2 px-4 text-sm font-medium"
								>
									Resultados
								</NavigationMenuLink>
							</NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                href="#planos"
                                onClick={handleAnchorClick}
                                className="text-white hover:bg-white/10 rounded-md p-2 px-4 text-sm font-medium"
                                >
                                Planos
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                href="/blog"
                                onClick={handleBlogClick}
                                className="text-[#FFA11D] hover:bg-[#FFA11D]/10 rounded-md p-2 px-4 text-sm font-bold transition-colors"
                                >
                                Blog
                                </NavigationMenuLink>
                            </NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<Button variant="outline" onClick={onLoginClick}>Entrar</Button>
					<Button onClick={onLoginClick}>Começar</Button>
				</div>
				<Button
					ref={menuButtonRef}
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
				>
					<MenuToggleIcon open={open} className="size-5 text-white" />
				</Button>
			</nav>
			<MobileMenu
				open={open}
				setOpen={setOpen}
				className="flex flex-col justify-between gap-4 overflow-y-auto"
                onLoginClick={onLoginClick}
                onBlogClick={handleBlogClick}
			>
				{/* Items passed as children in previous version, now rendering directly for better control */}
                <div className="flex w-full flex-col gap-y-2 mt-4">
                    <a
						href="#por-que-criamos"
						onClick={(e) => {
							handleAnchorClick(e);
							setOpen(false);
						}}
						className="rounded-lg p-4 font-medium text-white hover:bg-white/10 active:bg-white/10 border border-transparent active:border-white/10 transition-colors text-lg"
					>
						Manifesto
					</a>
					<a
						href="#como-funciona"
						onClick={(e) => {
							handleAnchorClick(e);
							setOpen(false);
						}}
						className="rounded-lg p-4 font-medium text-white hover:bg-white/10 active:bg-white/10 border border-transparent active:border-white/10 transition-colors text-lg"
					>
						Como Funciona
					</a>
					<a
						href="#recursos"
						onClick={(e) => {
							handleAnchorClick(e);
							setOpen(false);
						}}
						className="rounded-lg p-4 font-medium text-white hover:bg-white/10 active:bg-white/10 border border-transparent active:border-white/10 transition-colors text-lg"
					>
						Recursos
					</a>
					<a
						href="#impacto-real"
						onClick={(e) => {
                            handleAnchorClick(e);
                            setOpen(false);
                        }}
						className="rounded-lg p-4 font-medium text-white hover:bg-white/10 active:bg-white/10 border border-transparent active:border-white/10 transition-colors text-lg"
					>
						Resultados
					</a>
					<a
						href="#planos"
						onClick={(e) => {
                            handleAnchorClick(e);
                            setOpen(false);
                        }}
						className="rounded-lg p-4 font-medium text-white hover:bg-white/10 active:bg-white/10 border border-transparent active:border-white/10 transition-colors text-lg"
					>
						Planos
					</a>
                    <a
						href="/blog"
                        onClick={(e) => {
                            handleBlogClick(e);
                            setOpen(false);
                        }}
						className="rounded-lg p-4 font-bold text-[#FFA11D] hover:bg-[#FFA11D]/10 active:bg-[#FFA11D]/10 border border-transparent active:border-[#FFA11D]/20 transition-colors text-lg"
					>
						Blog
					</a>
				</div>
				<div className="flex flex-col gap-3 pb-8 mt-auto border-t border-white/10 pt-6">
					<Button 
                        variant="outline" 
                        className="w-full bg-transparent h-12 text-base"
                        onClick={() => {
                            setOpen(false);
                            if (onLoginClick) onLoginClick();
                        }}
                    >
						Entrar
					</Button>
					<Button 
                        className="w-full h-12 text-base font-bold"
                        onClick={() => {
                            setOpen(false);
                            if (onLoginClick) onLoginClick();
                        }}
                    >
                        Começar
                    </Button>
				</div>
			</MobileMenu>
		</motion.header>
	);
}

type MobileMenuProps = React.ComponentProps<'div'> & {
	open: boolean;
	setOpen: (open: boolean) => void;
    onLoginClick?: () => void;
    onBlogClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

function MobileMenu({ open, setOpen, children, className, ...props }: MobileMenuProps) {
	if (typeof window === 'undefined') return null;

	const menuRef = React.useRef<HTMLDivElement>(null);

	// Handle focus trapping and Escape key for closing the menu
	React.useEffect(() => {
		if (!open) return;

		const menuNode = menuRef.current;
		if (!menuNode) return;

		const focusableElements = menuNode.querySelectorAll<HTMLElement>(
			'a[href]:not([disabled]), button:not([disabled])'
		);
		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setOpen(false);
				return;
			}

			if (e.key === 'Tab') {
				if (e.shiftKey) {
					// Shift + Tab
					if (document.activeElement === firstElement) {
						lastElement.focus();
						e.preventDefault();
					}
				} else {
					// Tab
					if (document.activeElement === lastElement) {
						firstElement.focus();
						e.preventDefault();
					}
				}
			}
		};

		// Focus the first element when the menu opens
		firstElement?.focus();

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [open, setOpen]);


	return createPortal(
    <AnimatePresence>
		{open && (
			<motion.div
				key="mobile-menu"
				ref={menuRef}
				id="mobile-menu"
				role="dialog"
				aria-modal="true"
				aria-labelledby="mobile-menu-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
				className={cn(
					'bg-black/95 backdrop-blur-xl',
					'fixed top-14 right-0 left-0 z-40 flex flex-col border-t border-white/10 md:hidden',
                    // Use dvh to account for dynamic browser bars on iOS
                    'h-[calc(100dvh-3.5rem)]' 
				)}
			>
				{/* Visually hidden title for screen readers */}
				<h2 id="mobile-menu-title" className="sr-only">
					Main Menu
				</h2>
				<div
					className={cn('size-full p-6 flex flex-col', className)}
					{...props}
				>
					{children}
				</div>
			</motion.div>
    )}
    </AnimatePresence>,
		document.body
	);
}
