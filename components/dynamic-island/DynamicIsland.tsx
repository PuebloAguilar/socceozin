import React from 'react';
import { SignalIcon, WifiIcon, BatteryIcon } from './Icons';

export function DynamicIsland({ currentTime }: { currentTime: string }) {
  return (
    <div className="absolute top-0 left-0 w-full z-50 pointer-events-none">
      {/* This div is to give the notch area the same color as the header, to blend in */}
      <div className="absolute inset-0 h-9" style={{ backgroundColor: '#1f2c33' }} />
      <div className="relative h-9 px-5 text-white flex items-center justify-between">
        {/* Left side: Time */}
        <div className="w-1/3 flex items-center">
          <span className="text-xs font-semibold">{currentTime}</span>
        </div>

        {/* Center: The island itself (now static) */}
        <div className="w-1/3 flex justify-center">
          <div className="h-7 w-[124px] bg-black rounded-full" />
        </div>

        {/* Right side: Status icons */}
        <div className="w-1/3 flex items-center justify-end gap-1.5">
          <SignalIcon className="h-[10px]" />
          <WifiIcon className="h-2.5" />
          <BatteryIcon level={80} />
        </div>
      </div>
    </div>
  );
}