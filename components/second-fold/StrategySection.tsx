
import React, { useState, useEffect } from "react";
import FloatingChat from "./FloatingChat";
// FIX: Cast motion to `any` to bypass TypeScript errors due to a likely configuration issue.
import { motion as untypedMotion, AnimatePresence } from "framer-motion";
import MotorIndicator from "./MotorIndicator";
import { Spotlight } from "../ui/spotlight-new";

const motion = untypedMotion as any;

const motors = [
  {
    motor: "MOTOR 1",
    title: "Planejamento",
    titleDesktop: "Mapeie antes de executar, pense antes de agir",
    description:
      "O Socceo analisa seu contexto, identifica alavancas reais de crescimento e traça rotas com frameworks validados. Cada decisão deixa de ser aposta quando você enxerga o sistema completo e sua rotina está sincronizada com sua estratégia.",
  },
  {
    motor: "MOTOR 2",
    title: "Ação",
    titleDesktop: "Execute com inteligência, não com esforço",
    description:
      "O Socceo transforma cada insight em ação concreta aplicando frameworks das maiores consultorias do mundo. Conecta sua visão aos padrões de execução que guiam os melhores do mercado.",
  },
  {
    motor: "MOTOR 3",
    title: "Controle",
    titleDesktop: "Gerencie com dados, não com intuição",
    description:
      "Você não controla o que não enxerga. O Socceo organiza finanças, monitora KPIs críticos e alerta sobre desvios antes que virem crises. Você sempre sabe onde cada real gera retorno e quando cada compromisso precisa de atenção.",
  },
];

const PlayIcon = () => (
    <svg className="w-12 h-12 text-white fill-white opacity-80" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
    </svg>
);

// Video Placeholder Components mimicking specific motor themes but in Monochrome/Neutral style
const VideoContent = ({ type }: { type: number }) => {
    return (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-neutral-900/50">
            {/* Animated Background Grid - Neutral */}
            <div className="absolute inset-0 opacity-20" 
                style={{ 
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)'
                }} 
            />
            {/* Gradient Overlay applied specifically for this area per request */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
            
            {/* Central Element - Glassmorphism */}
            <div className="relative z-10 p-6 rounded-full bg-white/5 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                <PlayIcon />
            </div>

            {/* Decorative Elements - Monochrome/Neutral */}
            {type === 0 && ( // Planejamento (Structure)
                <>
                    <div className="absolute top-4 left-4 w-16 h-1 bg-white/20 rounded-full" />
                    <div className="absolute top-8 left-4 w-8 h-1 bg-white/10 rounded-full" />
                    <div className="absolute bottom-4 right-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Structuring_Data...</div>
                    
                    {/* Floating nodes */}
                    <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
                    <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-700" />
                </>
            )}
            {type === 1 && ( // Ação (Speed/Flow)
                <>
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
                     <div className="absolute bottom-4 left-4 flex gap-1">
                        <div className="w-1 h-4 bg-white/40 rounded-sm animate-[bounce_1s_infinite]" />
                        <div className="w-1 h-6 bg-white/60 rounded-sm animate-[bounce_1.2s_infinite]" />
                        <div className="w-1 h-3 bg-white/30 rounded-sm animate-[bounce_0.8s_infinite]" />
                     </div>
                     <div className="absolute bottom-4 right-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Executing_Tasks...</div>
                </>
            )}
            {type === 2 && ( // Controle (Metrics/Charts)
                <>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute w-32 h-32 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                    </div>
                    <div className="absolute bottom-4 right-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Analyzing_Metrics...</div>
                    
                    {/* Data Points */}
                    <div className="absolute top-10 right-10 w-1 h-1 bg-white/50 rounded-full" />
                    <div className="absolute bottom-20 left-12 w-1 h-1 bg-white/30 rounded-full" />
                </>
            )}
        </div>
    )
}

interface StrategySectionProps {}

const StrategySection = React.forwardRef<HTMLDivElement, StrategySectionProps>(
  function StrategySection(props, ref) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [showIndicator, setShowIndicator] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isIphoneReady, setIsIphoneReady] = useState(false);

    useEffect(() => {
        if (showIndicator) {
            const duration = isInitialLoad ? 4000 : 2500;
            const timer = setTimeout(() => {
                setShowIndicator(false);
                if (isInitialLoad) {
                    setIsInitialLoad(false);
                }
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [showIndicator, activeIndex, isInitialLoad]);
    
    const handleIphoneReady = () => {
        setShowIndicator(true);
        setIsIphoneReady(true);
    };

    const handlePrev = () => {
      setDirection('prev');
      setActiveIndex((prevIndex) => (prevIndex - 1 + motors.length) % motors.length);
      setShowIndicator(true);
    };

    const handleNext = () => {
      setDirection('next');
      setActiveIndex((prevIndex) => (prevIndex + 1) % motors.length);
      setShowIndicator(true);
    };
    
    const activeMotor = motors[activeIndex];

    const slideVariants = {
      enter: (direction: 'next' | 'prev') => ({
        x: direction === 'next' ? 20 : -20,
        opacity: 0,
      }),
      center: {
        x: 0,
        opacity: 1,
      },
      exit: (direction: 'next' | 'prev') => ({
        x: direction === 'next' ? -20 : 20,
        opacity: 0,
      }),
    };


    return (
      <div
        ref={ref}
        id="como-funciona"
        className="w-full flex flex-col items-center justify-start bg-black py-10 sm:py-16 relative overflow-hidden -mt-12 md:-mt-24"
      >
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-6xl z-10"
        >
          <div className="w-full mx-auto p-4 md:p-10 relative z-10">
            <div className="flex flex-col gap-y-12">
               {/* Top Part: Title and Description */}
              <div className="text-center relative px-2">
                <h2 className="text-4xl font-bold leading-tight sm:text-6xl sm:leading-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                  COMO FUNCIONA
                </h2>

                <p className="mt-4 text-lg md:text-2xl font-medium text-neutral-200 max-w-4xl text-center mx-auto leading-relaxed">
                  Com o Socceo, seu WhatsApp vira a cabine de comando do seu negocio. Enquanto você age, três motores inteligentes trabalham 24/7 como CEO + CMO + CFO prevendo o futuro do seu negócio com métricas reais, eliminando 80% do trabalho operacional e focando nos 20% que realmente escalam.
                </p>
              </div>

              {/* Bottom Part: 2-column layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-12 items-center justify-center">
                
                {/* 
                    LEFT COLUMN: IPHONE
                    Changes: 
                    1. Added navigation buttons AROUND the iPhone on Desktop.
                    2. Circular button made visible ONLY on mobile.
                */}
                <div className="order-1 flex justify-center items-center w-full relative gap-6 md:gap-8">
                  {/* Desktop Prev Button */}
                  <button onClick={handlePrev} className="hidden md:flex group h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/30 bg-neutral-900 text-white/70 transition-colors hover:bg-neutral-800 hover:text-white active:scale-95">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 transition-transform group-hover:-translate-x-1"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>

                  <AnimatePresence>
                    {showIndicator && (
                        <MotorIndicator
                            motor={activeMotor.motor}
                            name={activeMotor.title}
                            subtitle={activeMotor.titleDesktop}
                        />
                    )}
                  </AnimatePresence>
                  
                  {/* Floating Chat Component */}
                  <div className="relative">
                      <FloatingChat 
                        activeIndex={activeIndex} 
                        onInitialAnimationComplete={handleIphoneReady} 
                      />
                      
                      {/* Button Next Motor - MOBILE ONLY (Circular) */}
                      <button 
                          onClick={handleNext}
                          className="flex md:hidden absolute -right-4 top-1/2 -translate-y-1/2 z-20 group h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-neutral-900/80 text-white/50 hover:text-white hover:bg-neutral-800 backdrop-blur-sm transition-all duration-300 shadow-lg"
                          aria-label="Próximo Motor"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-transform group-hover:translate-x-0.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </button>
                  </div>

                  {/* Desktop Next Button */}
                  <button onClick={handleNext} className="hidden md:flex group h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/30 bg-neutral-900 text-white/70 transition-colors hover:bg-neutral-800 hover:text-white active:scale-95">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 transition-transform group-hover:translate-x-1"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>

                {/* 
                    RIGHT COLUMN: VIDEO CARD
                    Changes: Removed buttons from this column.
                */}
                <div className="order-2 flex justify-center w-full">
                     <div className="w-full max-w-md md:max-w-full">
                         
                         {/* The "Window" - Video Card */}
                         <div className="flex items-center gap-4">
                            
                            {/* Main Card Container - Unified Neutral Design */}
                            <div className="flex-1 relative rounded-[32px] border border-white/10 bg-neutral-950 overflow-hidden shadow-2xl min-h-[400px] flex flex-col">
                                <AnimatePresence mode="wait" custom={direction}>
                                    <motion.div
                                        key={activeIndex}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: { type: "spring", stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.2 }
                                        }}
                                        className="flex flex-col h-full"
                                    >
                                        {/* Video Area - Neutral Background */}
                                        <div className="relative h-56 w-full bg-neutral-900 border-b border-white/10 overflow-hidden group cursor-pointer">
                                            <VideoContent type={activeIndex} />
                                            {/* Tag */}
                                            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                                                <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase">
                                                    {activeMotor.motor}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Text Content */}
                                        <div className="p-6 md:p-8 flex flex-col justify-center flex-1 bg-neutral-950">
                                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                                                {activeMotor.titleDesktop}
                                            </h3>
                                            <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-4">
                                                {activeMotor.description}
                                            </p>
                                            
                                            {/* Mobile-Only Controls INSIDE the card (Selector exclusive for Motor Window) */}
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 md:hidden">
                                                <button 
                                                    onClick={handlePrev}
                                                    className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-white uppercase tracking-widest transition-colors p-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                                    Anterior
                                                </button>
                                                <div className="h-4 w-px bg-white/10" />
                                                <button 
                                                    onClick={handleNext}
                                                    className="flex items-center gap-2 text-xs font-bold text-[#FFA11D] hover:text-white uppercase tracking-widest transition-colors p-2"
                                                >
                                                    Próximo
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                         </div>
                     </div>
                </div>

              </div>

            </div>
          </div>
        </motion.div>
      </div>
    );
  }
);

export default StrategySection;
