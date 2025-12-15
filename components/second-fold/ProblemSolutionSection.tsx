
import React, { useId, useState, useEffect } from "react";
// FIX: Cast motion to `any` to bypass TypeScript errors.
import { motion as untypedMotion, AnimatePresence } from "framer-motion";
import { WordmarkIcon, Shield, GlobeIcon } from "../header/ui/Icons";
import { cn } from "../header/utils";

const motion = untypedMotion as any;

// --- Ícones Locais ---
const CameraIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const BellIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
  </svg>
);

const UserIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const SmartphoneIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
    </svg>
);

const LaptopIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
    </svg>
);

const TabletIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="20" height="14" x="2" y="5" rx="2" ry="2" />
        <path d="M22 12h-1" /> {/* Landscape button indication */}
    </svg>
);

const WhatsAppIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

const LockIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const BriefcaseMoneyIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    <text x="12" y="17.5" fontSize="10" textAnchor="middle" fontWeight="bold" stroke="none" fill="currentColor">$</text>
  </svg>
);

// --- Componente para os 3 pontinhos animados ---
const AnimatedEllipsis = () => {
    const dotVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 }
    };

    return (
        <span className="inline-flex ml-1">
            <motion.span
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0 }}
            >
                .
            </motion.span>
            <motion.span
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
            >
                .
            </motion.span>
            <motion.span
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
            >
                .
            </motion.span>
        </span>
    );
};


// --- CONSTANTES FORA DO COMPONENTE PARA EVITAR RE-RENDER ---
const INSTITUTION_LOGOS = [
    {
        name: "Harvard",
        viewBox: "0 0 200 60",
        path: (
            <text x="50%" y="55%" dominantBaseline="central" textAnchor="middle" fontSize="36" fontFamily="serif" fontWeight="bold" letterSpacing="1" fill="currentColor">HARVARD</text>
        )
    },
    {
        name: "McKinsey",
        viewBox: "0 0 200 90",
        path: (
            <g fill="currentColor" fontFamily="serif">
                <text x="50%" y="40%" dominantBaseline="central" textAnchor="middle" fontSize="36" fontWeight="bold" letterSpacing="-0.5">McKinsey</text>
                <text x="50%" y="75%" dominantBaseline="central" textAnchor="middle" fontSize="26" fontStyle="italic">& Company</text>
            </g>
        )
    },
    {
        name: "Wharton",
        viewBox: "0 0 200 60",
        path: (
                <text x="50%" y="55%" dominantBaseline="central" textAnchor="middle" fontSize="48" fontFamily="serif" fontWeight="bold" letterSpacing="0" fill="currentColor">Wharton</text>
        )
    },
    {
        name: "BCG",
        viewBox: "0 0 140 60",
        path: (
            <text x="50%" y="55%" dominantBaseline="central" textAnchor="middle" fontSize="60" fontFamily="sans-serif" fontWeight="900" letterSpacing="-3" fill="currentColor">BCG</text>
        )
    },
    {
        name: "Stanford",
        viewBox: "0 0 200 60",
        path: (
                <text x="50%" y="55%" dominantBaseline="central" textAnchor="middle" fontSize="46" fontFamily="serif" letterSpacing="-0.5" fill="currentColor">Stanford</text>
        )
    },
    {
            name: "Bain",
            viewBox: "0 0 200 80",
            path: (
            <g fill="currentColor" fontFamily="serif" fontWeight="bold">
                <text x="50%" y="35%" dominantBaseline="central" textAnchor="middle" fontSize="38" letterSpacing="1">BAIN &</text>
                <text x="50%" y="75%" dominantBaseline="central" textAnchor="middle" fontSize="24" letterSpacing="3">COMPANY</text>
            </g>
            )
    },
    {
        name: "Kellogg",
        viewBox: "0 0 200 60",
        path: (
            <text x="50%" y="55%" dominantBaseline="central" textAnchor="middle" fontSize="52" fontFamily="serif" fontWeight="bold" fill="currentColor" letterSpacing="-1">Kellogg</text>
        )
    }
];

// --- Componente de Carrossel de Instituições (Refatorado para Zero Flicker) ---
const InstitutionIconCarousel = ({ startAnimation }: { startAnimation: boolean }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!startAnimation) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % INSTITUTION_LOGOS.length);
        }, 2500); 
        return () => clearInterval(timer);
    }, [startAnimation]);

    const currentLogo = INSTITUTION_LOGOS[index];

    return (
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
            <AnimatePresence initial={false}>
                <motion.div
                    key={index}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ 
                        duration: 0.5,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 flex items-center justify-center p-3 w-full h-full"
                >
                    <svg 
                        viewBox={currentLogo.viewBox} 
                        className="w-full h-full text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                        preserveAspectRatio="xMidYMid meet"
                        fill="currentColor"
                    >
                        {currentLogo.path}
                    </svg>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// --- Componente de Carrossel para o Botão Verde ---
const GreenButtonCarousel = ({ startAnimation }: { startAnimation: boolean }) => {
    const [index, setIndex] = useState(0);
    // Ordem: WhatsApp -> Computador -> Tablet
    const items = [
        { text: "no seu WhatsApp", icon: WhatsAppIcon, key: "whatsapp" },
        { text: "no seu Computador", icon: LaptopIcon, key: "pc" },
        { text: "no seu Tablet", icon: TabletIcon, key: "tablet" }
    ];

    useEffect(() => {
        if (!startAnimation) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, 2500);
        return () => clearInterval(timer);
    }, [startAnimation, items.length]);

    const CurrentItem = items[index];

    return (
        <div className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-lg hover:bg-green-500/20 transition-colors cursor-default min-w-[260px] overflow-hidden relative h-[56px]">
            <AnimatePresence initial={false}>
                <motion.div
                    key={CurrentItem.key}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ 
                         duration: 0.5,
                         ease: "easeInOut"
                    }}
                    className="absolute inset-0 flex items-center justify-center gap-3 w-full h-full"
                >
                    <CurrentItem.icon className="w-6 h-6 flex-shrink-0" />
                    <span className="whitespace-nowrap">{CurrentItem.text}</span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// --- Componente de Grid Pattern (Reutilizado para consistência visual) ---
function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any, index: number) => (
            <rect
              strokeWidth="0"
              key={index}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

// --- Novo Componente: Infrastructure Flow ---
function InfrastructureFlow({ 
  labelCenter = "Socceo",
  labelInstituicoes = "Instituições",
  startInstitutionAnim = true
}: { 
  labelCenter?: string;
  labelInstituicoes?: string; 
  startInstitutionAnim?: boolean;
}) {
  return (
    // Largura reduzida para centralizar melhor os elementos
    <div className="w-full max-w-3xl mx-auto relative px-4">
      
      {/* 
         Container das Linhas de Conexão
         CRÍTICO: A altura DEVE ser igual à altura dos ícones (h-20 mobile / h-28 desktop).
         justify-center garante que o gap fique no meio dessa altura.
         gap-6 ajustado para ficar visualmente no centro das janelas.
         px-16 md:px-20 garante que as linhas terminem no centro das colunas de 32/40.
      */}
      <div className="absolute top-0 left-0 w-full h-20 md:h-28 flex flex-col justify-center items-center gap-6 pointer-events-none z-0 px-16 md:px-20">
         
         {/* Linha Superior (Ida ->) */}
         <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div 
               className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-transparent via-[#FFA11D] to-transparent"
               animate={{ left: ["-20%", "120%"] }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
         </div>

         {/* Linha Inferior (Volta <-) */}
         <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div 
               className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-transparent via-[#FFA11D] to-transparent"
               animate={{ right: ["-20%", "120%"] }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
         </div>

      </div>

      {/* 
          CRÍTICO: items-start é OBRIGATÓRIO aqui.
          Se usar items-center, o texto abaixo dos ícones fará com que o ícone "suba" ou "desça" 
          dependendo do tamanho do texto, desalinhando com as linhas absolutas.
          Com items-start, todos os ícones ficam colados no topo, alinhados com o container das linhas.
          
          Largura das colunas aumentada para w-32 (mobile) e w-40 (desktop) para evitar quebra de texto.
      */}
      <div className="relative z-10 flex justify-between items-start">
        
        {/* Item 1: Você */}
        <div className="flex flex-col items-center gap-4 group w-28 md:w-40">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl border border-white/20 bg-[#0F0F0F] flex items-center justify-center shadow-2xl relative transition-transform duration-300 group-hover:scale-105 group-hover:border-white/20 group-hover:shadow-2xl">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <UserIcon className="w-8 h-8 md:w-10 md:h-10 text-white/80" />
            </div>
            <span className="text-[10px] md:text-base font-bold tracking-widest text-white uppercase mt-4 text-center">Você</span>
        </div>

        {/* Item 2: Centro (Socceo ou Consultores) */}
        <div className="flex flex-col items-center gap-4 relative group w-28 md:w-40">
             <div className="relative">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl border border-white/20 bg-[#0F0F0F] flex items-center justify-center shadow-2xl relative z-10 transition-transform duration-300 group-hover:scale-105 group-hover:border-white/20 group-hover:shadow-2xl">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                    
                    {/* Conditionally render icon based on label */}
                    {labelCenter === "CONSULTORES" ? (
                        <BriefcaseMoneyIcon className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />
                    ) : (
                        <svg className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                           <path d="M12 3C6.48 3 2 4.34 2 6c0 1.66 4.48 3 10 3s10-1.34 10-3c0-1.66-4.48-3-10-3z" />
                           <path d="M2 6v6c0 1.66 4.48 3 10 3s10-1.34 10-3V6" />
                           <path d="M2 12v6c0 1.66 4.48 3 10 3s10-1.34 10-3v-6" />
                        </svg>
                    )}
                </div>
             </div>
             <span className="text-[10px] md:text-base font-bold tracking-widest text-white uppercase mt-4 text-center w-full leading-tight">{labelCenter}</span>
        </div>

        {/* Item 3: Instituições */}
        <div className="flex flex-col items-center gap-4 group w-28 md:w-40">
             <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl border border-white/20 bg-[#0F0F0F] flex items-center justify-center shadow-2xl relative transition-transform duration-300 group-hover:scale-105 overflow-hidden group-hover:border-white/20 group-hover:shadow-2xl">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl z-0" />
                <div className="relative z-10 w-full h-full">
                    <InstitutionIconCarousel startAnimation={startInstitutionAnim} />
                </div>
             </div>
             <span className="text-[10px] md:text-base font-bold tracking-widest text-white uppercase mt-4 text-center w-full leading-tight">{labelInstituicoes}</span>
        </div>

      </div>
    </div>
  )
}

export default function ProblemSolutionSection() {
  const [startInstitutionsFlow1, setStartInstitutionsFlow1] = useState(false);
  const [startInstitutionsFlow2, setStartInstitutionsFlow2] = useState(false);
  const [startGreenButton, setStartGreenButton] = useState(false);

  return (
    <section id="por-que-criamos" className="relative w-full pt-20 pb-10 bg-black overflow-hidden z-20">
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- CABEÇALHO --- */}
        <div className="text-center mb-20 relative">

          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }} // Exige 60% visível
            transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }} // Delay ajustado para meio termo
            className="text-4xl sm:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6"
          >
            Seu negócio em ordem, a uma<br className="hidden md:block" /> mensagem de distância.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }} // Exige 60% visível
            transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }} // Delay ajustado para meio termo
            className="text-xl md:text-2xl text-neutral-300 max-w-4xl mx-auto font-medium leading-relaxed"
          >
            O primeiro sistema de gestão digital baseado em agentes de IA — não apenas organiza dados, mas pensa, age e decide com você
          </motion.p>
        </div>

        {/* --- GRID DE PROBLEMAS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-24 max-w-6xl mx-auto">
            <ProblemCard 
                delay={0.2} // Delay ajustado para meio termo
                imageSrc="https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?q=80&w=2071&auto=format&fit=crop"
                badgeText="O PROBLEMA"
                badgeColor="red"
                title="Sabemos como isso é frustrante!"
                description="Você acorda pensando em 50 coisas. Toma decisões importantes sem dados confiáveis. Esquece compromissos críticos. Descobre que está sem caixa só quando a conta chega. Passa 12 horas/semana em tarefas operacionais que não geram receita. E no final do mês, se pergunta: por que estou travado?"
            />
            <ProblemCard 
                delay={0.3} // Delay ajustado para meio termo
                imageSrc="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
                badgeText="A CAUSA"
                badgeColor="orange"
                title="Essa desorganização é exaustiva!"
                description="Você gerencia o negócio em 15+ ferramentas desconectadas: planilhas esquecidas, CRM desatualizado, agenda bagunçada, anotações perdidas, extratos confusos. Informação fragmentada. Zero integração. Você vira o elo humano entre sistemas que não conversam — e você paga o preço por isso."
            />
        </div>
        
        {/* --- COPY DE TRANSIÇÃO --- */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }} // Delay ajustado para meio termo
            className="text-center mt-16 mb-20 relative z-20 max-w-5xl mx-auto"
        >
             <p className="text-base font-bold text-neutral-400 uppercase tracking-[0.2em] mb-6">
                O QUE OS GRANDES PLAYERS FAZEM DIFERENTE?
             </p>
             <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Enquanto você luta contra o caos, <span className="text-[#FFA11D]">empresas que escalam rápido não improvisam.</span>
             </h3>
             <p className="text-neutral-200 text-xl md:text-2xl mb-12 leading-relaxed max-w-4xl mx-auto">
                Elas usam frameworks validados, processos estruturados e dados em tempo real para antecipar problemas antes que eles aconteçam e tomar decisões enquanto ainda há tempo de agir.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.1, delay: 0.4 }} // Delay ajustado
                    className="flex flex-col gap-3 p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-white/10 transition-colors"
                >
                    <strong className="text-white text-2xl">Planejam</strong>
                    <span className="text-neutral-300 text-lg">com frameworks validados (não no achismo)</span>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.1, delay: 0.5 }} // Delay ajustado
                    className="flex flex-col gap-3 p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-white/10 transition-colors"
                >
                    <strong className="text-white text-2xl">Executam</strong>
                    <span className="text-neutral-300 text-lg">com processos  (não no improviso)</span>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.1, delay: 0.6 }} // Delay ajustado
                    className="flex flex-col gap-3 p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-white/10 transition-colors"
                >
                    <strong className="text-white text-2xl">Controlam</strong>
                    <span className="text-neutral-300 text-lg">com previsões em tempo real (não quando já é tarde)</span>
                </motion.div>
             </div>
        </motion.div>

        {/* --- SEÇÃO DE ACESSO (FLUXO 1) --- */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }} // Delay ajustado
            className="text-center mt-24 mb-12 relative z-20"
        >
             <p className="text-base font-bold text-neutral-400 uppercase tracking-[0.2em] mb-6">
                COMO ELAS ACESSAM ISSO?
             </p>
             <h3 className="text-3xl md:text-5xl font-bold text-white mb-10 leading-tight">
                O caminho tradicional sempre foi:
             </h3>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.1, delay: 0.4, ease: "easeOut" }} // Delay ajustado
            onAnimationComplete={() => setStartInstitutionsFlow1(true)}
            className="w-full flex justify-center py-8 relative z-10 mb-20"
        >
             <InfrastructureFlow 
                labelCenter="CONSULTORES" 
                labelInstituicoes="INSTITUIÇÕES" 
                startInstitutionAnim={startInstitutionsFlow1}
            />
        </motion.div>

        {/* --- TEXTO DE TRANSIÇÃO: O PROBLEMA --- */}
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }} // Delay ajustado
            className="text-center max-w-3xl mx-auto mb-20 mt-12 relative z-20 px-4"
        >
             <p className="text-base font-bold text-neutral-400 uppercase tracking-[0.2em] mb-6">
                O PROBLEMA?
             </p>
             <p className="text-neutral-300 text-xl md:text-2xl leading-relaxed mb-8">
                Essas metodologias sempre exigiram consultores caros, MBAs de elite ou sistemas complexos que negócios digitais dificilmente conseguem acessar.
             </p>
             <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                Até agora<AnimatedEllipsis />
             </h3>
        </motion.div>

        {/* --- JANELA CENTRAL DE SOLUÇÃO --- */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, delay: 0.4, ease: "easeOut" }} // Delay ajustado
            onAnimationComplete={() => setStartGreenButton(true)}
            className="relative z-50 w-full max-w-5xl mx-auto rounded-[32px] border border-white/10 bg-[#080808] overflow-hidden group mb-20 shadow-2xl"
        >
             <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <GridPattern
                    width={40}
                    height={40}
                    x="-1"
                    y="-1"
                    className="stroke-white/10 fill-transparent"
                    squares={[[0, 0], [2, 1], [4, 3], [1, 5]]}
                />
             </div>
             
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

             <div className="relative z-10 px-8 py-10 md:py-12 text-center flex flex-col items-center">
                
                <span className="text-neutral-400 text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-8 border border-white/10 px-6 py-2 rounded-full bg-neutral-900/50 backdrop-blur-md">
                    Foi exatamente por isso que criamos
                </span>
                
                <div className="mb-8 transform transition-transform duration-500 hover:scale-105">
                    <WordmarkIcon className="h-12 md:h-16 text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]" />
                </div>

                <p className="text-xl md:text-2xl text-neutral-200 max-w-3xl font-medium leading-relaxed mb-10">
                    Pegamos os mesmos frameworks que formam CEOs, os processos que consultorias milionárias aplicam em corporações, e transformamos tudo em um sistema inteligente que funciona onde você já vive:
                </p>

                <GreenButtonCarousel startAnimation={startGreenButton} />

                <div className="flex items-center justify-center gap-3 mt-8 opacity-70 hover:opacity-100 transition-opacity">
                    <LockIcon className="w-4 h-4 text-neutral-400" />
                    <span className="text-xs md:text-sm text-neutral-400 font-medium tracking-wide">
                        Criptografia de ponta a ponta.
                    </span>
                </div>
                
             </div>
        </motion.div>

        {/* --- TEXTO INTRODUTÓRIO DO FLUXO 2 --- */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }} // Delay ajustado
            className="text-center mt-16 mb-10 relative z-20 px-4"
        >
             <h3 className="text-2xl md:text-4xl font-bold text-white mb-8 max-w-4xl mx-auto leading-tight">
                O primeiro sistema de gestão que democratiza metodologias de elite para negócios digitais.
             </h3>
             <p className="text-base font-bold text-neutral-400 uppercase tracking-[0.2em]">
                AGORA O CAMINHO É DIRETO:
             </p>
        </motion.div>

        {/* --- FLUXO 2 (SOCCEO) --- */}
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.1, delay: 0.4, ease: "easeOut" }} // Delay ajustado
            onAnimationComplete={() => setStartInstitutionsFlow2(true)}
            className="w-full flex justify-center py-8 relative z-10"
        >
             <InfrastructureFlow 
                labelCenter="SOCCEO" 
                labelInstituicoes="INSTITUIÇÕES" 
                startInstitutionAnim={startInstitutionsFlow2}
            />
        </motion.div>

      </div>
    </section>
  );
}

function ProblemCard({ delay, imageSrc, badgeText, badgeColor, title, description }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }} // Cards precisam de menos % visível para iniciar, mas o delay compensa
            transition={{ duration: 1.1, delay, ease: "easeOut" }} // Delay ajustado
            className="group relative h-full min-h-[400px] rounded-[32px] border border-white/10 bg-[#0A0A0A] overflow-hidden flex flex-col hover:border-white/20 transition-colors"
        >
            <div className="relative h-[200px] w-full overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/20 to-[#0A0A0A] z-10" />
                <img 
                    src={imageSrc} 
                    alt={title}
                    className="w-full h-full object-cover opacity-60 grayscale transition-all duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-80"
                />
            </div>

            <div className="relative z-20 flex-1 p-8 flex flex-col justify-start -mt-8">
                <div className="inline-flex self-start items-center rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-6 border-[#FFA11D]/30 bg-[#FFA11D]/10 text-[#FFA11D]">
                    {badgeText}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    {title}
                </h3>
                
                <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.div>
    )
}

function FeatureItem({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, delay }}
      className="p-8 rounded-2xl border border-white/5 bg-neutral-900/30 hover:bg-neutral-900/80 hover:border-white/20 transition-all duration-300 text-center group flex flex-col items-center min-h-[260px]"
    >
      <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-neutral-300 group-hover:scale-110 transition-transform duration-300 group-hover:text-white group-hover:bg-white/10 group-hover:border-white/30 group-hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
      <p className="text-sm text-neutral-400 leading-relaxed font-medium">{description}</p>
    </motion.div>
  );
}
