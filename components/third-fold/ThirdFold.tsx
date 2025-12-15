
import React, { useState, useEffect } from "react";
// FIX: Cast motion to `any` to bypass TypeScript errors due to a likely configuration issue.
import { motion as untypedMotion, AnimatePresence } from "framer-motion";
import { Spotlight } from "../ui/spotlight-new";
import { PinContainer, PinHoverContent } from "./PinContainer";
import { cn } from '../header/utils';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import {
	BarChart,
	Handshake,
	LayersIcon,
	UserPlusIcon,
	GlobeIcon,
	CodeIcon,
	TargetIcon,
	DollarSignIcon,
} from '../header/ui/Icons';
import { useBlog } from "../../context/BlogContext";


const motion = untypedMotion as any;

export type Methodology = {
    name: string;
    humanTitle: string;
    humanPoints: string[];
    humanResult: string;
    aiTitle: string;
    aiPoints: string[];
    aiResult: string;
    stats: { label: string; value: string }[];
};

export type FeatureType = {
	title: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	description: string;
    methodologies: Methodology[];
};

const knowledgeFeatures: FeatureType[] = [
    {
        title: 'Marketing',
        description: 'Estratégias para alcançar e converter seu público-alvo.',
        icon: BarChart,
        methodologies: [
            {
                name: "Growth Loops & Data-Driven",
                humanTitle: "Gastar verba em canais por 'feeling'",
                humanPoints: [
                    "Orçamento desperdiçado em canais ruins",
                    "Decisões baseadas em impressões pessoais",
                    "Impossível prever retorno real"
                ],
                humanResult: "CAC alto, crescimento travado",
                aiTitle: "Alocação preditiva em tempo real",
                aiPoints: [
                    "IA define ICP e canais de tração",
                    "Otimização contínua de ROAS",
                    "Realocação automática de verba"
                ],
                aiResult: "Otimização de Verba (+40%)",
                stats: [
                    { label: "Otimização", value: "+40%" },
                    { label: "Precisão", value: "95%" }
                ]
            },
            {
                name: "ABM (Account-Based Marketing)",
                humanTitle: "Atirar para todo lado",
                humanPoints: [
                    "Leads desqualificados no funil",
                    "Time de vendas frustrado",
                    "Mensagens genéricas sem impacto"
                ],
                humanResult: "Baixa conversão em Ticket Alto",
                aiTitle: "Hiper-personalização B2B",
                aiPoints: [
                    "Mapeamento automático de decisores",
                    "Campanhas 'Sniper' personalizadas",
                    "Nutrição específica por cargo"
                ],
                aiResult: "Contratos Enterprise (+3x)",
                stats: [
                    { label: "Deal Size", value: "+3x" },
                    { label: "Engajamento", value: "88%" }
                ]
            },
            {
                name: "Brand Equity & Posicionamento",
                humanTitle: "Marca commodity sem diferencial",
                humanPoints: [
                    "Guerra de preços constante",
                    "Cliente não vê valor único",
                    "Dependência total de tráfego pago"
                ],
                humanResult: "Margens esmagadas",
                aiTitle: "Construção de autoridade automática",
                aiPoints: [
                    "Análise de sentimento de mercado",
                    "Matriz de diferenciação competitiva",
                    "Consistência de narrativa multicanal"
                ],
                aiResult: "LTV e Lealdade (+60%)",
                stats: [
                    { label: "LTV", value: "+60%" },
                    { label: "Indicação", value: "4.8/5" }
                ]
            }
        ]
    },
    {
        title: 'Vendas',
        description: 'Converta leads em clientes com processos de vendas escaláveis.',
        icon: TargetIcon,
        methodologies: [
            {
                name: "SPIN Selling & Challenger",
                humanTitle: "Vender funcionalidades, não valor",
                humanPoints: [
                    "Cliente não entende o ROI",
                    "Scripts genéricos que não convertem",
                    "Ciclo de vendas longo e cego"
                ],
                humanResult: "Conversão baixa, receita travada",
                aiTitle: "Automação de scripts persuasivos",
                aiPoints: [
                    "Estruturação automática de perguntas",
                    "Scripts personalizados por objeção",
                    "Análise de conversão em tempo real"
                ],
                aiResult: "Taxa de Conversão (+28%)",
                stats: [
                    { label: "Conversão", value: "+28%" },
                    { label: "Ciclo", value: "-15 dias" }
                ]
            },
            {
                name: "Forecast & Pipeline Management",
                humanTitle: "Pipeline 'sujo' e imprevisível",
                humanPoints: [
                    "Forecast baseado em otimismo",
                    "Oportunidades estagnadas ocultas",
                    "Surpresas negativas no fim do mês"
                ],
                humanResult: "Meta não batida recorrentemente",
                aiTitle: "Predição de fechamento por IA",
                aiPoints: [
                    "Scoring automático de oportunidades",
                    "Alertas de estagnação de deals",
                    "Previsão de receita com 95% precisão"
                ],
                aiResult: "Acuracidade (+95%)",
                stats: [
                    { label: "Acuracidade", value: "95%" },
                    { label: "Receita", value: "+22%" }
                ]
            },
            {
                name: "Sales Enablement",
                humanTitle: "Vendedores sem munição",
                humanPoints: [
                    "Materiais desatualizados",
                    "Treinamento demorado e caro",
                    "Ramp-up lento de novos vendedores"
                ],
                humanResult: "Time ocioso e ineficiente",
                aiTitle: "Playbooks dinâmicos instantâneos",
                aiPoints: [
                    "Geração de cases por segmento",
                    "Battlecards contra concorrentes",
                    "Ramp-up acelerado por IA"
                ],
                aiResult: "Ramp-up (-40%)",
                stats: [
                    { label: "Ramp-up", value: "-40%" },
                    { label: "Produtividade", value: "+35%" }
                ]
            }
        ]
    },
    {
        title: 'Negociação',
        description: 'Técnicas para fechar acordos vantajosos e construir parcerias.',
        icon: Handshake,
        methodologies: [
            {
                name: "Harvard Principled Negotiation",
                humanTitle: "Ceder margem por pressão",
                humanPoints: [
                    "Negociação sem análise de BATNA",
                    "Decisões emocionais na mesa",
                    "Falta de dados para sustentar preço"
                ],
                humanResult: "Margem e lucro comprometidos",
                aiTitle: "Simulação de cenários e ZOPA",
                aiPoints: [
                    "Mapeamento automático de interesses",
                    "Scripts de quebra de objeções",
                    "Cálculo de margem em tempo real"
                ],
                aiResult: "Margem Preservada (+12%)",
                stats: [
                    { label: "Margem", value: "+12%" },
                    { label: "Fechamento", value: "8/10" }
                ]
            },
            {
                name: "Chris Voss & Tactical Empathy",
                humanTitle: "Negociar contra a parede",
                humanPoints: [
                    "Medo de perder o acordo",
                    "Aceitar 'talvez' como resposta",
                    "Falar demais e ouvir de menos"
                ],
                humanResult: "Acordos ruins ou perdidos",
                aiTitle: "Perfis psicológicos e espelhamento",
                aiPoints: [
                    "Análise de perfil do interlocutor",
                    "Sugestão de perguntas calibradas",
                    "Detecção de blefes por padrão"
                ],
                aiResult: "Contratos Melhores (+30%)",
                stats: [
                    { label: "Valor", value: "+30%" },
                    { label: "Velocidade", value: "+50%" }
                ]
            },
            {
                name: "Game Theory & Strategy",
                humanTitle: "Visão de curto prazo",
                humanPoints: [
                    "Ganhar a batalha, perder a guerra",
                    "Falta de visão de múltiplos cenários",
                    "Surpresas com movimentos rivais"
                ],
                humanResult: "Fragilidade estratégica",
                aiTitle: "Árvores de decisão probabilística",
                aiPoints: [
                    "Mapeamento de movimentos futuros",
                    "Análise de Nash Equilibrium",
                    "Estratégias de Lock-in"
                ],
                aiResult: "Domínio de Mercado",
                stats: [
                    { label: "Retenção", value: "Top 1%" },
                    { label: "Risco", value: "-60%" }
                ]
            }
        ]
    },
    {
        title: 'Gestão',
        description: 'Ferramentas para organizar processos e otimizar recursos.',
        icon: LayersIcon,
        methodologies: [
            {
                name: "OKRs & Matriz Eisenhower",
                humanTitle: "Microgerenciamento operacional",
                humanPoints: [
                    "Tempo perdido em tarefas urgentes",
                    "Equipe sem clareza de prioridades",
                    "Metas esquecidas no papel"
                ],
                humanResult: "Burnout e baixa produtividade",
                aiTitle: "Priorização por impacto financeiro",
                aiPoints: [
                    "OKRs trimestrais automáticos",
                    "Delegação inteligente por perfil",
                    "Dashboard de produtividade ao vivo"
                ],
                aiResult: "Tempo Operacional (-60%)",
                stats: [
                    { label: "Produtividade", value: "3x" },
                    { label: "Tempo", value: "-60%" }
                ]
            },
            {
                name: "Lean Six Sigma",
                humanTitle: "Processos inchados e caros",
                humanPoints: [
                    "Retrabalho constante",
                    "Desperdício de recursos invisível",
                    "Qualidade oscilante"
                ],
                humanResult: "Custo alto, cliente insatisfeito",
                aiTitle: "Detecção de gargalos e desperdício",
                aiPoints: [
                    "Mapeamento de fluxo de valor",
                    "Identificação automática de falhas",
                    "Padronização de SOPs com IA"
                ],
                aiResult: "Eficiência (+45%)",
                stats: [
                    { label: "Erros", value: "-80%" },
                    { label: "Eficiência", value: "+45%" }
                ]
            },
             {
                name: "Agile & Scrum",
                humanTitle: "Projetos atrasados e estáticos",
                humanPoints: [
                    "Entregas demoram meses",
                    "Falta de adaptação a mudanças",
                    "Feedback loop lento"
                ],
                humanResult: "Perda de time-to-market",
                aiTitle: "Sprints dinâmicos e adaptáveis",
                aiPoints: [
                    "Gestão automática de backlog",
                    "Dailies sintetizadas por IA",
                    "Retrospectivas baseadas em dados"
                ],
                aiResult: "Entregas (+2x)",
                stats: [
                    { label: "Velocidade", value: "2x" },
                    { label: "Adaptação", value: "Instantânea" }
                ]
            }
        ]
    },
    {
        title: 'Finanças',
        description: 'Domine o fluxo de caixa e a saúde financeira do seu negócio.',
        icon: DollarSignIcon,
        methodologies: [
            {
                name: "Zero-Based Budgeting",
                humanTitle: "Orçamento 'copia e cola'",
                humanPoints: [
                    "Gastos ineficientes perpetuados",
                    "Alocação baseada em histórico ruim",
                    "Gordura financeira acumulada"
                ],
                humanResult: "Lucratividade estagnada",
                aiTitle: "Alocação baseada em ROI atual",
                aiPoints: [
                    "Justificativa automática de custos",
                    "Cortes cirúrgicos de desperdício",
                    "Reinvestimento dinâmico"
                ],
                aiResult: "Redução de Custos (-22%)",
                stats: [
                    { label: "Custos", value: "-22%" },
                    { label: "Lucro", value: "+15%" }
                ]
            },
            {
                name: "FP&A (Financial Planning)",
                humanTitle: "Ignorar o fluxo de caixa futuro",
                humanPoints: [
                    "Sem previsão de caixa confiável",
                    "Surpresas quando a conta chega",
                    "Decisões financeiras no escuro"
                ],
                humanResult: "Crises de caixa constantes",
                aiTitle: "Previsão de 90 dias e alertas",
                aiPoints: [
                    "Simulação de cenários (Best/Worst)",
                    "Controle de pagamentos e cobranças",
                    "DRE atualizado em tempo real"
                ],
                aiResult: "Previsibilidade (98%)",
                stats: [
                    { label: "Previsibilidade", value: "98%" },
                    { label: "Caixa", value: "Blindado" }
                ]
            },
             {
                name: "Unit Economics",
                humanTitle: "Crescer com prejuízo invisível",
                humanPoints: [
                    "LTV e CAC desconhecidos",
                    "Margem de contribuição errada",
                    "Escala que gera prejuízo"
                ],
                humanResult: "Quebra por crescimento",
                aiTitle: "Monitoramento de saúde unitária",
                aiPoints: [
                    "Cálculo de LTV/CAC em tempo real",
                    "Análise de Cohort automática",
                    "Alerta de margem negativa"
                ],
                aiResult: "Escala Saudável",
                stats: [
                    { label: "Saúde", value: "100%" },
                    { label: "Escala", value: "Sustentável" }
                ]
            }
        ]
    },
    {
        title: 'Liderança',
        description: 'Inspire equipes e guie sua empresa para o sucesso.',
        icon: UserPlusIcon,
        methodologies: [
            {
                name: "Situational Leadership II",
                humanTitle: "Gestão 'tamanho único'",
                humanPoints: [
                    "Microgerenciar seniors",
                    "Abandonar juniors sem apoio",
                    "Liderança baseada em ego"
                ],
                humanResult: "Turnover alto, equipe desmotivada",
                aiTitle: "Adaptação ao nível de maturidade",
                aiPoints: [
                    "Diagnóstico de maturidade por tarefa",
                    "Roteiros de delegação personalizados",
                    "Monitoramento de evolução"
                ],
                aiResult: "Retenção de Talentos (+45%)",
                stats: [
                    { label: "Retenção", value: "+45%" },
                    { label: "Engajamento", value: "Top 1%" }
                ]
            },
            {
                name: "Radical Candor",
                humanTitle: "Feedback sanduíche ou agressivo",
                humanPoints: [
                    "Medo de dar feedback real",
                    "Elogios vazios sem direção",
                    "Críticas que destroem confiança"
                ],
                humanResult: "Mediocridade instalada",
                aiTitle: "Desafio direto com cuidado pessoal",
                aiPoints: [
                    "Estruturação de conversas difíceis",
                    "Roteiros de feedback contínuo",
                    "Cultura de alta performance"
                ],
                aiResult: "Performance (+40%)",
                stats: [
                    { label: "Clareza", value: "100%" },
                    { label: "Performance", value: "+40%" }
                ]
            },
            {
                name: "Pipeline de Liderança",
                humanTitle: "Gargalo na sucessão",
                humanPoints: [
                    "Dependência de pessoas chave",
                    "Promoções sem preparo",
                    "Empresa para se o líder sai"
                ],
                humanResult: "Fragilidade organizacional",
                aiTitle: "Fábrica de novos líderes",
                aiPoints: [
                    "PDIs automáticos para sucessão",
                    "Identificação de Hi-Pos (High Potential)",
                    "Mentoria estruturada por IA"
                ],
                aiResult: "Sucessão Garantida",
                stats: [
                    { label: "Sucessores", value: "Prontos" },
                    { label: "Risco", value: "Zero" }
                ]
            }
        ]
    },
    {
        title: 'Empreendedorismo',
        description: 'Do conceito à escala, construindo negócios de alto impacto.',
        icon: GlobeIcon,
        methodologies: [
            {
                name: "Lean Startup",
                humanTitle: "Construir o que ninguém quer",
                humanPoints: [
                    "Meses desenvolvendo sem testar",
                    "Investimento alto em incertezas",
                    "Falta de validação real"
                ],
                humanResult: "Recursos queimados, falência",
                aiTitle: "Ciclo Construir-Medir-Aprender",
                aiPoints: [
                    "Design de experimentos rápidos",
                    "Validação de MVP em tempo real",
                    "Pivotagem baseada em dados"
                ],
                aiResult: "Taxa de Sucesso (7x)",
                stats: [
                    { label: "Time-to-Market", value: "-4 meses" },
                    { label: "Sucesso", value: "7x" }
                ]
            },
            {
                name: "Blitzscaling",
                humanTitle: "Crescimento linear lento",
                humanPoints: [
                    "Medo de arriscar na escala",
                    "Processos que quebram ao crescer",
                    "Perda de market-share"
                ],
                humanResult: "Irrelevância no mercado",
                aiTitle: "Priorizar velocidade sobre eficiência",
                aiPoints: [
                    "Estratégias de efeitos de rede",
                    "Contratação em hipercrescimento",
                    "Gestão de caos controlado"
                ],
                aiResult: "Domínio Global",
                stats: [
                    { label: "Crescimento", value: "Exponencial" },
                    { label: "Market Share", value: "Dominante" }
                ]
            },
            {
                name: "Effectuation",
                humanTitle: "Paralisia por falta de recursos",
                humanPoints: [
                    "Esperar o momento 'perfeito'",
                    "Focar no que falta (dinheiro/tempo)",
                    "Previsão excessiva sem ação"
                ],
                humanResult: "Ideias que nunca saem do papel",
                aiTitle: "Começar com o que se tem",
                aiPoints: [
                    "Inventário de recursos disponíveis",
                    "Parcerias estratégicas imediatas",
                    "Perda aceitável como guia"
                ],
                aiResult: "Execução Imediata",
                stats: [
                    { label: "Ação", value: "Hoje" },
                    { label: "Custo", value: "Zero" }
                ]
            }
        ]
    },
    {
        title: 'Inovação',
        description: 'Crie soluções disruptivas e mantenha-se à frente do mercado.',
        icon: CodeIcon,
        methodologies: [
            {
                name: "Design Thinking",
                humanTitle: "Soluções para problemas irreais",
                humanPoints: [
                    "Inovação sem foco no usuário",
                    "P&D caro sem retorno mensurável",
                    "Soluções que não resolvem dores"
                ],
                humanResult: "Investimento perdido",
                aiTitle: "Empatia e Prototipagem Rápida",
                aiPoints: [
                    "Mapeamento profundo de dores",
                    "Ideação baseada em dados reais",
                    "Testes de usabilidade ágeis"
                ],
                aiResult: "ROI de P&D (5x)",
                stats: [
                    { label: "Adoção", value: "+80%" },
                    { label: "ROI", value: "5x" }
                ]
            },
            {
                name: "Blue Ocean Strategy",
                humanTitle: "Competir no oceano vermelho",
                humanPoints: [
                    "Briga por preço sangrenta",
                    "Mercado saturado e comoditizado",
                    "Margens cada vez menores"
                ],
                humanResult: "Sobrevivência difícil",
                aiTitle: "Criar novos espaços de mercado",
                aiPoints: [
                    "Matriz de avaliação de valor",
                    "Eliminar, Reduzir, Elevar, Criar",
                    "Tornar a concorrência irrelevante"
                ],
                aiResult: "Margem Única",
                stats: [
                    { label: "Concorrência", value: "Irrelevante" },
                    { label: "Lucro", value: "Maxi" }
                ]
            },
            {
                name: "Jobs to be Done",
                humanTitle: "Focar no produto, não no progresso",
                humanPoints: [
                    "Melhorias que ninguém pediu",
                    "Marketing focado em features",
                    "Churn por falta de fit"
                ],
                humanResult: "Produto obsoleto",
                aiTitle: "Entender a causalidade da compra",
                aiPoints: [
                    "Identificação do 'trabalho' real",
                    "Foco nas dimensões funcionais e emocionais",
                    "Inovação precisa e direcionada"
                ],
                aiResult: "Fit Perfeito",
                stats: [
                    { label: "Churn", value: "-50%" },
                    { label: "Satisfação", value: "Total" }
                ]
            }
        ]
    },
];

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
)

const CrossIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
)

const ORANGE_COLOR = "#FFA11D"; 
const GREEN_COLOR = "#4ade80"; // Verde para o card "Com o Socceo"
const GREEN_BG_LOW = "rgba(74, 222, 128, 0.05)";

interface ThirdFoldProps {
    onOpenBlog?: (post?: any, options?: { section?: string, category?: string }) => void;
}

const ThirdFold = ({ onOpenBlog }: ThirdFoldProps) => {
  const { posts } = useBlog(); // Access dynamic posts from context
  const ref = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeMethodologyIndex, setActiveMethodologyIndex] = useState(0); // Estado para controlar a metodologia ativa
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Filter only insight type posts for display in the carousel
  const recentInsights = posts.filter(p => p.type === 'INSIGHT').slice(0, 3);
  
  // Filter frameworks for the library section
  const frameworks = posts.filter(p => p.type === 'FRAMEWORK' || (p.type !== 'INSIGHT' && !p.type));

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset metodologia quando muda o card principal
  useEffect(() => {
    setActiveMethodologyIndex(0);
  }, [activeIndex]);

  // Rotação automática das metodologias (Desktop - 4 segundos)
  useEffect(() => {
    if (isMobile) return; // Disable methodology rotation on mobile as panel is hidden

    const timer = setInterval(() => {
        setActiveMethodologyIndex((prev) => {
             const activeFeature = knowledgeFeatures[activeIndex];
             const nextIndex = prev + 1;
             // Volta para 0 se passar do limite de metodologias
             if (nextIndex >= activeFeature.methodologies.length) return 0;
             return nextIndex;
        });
    }, 4000); // 4000ms = 4 segundos

    return () => clearInterval(timer);
  }, [activeIndex, isMobile]);

  // MOBILE: Rotação automática REMOVIDA conforme pedido
  // Apenas controle manual via botões

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setActiveIndex((prev) => {
        let nextIndex = prev + newDirection;
        if (nextIndex < 0) nextIndex = knowledgeFeatures.length - 1;
        if (nextIndex >= knowledgeFeatures.length) nextIndex = 0;
        return nextIndex;
    });
  };

  const handleOpenBlog = (post: any = null, options: { section?: string, category?: string } | null = null) => {
      if (onOpenBlog) {
          onOpenBlog(post, options);
      }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)",
    }),
  };
  
  const contentVariants = {
      initial: { opacity: 0, filter: 'blur(4px)' },
      animate: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(4px)' }
  };

  const activeFeature = knowledgeFeatures[activeIndex];
  const activeMethodology = activeFeature.methodologies[activeMethodologyIndex];

  return (
    <div
      ref={ref}
      id="recursos" // Adicionado ID para navegação
      className="w-full flex flex-col items-center justify-center py-12 md:py-16 relative overflow-hidden bg-black"
    >
      <motion.div 
        initial={{ opacity: 0, y: 30 }} // Ajuste de Y para entrada mais suave
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }} // Margem ajustada para disparar com antecedência
        transition={{ duration: 0.8, ease: "easeOut" }} // Duração reduzida para sensação de agilidade
        className="p-4 max-w-7xl mx-auto relative z-10 w-full flex flex-col items-center"
      >
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-4 relative z-20">

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 pb-2">
            Transforme Cada Área em Vantagem Competitiva
            </h2>
            <p className="mt-6 text-lg md:text-xl text-neutral-300 font-medium leading-relaxed max-w-3xl mx-auto">
            8 pilares estratégicos fortificados com frameworks validados pelas maiores instituições do mundo. Marketing que prevê ROI. Vendas que projeta fechamentos. Finanças que antecipa fluxo. Operação que detecta gargalos. Cada área trabalhando como sistema integrado de previsão e execução.
            </p>
        </div>

        {/* --- Knowledge Base Features Section (Carousel) --- */}
        <div className="mt-16 md:mt-24 w-full max-w-[1280px] px-2 md:px-6">
            
            {/* LAYOUT GRID */}
            <div className="w-full grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 lg:gap-12 items-center">
                
                {/* ESQUERDA: NAV + CARD (HIDDEN ON MOBILE) */}
                <div className="hidden md:flex flex-col items-center justify-center gap-6 order-1">
                    
                    <div className="flex items-center gap-4 md:gap-8">
                        {/* BOTÃO ANTERIOR */}
                        <button
                            onClick={() => paginate(-1)}
                            className="group hidden md:flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-neutral-900 text-white/70 transition-colors hover:bg-neutral-800 hover:text-white active:scale-95"
                            aria-label="Anterior"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 transition-transform group-hover:-translate-x-1"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>

                        {/* CARD VISUAL */}
                        <div className="relative w-64 h-64 md:w-60 md:h-60 lg:w-72 lg:h-72 perspective-1000 transition-all duration-300">
                            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                <motion.div
                                    key={activeIndex}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 },
                                        scale: { duration: 0.2 },
                                        filter: { duration: 0.2 }
                                    }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <PinContainer
                                        title={activeFeature.title}
                                        href="#"
                                        containerClassName="w-full h-full flex items-center justify-center"
                                        socioColor={ORANGE_COLOR}
                                        chartColor={GREEN_COLOR}
                                    >
                                        <div 
                                            className="flex flex-col p-6 w-64 h-64 md:w-60 md:h-60 lg:w-72 lg:h-72 cursor-pointer"
                                            onClick={() => handleOpenBlog()} // Make the content area trigger the library
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="mb-3" style={{ color: ORANGE_COLOR }}>
                                                    {React.createElement(activeFeature.icon, {
                                                        className: "size-8 md:size-7 lg:size-8",
                                                        strokeWidth: 1.5,
                                                        "aria-hidden": true
                                                    })}
                                                </div>
                                                <h3 className="text-xl md:text-lg lg:text-xl font-bold text-white mb-2">{activeFeature.title}</h3>
                                            </div>
                                            <p className="text-neutral-400 mt-2 text-sm md:text-xs lg:text-sm font-normal flex-grow leading-relaxed">
                                                {activeFeature.description}
                                            </p>
                                        </div>
                                    </PinContainer>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* BOTÃO PRÓXIMO */}
                        <button
                            onClick={() => paginate(1)}
                            className="group hidden md:flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-neutral-900 text-white/70 transition-colors hover:bg-neutral-800 hover:text-white active:scale-95"
                            aria-label="Próximo"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 transition-transform group-hover:translate-x-1"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>
                </div>

                {/* DIREITA: PAINEL CIENTÍFICO (REDESIGN) */}
                <div className="w-full order-2 relative">
                    
                    {/* DESKTOP VIEW: STANDARD SCIENTIFIC PANEL */}
                    <div className="hidden md:flex relative w-full h-[420px] md:h-[380px] rounded-[32px] border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden flex-col">
                        {/* Ambient Background */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-900/40 via-transparent to-transparent pointer-events-none" />

                        {/* Key for AnimatePresence needs to combine Feature AND Methodology to trigger transition */}
                        <AnimatePresence initial={false} mode="wait">
                            <motion.div
                                key={`${activeIndex}-${activeMethodologyIndex}`}
                                variants={contentVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="absolute inset-0 flex flex-col"
                            >
                                {/* HEADER DO PAINEL - Design Mais Compacto */}
                                <div className="px-5 pt-5 pb-2 relative z-10 shrink-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xl font-bold text-white leading-tight">
                                            Metodologia Aplicada
                                        </h4>
                                        <div className="bg-neutral-800/50 px-3 py-1 rounded-full border border-white/10">
                                            <p className="text-[10px] md:text-xs font-bold text-[#FFA11D] uppercase tracking-wide truncate max-w-[150px]">
                                                {activeMethodology.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* CORPO: CARDS (SCROLLÁVEL) - Design de Contraste */}
                                <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 content-start">
                                    
                                    {/* CARD: ANTES (HUMANO) - Visual "Desativado" */}
                                    <div className="bg-neutral-900/40 rounded-xl p-4 border border-white/5 border-dashed flex flex-col relative group h-full">
                                        <div className="flex items-center gap-2 mb-3 opacity-60">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Sem o Socceo</p>
                                        </div>
                                        
                                        <h5 className="text-sm font-medium text-neutral-400 mb-2 leading-snug">
                                            {activeMethodology.humanTitle}
                                        </h5>
                                        
                                        <ul className="space-y-2 mb-3 flex-1">
                                            {activeMethodology.humanPoints.map((point, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-neutral-500">
                                                    <CrossIcon className="w-3 h-3 opacity-50 shrink-0 mt-1" />
                                                    <span className="text-xs md:text-[11px] leading-relaxed">{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-auto pt-3 border-t border-white/5 opacity-70">
                                            <p className="text-[10px] text-red-400/80 font-medium">Resultado: {activeMethodology.humanResult}</p>
                                        </div>
                                    </div>

                                    {/* CARD: DEPOIS (SOCCEO) - Visual "Hero/Ativo" */}
                                    <div 
                                        className="rounded-xl p-4 border flex flex-col relative overflow-hidden group h-full transition-all duration-300 shadow-lg shadow-green-900/5" 
                                        style={{ 
                                            borderColor: `${GREEN_COLOR}30`, // Borda mais sutil
                                            backgroundColor: `${GREEN_COLOR}05` // Fundo quase imperceptível
                                        }}
                                    > 
                                        {/* Brilho Superior */}
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                                        
                                        <div className="flex items-center gap-2 mb-3 relative z-10">
                                            <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse" style={{ backgroundColor: GREEN_COLOR }} />
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-green-400">Com o Socceo</p>
                                        </div>

                                        <h5 className="text-sm font-bold text-white mb-2 leading-snug relative z-10">
                                            {activeMethodology.aiTitle}
                                        </h5>

                                        <ul className="space-y-2 mb-3 flex-1 relative z-10">
                                            {activeMethodology.aiPoints.map((point, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <CheckIcon className="w-3 h-3 shrink-0 mt-1 text-green-400" />
                                                    <span className="text-xs md:text-[11px] text-neutral-200 leading-relaxed font-medium">{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <div className="mt-auto pt-3 border-t border-green-500/20 relative z-10">
                                            <p className="text-[10px] font-bold text-green-400">Resultado: {activeMethodology.aiResult}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* FOOTER: ESTATÍSTICAS E MENU CENTRAL */}
                        <div className="px-5 py-3 bg-[#080808] border-t border-white/5 flex justify-between items-center relative z-20 shrink-0 mt-auto">
                            
                            {/* Stat Esquerda */}
                            <div className="flex flex-col min-w-[80px]">
                                <span className="text-sm font-bold text-white tracking-tight">{activeMethodology.stats[0].value}</span>
                                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">{activeMethodology.stats[0].label}</span>
                            </div>

                            {/* MENU CENTRAL DE METODOLOGIAS (PAGINAÇÃO) */}
                            <div className="flex items-center justify-center gap-1.5 bg-neutral-900/80 px-2 py-1 rounded-full border border-white/5">
                                {activeFeature.methodologies.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveMethodologyIndex(idx)}
                                        className={cn(
                                            "w-5 h-5 flex items-center justify-center text-[9px] font-bold rounded-full transition-all duration-300",
                                            activeMethodologyIndex === idx 
                                                ? "bg-[#FFA11D] text-black shadow-md shadow-[#FFA11D]/20 scale-105" 
                                                : "text-neutral-600 hover:text-neutral-400 hover:bg-white/5"
                                        )}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                {/* Indicador visual de mais itens */}
                                <span className="text-[9px] text-neutral-600 font-bold px-1 select-none tracking-widest">...</span>
                                <span className="text-[9px] text-neutral-500 font-bold pr-1 select-none">+99</span>
                            </div>

                            {/* Stat Direita */}
                            <div className="flex flex-col text-right min-w-[80px]">
                                <span className="text-sm font-bold text-white tracking-tight">{activeMethodology.stats[1].value}</span>
                                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">{activeMethodology.stats[1].label}</span>
                            </div>
                        </div>
                    </div>

                    {/* MOBILE VIEW CONTAINER */}
                    <div className="flex md:hidden flex-col w-full gap-6">
                        
                        {/* 1. CHART + NAV */}
                        <div className="relative w-full h-[350px] flex flex-col items-center justify-center">
                            
                            {/* Mobile Controls Added here - MOVED OUTSIDE AnimatePresence for Z-Index Fix */}
                            {/* Centralized the controls container and limited width to match the card */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-[70] flex justify-between pointer-events-none px-4">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                                    className="pointer-events-auto w-10 h-10 rounded-lg bg-neutral-900/80 border border-white/10 flex items-center justify-center text-white backdrop-blur-sm transition-transform active:scale-90"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); paginate(1); }}
                                    className="pointer-events-auto w-10 h-10 rounded-lg bg-neutral-900/80 border border-white/10 flex items-center justify-center text-white backdrop-blur-sm transition-transform active:scale-90"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex} // Change key to only animate on Category change
                                    variants={contentVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="relative w-full h-full flex flex-col items-center justify-center"
                                >
                                    <PinHoverContent
                                        // Dynamic title: Shows current Feature Name (e.g. Marketing) instead of specific Methodology
                                        title={activeFeature.title} 
                                        isHovered={true}
                                        forceShow={true}
                                        socioColor={ORANGE_COLOR}
                                        chartColor={GREEN_COLOR}
                                        className="scale-110 !opacity-100" 
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                    </div>

                </div>
            </div>
            
            {/* Old Mobile Controls Removed from here */}

            {/* Frameworks Library Section - NOW USING CONTEXT DATA */}
            <motion.div 
                className="mt-0 md:mt-32 w-full max-w-[1280px] px-2 md:px-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="mb-8 border-b border-white/10 pb-4">
                    <h3 className="text-3xl font-bold text-white">Biblioteca de Frameworks</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {frameworks.map((fw, i) => (
                        <div 
                            key={i} 
                            // UPDATED CLICK HANDLER: Open blog at the top instead of specific section
                            onClick={() => handleOpenBlog()} 
                            className="flex flex-col justify-between p-6 md:p-8 rounded-xl border border-white/10 bg-neutral-950 hover:bg-neutral-900 hover:border-white/20 transition-all duration-300 h-full group cursor-pointer"
                        >
                            <div>
                                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#FFA11D] transition-colors">{fw.title}</h4>
                                <p className="text-neutral-400 text-sm leading-relaxed mb-6 group-hover:text-neutral-300 transition-colors">{fw.description}</p>
                            </div>
                            <div className="mt-auto">
                                <button 
                                    className="text-[10px] font-bold text-neutral-400 bg-neutral-900 border border-white/10 px-4 py-2 rounded-lg group-hover:text-[#FFA11D] group-hover:border-[#FFA11D]/20 group-hover:bg-neutral-800 uppercase tracking-widest flex items-center gap-2 transition-all"
                                >
                                    Explore <span>→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Insights Section - NEWLY ADDED & CONNECTED TO CONTEXT */}
            <motion.div 
                className="mt-32 w-full max-w-[1280px] px-2 md:px-6 mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="mb-8 border-b border-white/10 pb-4 flex justify-between items-end">
                    <h3 className="text-3xl font-bold text-white">Insights Recentes</h3>
                    <button 
                        onClick={() => handleOpenBlog()}
                        className="hidden md:flex text-xs font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-widest items-center gap-2"
                    >
                        Ver Todos <span>→</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recentInsights.map((insight, i) => (
                        <div 
                            key={i} 
                            onClick={() => handleOpenBlog(insight)}
                            className="flex flex-col rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden hover:border-white/20 transition-all duration-300 group cursor-pointer h-full"
                        >
                            <div className="h-56 w-full overflow-hidden bg-neutral-900 relative">
                                {insight.image ? (
                                    <img 
                                        src={insight.image} 
                                        alt={insight.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                                        <span className="text-neutral-700">Sem imagem</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                    <span className="text-[10px] font-bold text-[#FFA11D] uppercase tracking-widest">
                                        {insight.tag}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h4 className="text-xl font-bold text-white mb-4 group-hover:text-[#FFA11D] transition-colors leading-tight">
                                    {insight.title}
                                </h4>
                                <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-grow">
                                    {insight.description}
                                </p>
                                <div className="mt-auto pt-4 border-t border-white/5 w-full">
                                    <button 
                                        className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest group-hover:text-[#FFA11D] transition-colors"
                                    >
                                        Ler Mais <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ThirdFold;
