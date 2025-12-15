
import React from 'react';
import { cn } from '../header/utils';
import { TestimonialCard, TestimonialAuthor } from './TestimonialCard';
// FIX: Cast motion to `any` to bypass TypeScript errors due to a likely configuration issue.
import { motion as untypedMotion } from "framer-motion";

const motion = untypedMotion as any;

const testimonials: Array<{
  author: TestimonialAuthor;
  text: string;
  href?: string;
}> = [
  {
    author: {
      name: 'Roberto Viana',
      title: 'CFO',
      company: 'Grupo Nexus',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&auto=format&fit=crop',
    },
    text: 'Apresentar dados para o conselho levava dias. Com o Socceo, gero relatórios de fluxo de caixa e DRE auditáveis em segundos pelo WhatsApp.',
  },
  {
    author: {
      name: 'Claudia Stern',
      title: 'CEO',
      company: 'Stern Capital',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=200&h=200&auto=format&fit=crop',
    },
    text: 'Eliminei o "achismo" das reuniões de diretoria. O Socceo cruza nossos dados de vendas com custos operacionais em tempo real. Decisões cirúrgicas.',
  },
  {
    author: {
      name: 'Marcelo Diniz',
      title: 'Fundador',
      company: 'Logística Ágil',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop',
    },
    text: 'Minha operação rodava no caos. Agora, registro ocorrências por áudio dirigindo e o sistema já delega para a equipe e atualiza o cliente.',
  },
  {
    author: {
      name: 'Patricia Lins',
      title: 'Diretora Comercial',
      company: 'Vangarda Tech',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop',
    },
    text: 'O Socceo monitora meu pipeline 24/7. Ele me avisa qual lead está esfriando e sugere a abordagem exata para fechar. É meu braço direito.',
  },
  {
    author: {
      name: 'André Farias',
      title: 'Sócio-Diretor',
      company: 'Farias & Associados',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&h=200&auto=format&fit=crop',
    },
    text: 'Centralizei 4 ferramentas caras em um único chat. Contratos, agenda e financeiro conversam entre si. A clareza mental que isso traz não tem preço.',
  },
   {
    author: {
      name: 'Juliana Melo',
      title: 'Head de Growth',
      company: 'ScaleUp Brasil',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=format&fit=crop',
    },
    text: 'Identifiquei que meu CAC estava subindo 3 dias antes do normal graças aos alertas. Corrigi a rota da campanha e salvei o mês.',
  },
];


export default function FourthFold() {
  return (
    <section 
      id="impacto-real"
      className={cn(
      "text-white relative overflow-hidden",
      "py-24 sm:py-32",
      "bg-transparent" // Transparent to let the parent's seamless grid show
    )}>
      
      {/* --- BACKGROUND LAYERS --- */}
      {/* Spotlight Removed */}

      {/* 3. Smooth Gradient Transition (Top Only) */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black to-transparent z-0 pointer-events-none" />
      
      <div className="flex flex-col items-center gap-12 text-center relative z-10 w-full">
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4 sm:gap-6 px-4"
        >
          <h2 className="max-w-4xl text-4xl font-bold leading-tight sm:text-6xl sm:leading-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Veja o impacto real na rotina de líderes que não aceitam a média.
          </h2>
        </motion.div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mt-8">
            {/* 
                TRUE INFINITE LOOP MARQUEE
                Using two identical tracks side-by-side that move left.
            */}
            <div className="group flex w-full overflow-hidden [--gap:2rem] select-none">
              
              {/* Track 1 */}
              <div
                className="flex min-w-full shrink-0 animate-marquee items-center gap-[var(--gap)] group-hover:[animation-play-state:paused] px-[calc(var(--gap)/2)]"
                style={{ '--duration': '40s' } as React.CSSProperties}
              >
                {testimonials.map((testimonial, i) => (
                  <TestimonialCard key={`A-${i}`} {...testimonial} />
                ))}
              </div>

              {/* Track 2 (Duplicate) */}
              <div
                className="flex min-w-full shrink-0 animate-marquee items-center gap-[var(--gap)] group-hover:[animation-play-state:paused] px-[calc(var(--gap)/2)]"
                style={{ '--duration': '40s' } as React.CSSProperties}
                aria-hidden="true"
              >
                {testimonials.map((testimonial, i) => (
                  <TestimonialCard key={`B-${i}`} {...testimonial} />
                ))}
              </div>
              
            </div>

          {/* Side Fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-black to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-black to-transparent z-20" />
        </div>
      </div>
    </section>
  );
}
