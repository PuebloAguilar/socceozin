
import React, { useState, useEffect } from 'react';
// FIX: Cast motion to `any` to bypass TypeScript errors due to a likely configuration issue.
import { motion as untypedMotion, AnimatePresence } from "framer-motion";
import { cn } from '../header/utils';
import { Check, X } from 'lucide-react';
import CtaButton from "../primeira-dobra/cta-button";

const motion = untypedMotion as any;

const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CoffeeIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <line x1="6" x2="6" y1="2" y2="4" />
    <line x1="10" x2="10" y1="2" y2="4" />
    <line x1="14" x2="14" y1="2" y2="4" />
  </svg>
)

const UtensilsIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
)

const BriefcaseIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

const ZapIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const ClockIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const ChartIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)

const FileTextIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
)

function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = React.useId();

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

// Data unificada para todas as comparações
const comparisonData = {
  sistemas: {
    title1: 'Sistemas Tradicionais',
    title2: 'Socceo',
    rows: [
      { feature: 'O que fazem', col1: 'Armazenam dados do passado', col2: 'Preveem o futuro e agem proativamente' },
      { feature: 'Como funcionam', col1: 'Você digita, eles salvam e esperam', col2: 'Sistema autônomo que prevê cenários e executa workflows' },
      { feature: 'Inteligência', col1: 'Relatórios estáticos do que já aconteceu', col2: 'Modelos preditivos em tempo real + recomendações acionáveis direto no WhatsApp' },
      { feature: 'Integração', col1: 'Ferramentas separadas que não conversam', col2: 'Sistema all-in-one fortificado com IA' },
      { feature: 'Metodologia', col1: 'Zero frameworks aplicados', col2: 'Sistema treinado com frameworks usados pelos melhores consultores' },
      { feature: 'Interface', col1: 'Plataformas complexas (desktop only)', col2: 'WhatsApp + Web + Tablet' },
      { feature: 'Aprendizado', col1: 'Semanas de treinamento', col2: '3 minutos para começar' },
    ],
    result1: 'Apenas organização do passado',
    result2: 'Previsibilidade + crescimento de 40–60% ao ano'
  },
  planilhas: {
    title1: 'Planilhas',
    title2: 'Socceo',
    rows: [
      { feature: 'Registro', col1: 'Você digita manualmente (12 min/dia)', col2: 'Registro por WhatsApp (8 s)' },
      { feature: 'Categorização', col1: 'Você categoriza sozinho', col2: 'O sistema categoriza tudo automaticamente' },
      { feature: 'Análise', col1: 'Você calcula fórmulas do passado', col2: 'Análise preditiva com modelos de regressão instantâneos' },
      { feature: 'Monitoramento', col1: 'Você esquece de abrir 78% das vezes', col2: 'Agentes proativos enviam alertas de desvios de padrão e previsões' },
      { feature: 'Integração', col1: 'Zero integração entre áreas', col2: 'Finanças + Vendas + Agenda integradas em tempo real' },
      { feature: 'Atualização', col1: 'Dados desatualizados (passado)', col2: 'Previsões em tempo real, 24/7' },
    ],
    result1: '120 h/ano desperdiçadas olhando o passado',
    result2: 'Automação total + visão do futuro'
  },
  erps: {
    title1: 'ERPs Tradicionais',
    title2: 'Socceo',
    rows: [
      { feature: 'Implementação', col1: 'Meses de onboarding', col2: '3 minutos para começar' },
      { feature: 'Treinamento', col1: 'Curva de aprendizado de semanas', col2: 'Se você usa WhatsApp, você sabe usar' },
      { feature: 'Interface', col1: 'Complexa e apenas desktop', col2: 'WhatsApp + Web + Tablet' },
      { feature: 'Função', col1: 'Apenas organizam dados do passado', col2: 'Agentes de IA autônomos que preveem, pensam e agem' },
      { feature: 'Inteligência', col1: 'Você interpreta relatórios históricos', col2: 'LLM entrega insights preditivos acionáveis e próximos passos' },
      { feature: 'Metodologia', col1: 'Zero frameworks aplicados', col2: 'Treinados com frameworks de Harvard/Stanford/McKinsey' },
      { feature: 'Custo', col1: 'Alto + consultoria', col2: 'Acessível e escalável' },
    ],
    result1: 'Ferramenta complexa que olha o passado',
    result2: 'Sócio que prevê o futuro com base no HOJE'
  },
  consultoria: {
    title1: 'Consultoria Tradicional',
    title2: 'Socceo',
    rows: [
      { feature: 'Custo', col1: 'R$ 50.000+/mês', col2: 'R$ 299,90/mês' }, // Atualizado aqui também por coerência
      { feature: 'Disponibilidade', col1: 'Reuniões semanais agendadas', col2: 'Interface conversacional (NLP) 24/7' },
      { feature: 'Velocidade', col1: 'Relatórios entregues em dias (dados históricos)', col2: 'Análise preditiva em tempo real via LLM' },
      { feature: 'Personalização', col1: 'Recomendações genéricas baseadas no passado', col2: 'Personalizado + previsões para SEU negócio' },
      { feature: 'Execução', col1: 'Você executa sozinho depois', col2: 'Agentes autônomos executam workflows COM você' },
      { feature: 'Contrato', col1: '6–12 meses de fidelidade', col2: 'Cancele quando quiser' },
      { feature: 'Expertise', col1: 'Acesso a 1–2 especialistas', col2: '8 pilares de metodologias aplicadas' },
    ],
    result1: 'Caro, inacessível e reativo',
    result2: 'Elite democratizada + proativa'
  }
};

const tabs = [
    { id: 'sistemas', label: 'vs. Sistemas' },
    { id: 'planilhas', label: 'vs. Planilhas' },
    { id: 'erps', label: 'vs. ERPs' },
    { id: 'consultoria', label: 'vs. Consultoria' },
];

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  
  // State for the comparison cycle (0 = Day, 1 = Week, 2 = Year)
  const [cycleIndex, setCycleIndex] = useState(0);

  // State for technical comparisons tabs
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const activeData = comparisonData[activeTab as keyof typeof comparisonData];

  useEffect(() => {
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % 3);
    }, 3000); // Rotate every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Data for the comparison cycle
  const comparisonDataCycle = [
      {
          label: "Dia",
          costText: "1 café por dia",
          icon: CoffeeIcon,
          time: { register: "8s", dash: "3s", report: "30s" },
          totalTime: "< 2min",
          savings: "20min/dia"
      },
      {
          label: "Semana",
          costText: "1 almoço executivo por semana",
          icon: UtensilsIcon,
          time: { register: "1min", dash: "20s", report: "3min" },
          totalTime: "< 10min",
          savings: "2.5h/semana"
      },
      {
          label: "Ano",
          costText: "1 mês de salário de estagiário por ano",
          icon: BriefcaseIcon,
          time: { register: "52min", dash: "18min", report: "2.6h" },
          totalTime: "< 9h",
          savings: "120h+/ano"
      }
  ];

  const currentData = comparisonDataCycle[cycleIndex];

  const calculatePrice = (basePrice: number) => {
    if (isAnnual) {
      return (basePrice * 0.75).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  const calculateTotalAnnual = (basePrice: number) => {
    return (basePrice * 0.75 * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  const plans = [
    {
      name: "Personal",
      basePrice: 39.90,
      priceLabel: isAnnual ? `R$ ${calculatePrice(39.90)}` : "R$ 39,90",
      period: "/mês",
      tagline: null,
      mainFeature: null, // Sem "Tudo do X +" para o primeiro plano
      features: [
         { 
           title: null, 
           items: [
             "1 usuário", 
             "Registro via WhatsApp", 
             "Categorização automática (IA)", 
             "Visualização de calendário", 
             "Lembretes automáticos", 
             "Relatórios mensais em PDF", 
             "Integração Google Agenda"
           ] 
         }
      ],
      support: { title: "💬 Suporte", text: "Chat, e-mail e/ou WhatsApp" },
      footer: "Ideal para finanças pessoais",
      cta: "Começar Grátis por 7 dias",
      highlighted: false,
      isCustom: false
    },
    {
      name: "Business",
      basePrice: 299.90,
      priceLabel: isAnnual ? `R$ ${calculatePrice(299.90)}` : "R$ 299,90",
      period: "/mês",
      tagline: null,
      mainFeature: "✓ Tudo do Personal +",
      features: [
          { 
            title: null, 
            items: [
              "Adicione novos usuários", 
              "Acesso para convidados", 
              "Múltiplos funis de vendas", 
              "Dashboard de até 5 projetos", 
              "Visualizações Gantt e cronograma", 
              "Alertas inteligentes", 
              "Análises e relatórios exclusivos"
            ] 
          }
      ],
      support: { title: "💬 Suporte completo", text: "Chat, e-mail, WhatsApp + apoio estratégico" },
      footer: "Ideal para pequenas empresas e startups",
      cta: "Começar Teste Grátis",
      highlighted: true,
      badge: "Recomendado",
      isCustom: false
    },
    {
      name: "Enterprise",
      basePrice: 0,
      priceLabel: "Personalizado",
      period: "",
      tagline: null,
      mainFeature: "✓ Tudo do Business +",
      features: [
          { 
            title: null, 
            items: [
              "Usuários, funis e dashboards ilimitados", 
              "Gestão de múltiplos times", 
              "White label personalizado", 
              "Workflows customizados", 
              "Visualizações avançadas (Kanban, Timeline, Board)", 
              "Treinamento da equipe", 
              "Consultoria estratégica mensal"
            ] 
          }
      ],
      support: { title: "💬 Suporte VIP", text: "Videochamada com especialista + gerente de Sucesso do Cliente + prioridade total" },
      footer: "Ideal para operações complexas e múltiplas equipes",
      cta: "Agendar Conversa",
      highlighted: false,
      isCustom: true
    }
  ];

  return (
    // Changed padding bottom to pb-8 as requested
    <section id="planos" className="relative pt-0 pb-8 bg-transparent w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6"
          >
            Escolha seu nível
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg text-neutral-300 mb-8"
          >
            Invista menos que um estagiário. Tenha o resultado de um board executivo.
          </motion.p>

          {/* Toggle */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-sm"
          >
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !isAnnual
                  ? 'bg-white text-black shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Mensal
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
                isAnnual
                  ? 'bg-white text-black shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Anual <span className="text-[10px] font-bold text-green-600 ml-1">-25%</span>
            </button>
          </motion.div>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }} // Adjusted delays for smoother staggering
              className={cn(
                "relative rounded-3xl p-8 transition-all duration-300 flex flex-col h-full",
                plan.highlighted
                  ? "bg-neutral-900 border-2 border-green-500/50 shadow-[0_0_40px_-10px_rgba(74,222,128,0.1)] scale-105 z-10"
                  : "bg-neutral-950 border border-white/10 hover:border-white/20 hover:bg-neutral-900"
              )}
            >
              {plan.highlighted && plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap">
                        {plan.badge}
                    </div>
                </div>
              )}

              {/* Price & Tagline */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl lg:text-4xl font-bold text-white whitespace-nowrap">{plan.priceLabel}</span>
                    {plan.period && (
                      <span className="text-sm text-neutral-400">{plan.period}</span>
                    )}
                  </div>
                  {isAnnual && !plan.isCustom && (
                    <span className="text-xs text-green-400 font-medium">
                        R$ {calculateTotalAnnual(plan.basePrice)} cobrado anualmente
                    </span>
                  )}
                </div>
                {plan.tagline && (
                  <div className="mt-4 pb-4 border-b border-white/10">
                      <p className="text-sm font-semibold text-white leading-relaxed">
                          {plan.tagline}
                      </p>
                  </div>
                )}
                {!plan.tagline && <div className="mt-6 border-b border-white/10" />}
              </div>

              {/* Features Scroll */}
              <div className="space-y-6 mb-8 flex-1 text-sm">
                 {/* Main Feature Header - Condicional */}
                 {plan.mainFeature && (
                    <p className="font-bold text-white">{plan.mainFeature}</p>
                 )}
                 
                 {plan.features.map((group, idx) => (
                    <div key={idx} className="space-y-3">
                        {group.title && (
                            <p className="text-xs font-bold uppercase tracking-wider text-green-400 mt-4 mb-2">
                                {group.title}
                            </p>
                        )}
                        {group.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-start gap-3">
                                <div className={cn(
                                    "mt-0.5 p-0.5 rounded-full flex items-center justify-center w-4 h-4 shrink-0",
                                    plan.highlighted ? "bg-green-500/20 text-green-400" : "bg-white/10 text-neutral-300"
                                )}>
                                    <CheckIcon className="w-2.5 h-2.5" />
                                </div>
                                <span className="text-neutral-300 leading-tight">{item}</span>
                            </div>
                        ))}
                    </div>
                 ))}
                 
                 {/* Support Section */}
                 <div className="pt-4 border-t border-white/10 mt-4">
                     <p className="font-bold text-white mb-1">{plan.support.title}</p>
                     <p className="text-neutral-400 text-xs leading-relaxed">{plan.support.text}</p>
                 </div>
              </div>

              {/* Footer Note */}
              <div className="mb-6">
                 <p className="text-xs text-center text-neutral-500 italic">
                     {plan.footer}
                 </p>
              </div>

              <button
                className={cn(
                  "w-full py-3.5 px-6 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95",
                  plan.highlighted
                    ? "bg-green-500 text-black hover:bg-green-400 shadow-lg shadow-green-900/20"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/5"
                )}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-neutral-500 text-sm">
                * Valores cobrados {isAnnual ? "anualmente" : "mensalmente"}. Cancelamento gratuito em até 7 dias.
            </p>
        </div>

        {/* --- SEÇÃO COMPARATIVA ESTILO SÓCIO (DESIGN ATUALIZADO & COMPACTO) --- */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="relative z-50 w-full max-w-4xl mx-auto rounded-[24px] border border-white/10 bg-[#080808] overflow-hidden mt-16 shadow-2xl"
        >
             {/* Background Grid Pattern */}
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
             
             {/* Central White Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

             {/* Content Container - Padding reduzido e layout compacto */}
             <div className="relative z-10 p-6 md:p-8">
                 
                 {/* 1. ANIMAÇÃO DE CUSTO */}
                 <div className="text-center mb-10 relative z-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Quanto Custa Ter o Controle Total?</h3>
                    <div className="flex items-center justify-center gap-2 text-lg md:text-xl text-neutral-300">
                        <span>Menos que</span>
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentData.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="inline-flex items-center gap-2 text-[#FFA11D] font-bold bg-[#FFA11D]/10 px-3 py-1 rounded-md border border-[#FFA11D]/20"
                            >
                                <currentData.icon className="w-5 h-5" />
                                <span>{currentData.costText}</span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                 </div>

                 {/* Sem linha divisória, apenas espaço */}

                 {/* 2. ANIMAÇÃO DE TEMPO */}
                 <div className="relative z-10">
                     <div className="text-center mb-6">
                         <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-green-900/10">
                            <ClockIcon className="w-3.5 h-3.5" /> Quanto Tempo Você Investe?
                         </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {/* Card 1: Registrar */}
                         <div className="bg-[#111] border border-white/10 rounded-xl p-5 text-center transition-all duration-300">
                            <div className="w-10 h-10 mx-auto bg-[#FFA11D]/10 rounded-lg flex items-center justify-center mb-3">
                                <ZapIcon className="w-5 h-5 text-[#FFA11D]" />
                            </div>
                            <p className="text-xs font-medium text-neutral-400 mb-1 uppercase tracking-wide">Registrar</p>
                            <AnimatePresence mode="wait">
                                <motion.p 
                                    key={`register-${cycleIndex}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-3xl font-bold text-white transition-colors"
                                >
                                    {currentData.time.register}
                                </motion.p>
                            </AnimatePresence>
                         </div>

                         {/* Card 2: Dashboard */}
                         <div className="bg-[#111] border border-white/10 rounded-xl p-5 text-center transition-all duration-300">
                            <div className="w-10 h-10 mx-auto bg-[#FFA11D]/10 rounded-lg flex items-center justify-center mb-3">
                                <ChartIcon className="w-5 h-5 text-[#FFA11D]" />
                            </div>
                            <p className="text-xs font-medium text-neutral-400 mb-1 uppercase tracking-wide">Dashboard</p>
                            <AnimatePresence mode="wait">
                                <motion.p 
                                    key={`dash-${cycleIndex}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-3xl font-bold text-white transition-colors"
                                >
                                    {currentData.time.dash}
                                </motion.p>
                            </AnimatePresence>
                         </div>

                         {/* Card 3: Relatório */}
                         <div className="bg-[#111] border border-white/10 rounded-xl p-5 text-center transition-all duration-300">
                            <div className="w-10 h-10 mx-auto bg-[#FFA11D]/10 rounded-lg flex items-center justify-center mb-3">
                                <FileTextIcon className="w-5 h-5 text-[#FFA11D]" />
                            </div>
                            <p className="text-xs font-medium text-neutral-400 mb-1 uppercase tracking-wide">Relatório</p>
                            <AnimatePresence mode="wait">
                                <motion.p 
                                    key={`report-${cycleIndex}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-3xl font-bold text-white transition-colors"
                                >
                                    {currentData.time.report}
                                </motion.p>
                            </AnimatePresence>
                         </div>
                     </div>

                     {/* Total Line */}
                     <div className="mt-6 text-center">
                        <p className="text-base text-white font-medium flex items-center justify-center gap-2">
                            Total por {currentData.label}: 
                            <AnimatePresence mode="wait">
                                <motion.span 
                                    key={`total-${cycleIndex}`}
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -5 }}
                                    className="text-green-400 font-bold"
                                >
                                    {currentData.totalTime}
                                </motion.span>
                            </AnimatePresence>
                        </p>
                     </div>

                     {/* 3. ANIMAÇÃO DE ECONOMIA */}
                     <div className="mt-6 bg-gradient-to-r from-neutral-900/50 via-neutral-800/50 to-neutral-900/50 border border-white/10 rounded-xl p-4 text-center shadow-lg backdrop-blur-sm">
                         <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-base md:text-lg text-neutral-200 font-medium">
                            <span>Você Economiza</span>
                            <AnimatePresence mode="wait">
                                <motion.span 
                                    key={`save-${cycleIndex}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-[#FFA11D] font-bold bg-[#FFA11D]/10 px-2 py-0.5 rounded border border-[#FFA11D]/20 whitespace-nowrap"
                                >
                                    {currentData.savings}
                                </motion.span>
                            </AnimatePresence>
                            <span className="text-sm md:text-base text-neutral-400">vs. planilhas separadas</span>
                         </div>
                         <p className="text-xs text-neutral-500 mt-1 font-medium">
                            Tempo livre para estratégia e crescimento
                         </p>
                     </div>
                 </div>
             </div>
        </motion.div>

        {/* --- COMPARATIVOS TÉCNICOS (TABELAS) --- */}
        <motion.div 
          className="mt-24 w-full max-w-5xl mx-auto" 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center mb-8">
               <p className="text-base font-bold text-neutral-400 uppercase tracking-[0.2em] mb-2">
                  COMPARATIVOS TÉCNICOS
              </p>
              <h3 className="text-2xl font-bold text-white">A prova real em números</h3>
          </div>

          {/* Menu de Abas Compacto */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 bg-neutral-900/80 p-1.5 rounded-full border border-white/10 backdrop-blur-md w-fit mx-auto shadow-lg">
            {tabs.map((tab) => (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                      "relative px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-colors duration-300 uppercase tracking-wide",
                      activeTab === tab.id ? "text-black" : "text-neutral-400 hover:text-white"
                  )}
              >
                  {activeTab === tab.id && (
                      <motion.div
                          layoutId="active-comparison-pill"
                          className="absolute inset-0 bg-white rounded-full shadow-lg"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                  )}
                  <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
              >
                {/* Tabela Tecnológica Compacta */}
                <div className="rounded-2xl border border-white/10 bg-neutral-950/80 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                  
                  {/* Linha de brilho superior sutil (branca) */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* Header */}
                  <div className="grid grid-cols-[0.6fr,1fr,1fr] p-4 bg-white/5 border-b border-white/5">
                    <h3 className="font-mono text-neutral-500 text-[10px] uppercase tracking-widest self-center">Recurso</h3>
                    <h3 className="font-bold text-neutral-400 text-xs md:text-sm uppercase tracking-wider text-center self-center">{activeData.title1}</h3>
                    <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider text-center text-white self-center">{activeData.title2}</h3>
                  </div>

                  {/* Corpo da Tabela */}
                  <div className="divide-y divide-white/5 relative">
                      {activeData.rows.map((row, idx) => (
                          <div 
                              key={row.feature} 
                              className="grid grid-cols-[0.6fr,1fr,1fr] p-4 items-center hover:bg-white/5 transition-colors duration-200 relative group"
                          >
                              <span className="font-semibold text-neutral-400 text-xs md:text-sm">{row.feature}</span>
                              <span className="text-neutral-500 text-center text-[11px] md:text-xs leading-tight px-2 group-hover:text-neutral-400 transition-colors">{row.col1}</span>
                              <span className="text-white text-center font-medium text-[11px] md:text-xs leading-tight px-2">{row.col2}</span>
                          </div>
                      ))}
                  </div>

                  {/* Footer / Resultado */}
                  <div className="grid grid-cols-[0.6fr,1fr,1fr] p-5 items-center bg-black/40 border-t border-white/10">
                      <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">Impacto</span>
                      
                      {/* Resultado Negativo (Vermelho) */}
                      <div className="flex justify-center px-2">
                          <span className="text-red-400 text-center text-[10px] md:text-xs font-bold bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-md w-full">
                              {activeData.result1}
                          </span>
                      </div>

                      {/* Resultado Positivo (Verde) */}
                      <div className="flex justify-center px-2">
                          <span className="text-green-400 text-center text-[10px] md:text-xs font-bold bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-md w-full shadow-[0_0_15px_-5px_rgba(34,197,94,0.3)]">
                              {activeData.result2}
                          </span>
                      </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* --- SEÇÃO REMOVIDA: RESULTADO FINAL & CTA --- */}

      </div>
    </section>
  );
};

export default PricingSection;
