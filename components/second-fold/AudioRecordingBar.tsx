import React, { useRef } from "react";

const PauseIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
);
const TrashIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
);

const AudioRecordingBar = ({ progress, duration }: { progress: number, duration: number }) => {
    const elapsedSeconds = Math.floor((progress / 100) * duration);
    const formattedTime = `0:${String(elapsedSeconds).padStart(2, '0')}`;

    const waveformBars = useRef(Array.from({ length: 40 }, () => Math.floor(Math.random() * 16) + 4)).current;
    
    return (
        <div className="p-2 flex items-center gap-2 bg-[#1f2c33] h-full">
            <button className="shrink-0 text-neutral-400 p-2 transition-transform active:scale-90" aria-label="Delete recording">
                <TrashIcon className="w-6 h-6"/>
            </button>
            <div className="flex-1 flex items-center gap-3 min-w-0">
                <span className="text-sm text-neutral-400 font-mono w-10">{formattedTime}</span>
                <div className="flex-1 flex items-center h-5">
                    {waveformBars.map((h, i) => (
                        <div key={i} className={`w-0.5 rounded-full mx-[1px] transition-colors duration-75 ${ (progress / 100) * waveformBars.length > i ? 'bg-cyan-400' : 'bg-neutral-500'}`} style={{ height: `${h}px`}} />
                    ))}
                </div>
            </div>
            <button className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center shrink-0" aria-label="Pause recording">
                <PauseIcon className="w-5 h-5 text-white"/>
            </button>
            <button className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90" aria-label="Send recording">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white ml-0.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
        </div>
    );
};


export default AudioRecordingBar;
