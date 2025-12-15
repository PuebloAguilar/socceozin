import React from 'react';

type KeyProps = {
    children: React.ReactNode;
    className?: string;
    variant?: 'dark';
};

// FIX: Explicitly typed the Key component with React.FC<KeyProps>.
// This resolves a TypeScript inference issue where the `children` prop was not being recognized,
// leading to incorrect errors about missing props and invalid use of the `key` prop in lists.
const Key: React.FC<KeyProps> = ({ children, className, variant }) => (
    <div className={`flex h-11 items-center justify-center rounded-md text-xl font-light text-white shadow-sm transition-all duration-75 ${variant === 'dark' ? 'bg-[#1f2c33]' : 'bg-[#2a3942]'} ${className}`}>
        {children}
    </div>
);

const Keyboard = ({ highlightedKey }: { highlightedKey?: string }) => {
    const isHighlighted = (char: string) => highlightedKey === char;
    
    return (
        <div className="flex flex-col gap-[6px] p-1 bg-[#0e0e0e]">
            {/* Top Row */}
            <div className="flex gap-[6px]">
                {'qwertyuiop'.split('').map(char => 
                    <Key key={char} className={`flex-1 ${isHighlighted(char) ? '!bg-neutral-500 scale-95' : ''}`}>
                        {char}
                    </Key>
                )}
            </div>
            {/* Middle Row */}
            <div className="flex gap-[6px]">
                <div className="w-[5%]"></div>
                {'asdfghjkl'.split('').map(char => 
                    <Key key={char} className={`flex-1 ${isHighlighted(char) ? '!bg-neutral-500 scale-95' : ''}`}>
                        {char}
                    </Key>
                )}
                <div className="w-[5%]"></div>
            </div>
            {/* Bottom Row */}
            <div className="flex gap-[6px]">
                <Key className="flex-[1.5]" variant="dark">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                </Key>
                {'zxcvbnm'.split('').map(char => 
                    <Key key={char} className={`flex-1 ${isHighlighted(char) ? '!bg-neutral-500 scale-95' : ''}`}>
                        {char}
                    </Key>
                )}
                <Key className="flex-[1.5]" variant="dark">
                     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM18 9l-6 6M12 9l6 6"/></svg>
                </Key>
            </div>
            {/* Spacebar Row */}
            <div className="flex gap-[6px]">
                <Key className="flex-[1.5] text-base" variant="dark">123</Key>
                <Key className="flex-[1.5]" variant="dark">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                </Key>
                <Key className={`flex-[4] font-normal text-base ${isHighlighted(' ') ? '!bg-neutral-500 scale-95' : ''}`} variant="dark">
                    espaço
                </Key>
                <Key className="flex-[2] font-normal text-base" variant="dark">ir</Key>
            </div>
        </div>
    );
};

export default Keyboard;