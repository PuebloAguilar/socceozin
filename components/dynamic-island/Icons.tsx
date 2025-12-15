import React from 'react';
import { cn } from '../header/utils';

export const SignalIcon = (props: React.ComponentProps<'svg'>) => (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" {...props}>
        <path d="M1 11.5C1 11.7761 1.22386 12 1.5 12H2.5C2.77614 12 3 11.7761 3 11.5V8C3 7.72386 2.77614 7.5 2.5 7.5H1.5C1.22386 7.5 1 7.72386 1 8V11.5Z" />
        <path d="M5 11.5C5 11.7761 5.22386 12 5.5 12H6.5C6.77614 12 7 11.7761 7 11.5V5C7 4.72386 6.77614 4.5 6.5 4.5H5.5C5.22386 4.5 5 4.72386 5 5V11.5Z" />
        <path d="M9 11.5C9 11.7761 9.22386 12 9.5 12H10.5C10.7761 12 11 11.7761 11 11.5V2C11 1.72386 10.7761 1.5 10.5 1.5H9.5C9.22386 1.5 9 1.72386 9 2V11.5Z" />
        <path d="M13 11.5C13 11.7761 13.2239 12 13.5 12H14.5C14.7761 12 15 11.7761 15 11.5V0.5C15 0.223858 14.7761 0 14.5 0H13.5C13.2239 0 13 0.223858 13 0.5V11.5Z" opacity="0.3"/>
    </svg>
  );

export const WifiIcon = (props: React.ComponentProps<'svg'>) => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
     <path d="M1.05861 6.09139C3.12384 4.02616 5.87616 2.5 9 2.5C12.1238 2.5 14.8762 4.02616 16.9414 6.09139" transform="translate(-1.5, 0)"/>
     <path d="M4.34315 7.65685C5.55577 6.44423 7.22244 5.66667 9 5.66667C10.7776 5.66667 12.4442 6.44423 13.6569 7.65685" transform="translate(-1.5, 0)"/>
     <path d="M10.5 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" fill="currentColor" stroke="none" transform="translate(-1.5, 0)"/>
  </svg>
);

export const BatteryIcon = ({ level, className }: { level: number, className?: string }) => (
    <div className={cn("h-[10.5px] w-[24px] border-[1.5px] border-white rounded-[3.5px] p-[1.5px] relative flex items-center", className)}>
        <div className="h-full bg-white rounded-[1.5px]" style={{ width: `${level}%`}} />
        <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-[1.5px] h-[4px] bg-white rounded-r-sm"></div>
    </div>
);