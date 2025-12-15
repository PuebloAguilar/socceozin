
import React from 'react';

export const WordmarkIcon = (props: React.ComponentProps<"svg">) => (
  <svg viewBox="0 0 100 24" fill="currentColor" {...props}>
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize="18"
      fontFamily="system-ui, sans-serif"
      fontWeight="bold"
      letterSpacing="0.05em"
    >
      SOCCEO
    </text>
  </svg>
);
const BaseIcon = (props: React.SVGProps<SVGSVGElement> & { path: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d={props.path} />
    </svg>
);
const BaseIconMultiplePaths = (props: React.SVGProps<SVGSVGElement> & { paths: string[] }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        {props.paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
);
export const CodeIcon = (props: any) => <BaseIconMultiplePaths paths={["M16 18l6-6-6-6", "M8 6l-6 6 6 6"]} {...props} />;
export const GlobeIcon = (props: any) => <BaseIconMultiplePaths paths={["M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z", "M2 12h20", "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"]} {...props} />;
export const LayersIcon = (props: any) => <BaseIconMultiplePaths paths={["M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"]} {...props} />;
export const UserPlusIcon = (props: any) => <BaseIconMultiplePaths paths={["M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M8.5 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M20 8v6", "M23 11h-6"]} {...props} />;
export const Users = (props: any) => <BaseIconMultiplePaths paths={["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"]} {...props} />;
export const Star = (props: any) => <BaseIcon path="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" {...props} />;
export const FileText = (props: any) => <BaseIconMultiplePaths paths={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"]} {...props} />;
export const Shield = (props: any) => <BaseIcon path="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...props} />;
export const RotateCcw = (props: any) => <BaseIconMultiplePaths paths={["M1 4v6h6", "M3.51 15a9 9 0 1 0 2.13-9.36L1 10"]} {...props} />;
export const Handshake = (props: any) => <BaseIconMultiplePaths paths={["M14 17l-3.5-3.5a1 1 0 0 0-1.4 0L1 22", "m18 14 3.5 3.5a1 1 0 0 1 0 1.4L17 23", "m-1-1-3.5-3.5", "m5-5-3-3", "M3 21l3-3", "M19 3l-3.5 3.5a1 1 0 0 1-1.4 0L1 17"]} {...props} />;
export const Leaf = (props: any) => <BaseIconMultiplePaths paths={["M11 20A7 7 0 0 1 7 6l5-4 5 4a7 7 0 0 1-4 14z", "M11 20v-9"]} {...props} />;
export const HelpCircle = (props: any) => <BaseIconMultiplePaths paths={["M12 22A10 10 0 1 1 12 2a10 10 0 0 1 0 20z", "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"]} {...props} />;
export const BarChart = (props: any) => <BaseIconMultiplePaths paths={["M12 20V10", "M18 20V4", "M6 20V16"]} {...props} />;
export const PlugIcon = (props: any) => <BaseIconMultiplePaths paths={["M18 6a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 0-1-1H2", "M6 6v4", "M10 6v4", "M14 6v4", "M17 14h.01", "M13 14h.01", "M9 14h.01", "M5 14h.01", "M21 18a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2z"]} {...props} />;
export const DollarSignIcon = (props: any) => <BaseIconMultiplePaths paths={["M12 1v22", "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"]} {...props} />;
export const TargetIcon = (props: any) => <BaseIconMultiplePaths paths={["M12 22A10 10 0 1 1 12 2a10 10 0 0 1 0 20z", "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M12 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"]} {...props} />;
export const TrendingUp = (props: any) => <BaseIconMultiplePaths paths={["M22 7 13.5 15.5 8.5 10.5 2 17", "M16 7h6v6"]} {...props} />;
export const TrendingDown = (props: any) => <BaseIconMultiplePaths paths={["M23 18l-9.5-9.5-5 5L1 6", "M17 18h6v-6"]} {...props} />;
