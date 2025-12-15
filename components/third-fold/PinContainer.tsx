
import React, { useState, useMemo, useEffect } from "react";
// FIX: Cast motion to `any` to bypass TypeScript errors due to a likely configuration issue.
import { motion as untypedMotion } from "framer-motion";
import { cn } from '../header/utils';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
} from "../header/ui/Chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../header/ui/card";

const motion = untypedMotion as any;

// Grid pattern logic from former FeatureCard.tsx
function GridPattern({
	width,
	height,
	x,
	y,
	squares,
	...props
}: React.ComponentProps<'svg'> & { width: number; height: number; x: string; y: string; squares?: number[][] }) {
	const patternId = React.useId();

	return (
		<svg aria-hidden="true" {...props}>
			<defs>
				<pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
					<path d={`M.5 ${height}V.5H${width}`} fill="none" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
			{squares && (
				<svg x={x} y={y} className="overflow-visible">
					{squares.map(([x, y], index) => (
						<rect strokeWidth="0" key={index} width={width + 1} height={height + 1} x={x * width} y={y * height} />
					))}
				</svg>
			)}
		</svg>
	);
}

function genRandomPattern(length?: number): number[][] {
	length = length ?? 5;
	return Array.from({ length }, () => [
		Math.floor(Math.random() * 4) + 7,
		Math.floor(Math.random() * 6) + 1,
	]);
}

// FIX: Explicitly typed the component with React.FC to resolve a TypeScript inference issue where the `children` prop was not being correctly recognized when the component is used inside a `.map()` loop, leading to misleading errors.
type PinContainerProps = {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
  isExiting?: boolean; // Nova prop para controlar o fechamento
  socioColor?: string; // Cor do Pin externo e ícones
  chartColor?: string; // Nova prop: Cor da linha do gráfico e legenda
};

export const PinContainer: React.FC<PinContainerProps> = ({
  children,
  title,
  href = "#",
  className,
  containerClassName,
  isExiting = false,
  socioColor = "#FFA11D", // Default orange for Pin
  chartColor,             // Optional chart color
}) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg)"
  );
  const [isHovered, setIsHovered] = useState(false);

  // Use passed chartColor or fallback to socioColor
  const effectiveChartColor = chartColor || socioColor;

  // AUTOMATIC ANIMATION LOGIC
  useEffect(() => {
    // 1. Reset state immediately when title changes (navigation) or exiting starts
    setIsHovered(false);
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");

    // 2. If not exiting, set timer to open automatically after 1s
    if (!isExiting) {
        const timer = setTimeout(() => {
            setIsHovered(true);
            setTransform("translate(-50%,-50%) rotateX(40deg) scale(0.8)");
        }, 1000);

        return () => clearTimeout(timer);
    }
  }, [title, isExiting]); // Depend on title to reset whenever the slide changes

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href === "#") {
      e.preventDefault();
    }
  };
  
  const p = React.useMemo(() => genRandomPattern(), []);

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "relative group/pin z-50 cursor-default",
        containerClassName
      )}
      // Mouse interaction removed to enforce automatic behavior
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2 hidden md:block" // Hide 3D container on mobile
      >
        <div
          style={{
            transform: transform,
          }}
          className="absolute left-1/2 p-4 top-1/2 flex justify-start items-start rounded-2xl shadow-[0_8px_16px_rgb(0_0_0/0.4)] bg-black border border-white/[0.1] transition duration-700 overflow-hidden"
        >
          <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
              <div className="from-white/5 to-white/10 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
                  <GridPattern
                      width={20}
                      height={20}
                      x="-12"
                      y="4"
                      squares={p}
                      className="fill-white/5 stroke-white/10 absolute inset-0 h-full w-full mix-blend-overlay"
                  />
              </div>
          </div>
          <div className={cn("relative z-50", className)}>{children}</div>
        </div>
      </div>
      
      {/* Mobile-optimized static view (No 3D tilt) */}
      <div className="relative md:hidden flex justify-center items-center">
         <div className="p-4 rounded-2xl bg-black border border-white/[0.1] shadow-lg">
            <div className={cn("relative z-50", className)}>{children}</div>
         </div>
      </div>

      <PinHoverContent 
        title={title} 
        isHovered={isHovered} 
        socioColor={socioColor} 
        chartColor={effectiveChartColor} 
      />
    </a>
  );
};

export const PinHoverContent = ({ 
    title, 
    isHovered,
    socioColor,
    chartColor,
    forceShow = false,
    className
}: { 
    title?: string; 
    isHovered: boolean;
    socioColor: string;
    chartColor: string;
    forceShow?: boolean;
    className?: string;
}) => {
  const { chartData, chartConfig } = useMemo(() => {
    let seed = title ? title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : 1;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const initialData = [
      { month: "Jan" },
      { month: "Fev" },
      { month: "Mar" },
      { month: "Abr" },
      { month: "Mai" },
      { month: "Jun" },
    ];

    const data = initialData.map((item, index) => {
      const humano = Math.floor(random() * (3500 - 500 + 1)) + 500;
      const socioBase = 4000 + index * 400; // Start high and trend up
      const socio = socioBase + Math.floor(random() * 800) - 400; // Add some noise
      return { ...item, humano, socio };
    });
    
    const config = {
      humano: { label: "Humano", color: "hsl(0, 72%, 51%)" }, // Red
      socio: { label: "Socceo", color: chartColor }, // Using chartColor for the line/legend
    } satisfies ChartConfig;
    
    return { chartData: data, chartConfig: config };
  }, [title, chartColor]);


  return (
    <motion.div 
      className={cn(
          "w-72 h-80 flex items-center justify-center z-[60] transition duration-500", // Aumentado w e h
          (isHovered || forceShow) ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          className
      )}
    >
      {/* 
          CRITICAL FIX: 
          On mobile (forceShow), we center the card vertically with `top-1/2 -translate-y-1/2`
          to align perfectly with the navigation buttons.
          On desktop, we use `-mt-72` and `-top-32` for the 3D pin effect.
      */}
      <div className={cn(
          "w-full h-full flex-none inset-0", 
          forceShow ? "block" : "hidden md:block -mt-72"
      )}> 
        
        {/* 1. The Card */}
        <div className={cn(
            "absolute inset-x-0 flex justify-center z-50", 
            forceShow ? "top-1/2 -translate-y-1/2" : "-top-32"
        )}>
            <Card className="w-[280px] bg-neutral-950 border-white/20 shadow-2xl"> {/* Removed /90 opacity and backdrop-blur */}
              <CardHeader className="p-4 pb-2 text-left">
                <CardTitle className="text-base text-white font-bold">
                  {title}
                </CardTitle>
                <CardDescription className="flex items-center justify-start gap-1.5 whitespace-nowrap text-xs">
                  Desempenho: 
                  <span className="font-bold" style={{ color: chartColor }}>Socceo</span> 
                  vs. 
                  <span className="text-red-500 font-bold">Humano</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <ChartContainer config={chartConfig} className="h-32 w-full">
                  <LineChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)"/>
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      interval="preserveStartEnd"
                      tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                    />
                    <YAxis hide domain={[0, 8000]} ticks={[0, 2000, 4000, 6000, 8000]} />
                    <Line
                      dataKey="humano"
                      type="linear"
                      stroke="var(--color-humano)"
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="4 4"
                      isAnimationActive={false}
                    />
                    <Line
                      dataKey="socio"
                      type="linear"
                      stroke="var(--color-socio)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "var(--color-socio)" }}
                      activeDot={{ r: 5 }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
        </div>

        {/* 2. The Circles Animation (Uses socioColor for the pin effect) */}
        <div
          style={{
            perspective: "1000px",
            transform: forceShow ? "none" : "rotateX(70deg) translateZ(0)",
          }}
          className={cn(
              "absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2",
              forceShow ? "hidden" : "block"
          )}
        >
          <>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 0,
              }}
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
              style={{ backgroundColor: `${socioColor}15` }} // 15 = low opacity hex
            ></motion.div>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 2,
              }}
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
              style={{ backgroundColor: `${socioColor}15` }}
            ></motion.div>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 4,
              }}
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
              style={{ backgroundColor: `${socioColor}15` }}
            ></motion.div>
          </>
        </div>
        
        {/* 3. The Pin Line Animation (Uses socioColor for the pin effect) */}
        {!forceShow && (
            <>
            <motion.div 
                className={cn("absolute right-1/2 bottom-1/2 translate-y-[14px] w-px h-20 blur-[2px] transition-all duration-700", isHovered && "h-40")}
                style={{ background: `linear-gradient(to bottom, transparent, ${socioColor})` }}
            />
            <motion.div 
                className={cn("absolute right-1/2 bottom-1/2 translate-y-[14px] w-px h-20 transition-all duration-700", isHovered && "h-40")}
                style={{ background: `linear-gradient(to bottom, transparent, ${socioColor})` }}
            />
            <motion.div 
                className="absolute right-1/2 translate-x-[1.5px] bottom-1/2 translate-y-[14px] w-[4px] h-[4px] rounded-full z-40 blur-[3px]" 
                style={{ backgroundColor: socioColor }}
            />
            <motion.div 
                className="absolute right-1/2 translate-x-[0.5px] bottom-1/2 translate-y-[14px] w-[2px] h-[2px] rounded-full z-40" 
                style={{ backgroundColor: socioColor }}
            />
            </>
        )}
      </div>
    </motion.div>
  );
};
