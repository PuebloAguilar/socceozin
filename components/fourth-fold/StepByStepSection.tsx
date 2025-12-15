
import React from 'react';
// FIX: Cast motion to `any` to bypass TypeScript errors due to a likely configuration issue.
import { motion as untypedMotion } from "framer-motion";
import { Spotlight } from '../ui/spotlight-new';
import { cn } from '../header/utils';

const motion = untypedMotion as any;


// Data for the steps
const features = [
  {
    step: '01',
    title: 'Registre do Seu Jeito',
    description: 'Envie texto, áudio ou foto no WhatsApp. Para registrar uma despesa, receita, tarefa, reunião ou anotação estratégica, basta enviar uma mensagem. Fale naturalmente como se estivesse conversando com seu Socceo: "Sócio, paguei R$ 2.500 de anúncios no Meta hoje", "Reunião com investidor sexta 15h" ou "Cliente X fechou contrato de R$ 15k". Simples assim.',
    checklist: [
      'Texto rápido — digite como você pensa, sem fórmulas',
      'Áudio natural — fale enquanto dirige, caminha ou trabalha',
      'Foto instantânea — tire foto de nota fiscal ou documento',
    ],
    imagePlaceholder: 'Interface do WhatsApp mostrando registros via texto, áudio e foto.',
  },
  {
    step: '02',
    title: 'O Socceo Processa Tudo',
    description: 'No mesmo instante, a inteligência artificial conecta finanças + vendas + agenda + operação em tempo real. Categoriza despesas, atualiza pipeline comercial, agenda follow-ups, identifica padrões de receita, detecta gargalos operacionais e cruza dados entre áreas — entregando insights prontos para ação.',
    checklist: [
      'Categorização automática — cada registro vai para o lugar certo',
      'Integração total — finanças, vendas, agenda e operação conversam entre si',
      'Análise inteligente — identifica padrões, gargalos e oportunidades',
    ],
    imagePlaceholder: 'Processamento de dados conectando finanças, vendas e agenda.',
  },
  {
    step: '03',
    title: 'Você Tem Controle Total',
    description: 'Dashboard executivo atualizado em tempo real. Seu painel responde às perguntas críticas: "Onde está o gargalo?", "Qual canal de vendas dá mais retorno?", "Qual projeto está atrasado?", "Estou no caminho da meta?". Métricas ao vivo de finanças, vendas e operação, alertas inteligentes e relatórios executivos — tudo na palma da mão.',
    checklist: [
      'Visão 360° — finanças, vendas, operação e agenda em um único lugar',
      'Alertas inteligentes — notificações de prazos, metas e oportunidades críticas',
      'Decisões rápidas — relatórios executivos gerados em 30 segundos',
    ],
    imagePlaceholder: 'Dashboard executivo com métricas em tempo real e alertas.',
  },
];

// Reusable components for styling
const CheckIcon = () => (
  <svg className="h-6 w-6 text-[#FFA11D] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ImagePlaceholder = ({ text, className }: { text: string; className?: string }) => (
  <div className={cn("aspect-[4/3] w-full rounded-2xl border-2 border-dashed border-white/20 bg-neutral-900 flex items-center justify-center p-8 shadow-inner", className)}>
      <p className="text-center text-neutral-400">{text}</p>
  </div>
);


// Main component
export default function StepByStepSection() {
    const sectionVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.6, // Aumentado para garantir que cada item apareça separadamente
                delayChildren: 0.2
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8, 
                ease: "easeOut",
            },
        },
    };

  return (
    <section 
        className="relative w-full py-16 sm:py-20 overflow-hidden bg-black"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
                className="text-center relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
                 <h2 className="text-4xl font-bold leading-tight sm:text-6xl sm:leading-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                    Sua Operação com Ester*ides
                </h2>
                <p className="mt-4 text-xl md:text-2xl font-medium text-neutral-200 max-w-4xl mx-auto leading-relaxed">
                    Cada recurso foi desenhado para eliminar complexidade e injetar potência estratégica na sua rotina. Não é ferramenta — é o Sócio perfeito: pensa como Harvard, age como McKinsey e monitora como JP Morgan, liberando você para o único trabalho que importa: decisões que multiplicam resultados e crescimento que não para.
                </p>
            </motion.div>

            <motion.div 
                className="mt-16 flex flex-col gap-y-16 md:gap-y-20"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }} // Margem ajustada para disparar a animação
            >
                {features.map((feature, index) => (
                    <motion.div key={feature.title} variants={itemVariants} className="relative">
                        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
                            <div className={cn(
                                "flex flex-col items-start text-left",
                                index % 2 === 0 && "md:order-last"
                            )}>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFA11D]/10 border border-[#FFA11D]/30 text-xl font-bold text-[#FFA11D]">
                                        {feature.step}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                                        {feature.title}
                                    </h3>
                                </div>
                                <p className="mt-4 text-neutral-300">
                                    {feature.description}
                                </p>
                                <ul className="mt-6 space-y-4">
                                    {feature.checklist.map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <CheckIcon />
                                            <span className="text-neutral-200">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <ImagePlaceholder text={feature.imagePlaceholder} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
  );
}
