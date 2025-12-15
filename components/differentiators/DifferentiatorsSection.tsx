
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../header/utils';
import { Plus, Check, X } from 'lucide-react';

const reactiveVsProactive = [
    { negative: "Você pergunta → Ele responde", positive: "Ele alerta → Você age" },
    { negative: "Você analisa → Ele mostra dados do passado", positive: "Ele prevê o futuro → Você ajusta" },
    { negative: "Você descobre → Ele confirma (tarde demais)", positive: "Ele identifica → Você decide (antes do problema)" },
    { negative: "Você trabalha PARA a ferramenta", positive: "A ferramenta trabalha PARA você" }
];

export default function DifferentiatorsSection() {
    return (
      <section className="relative w-full pt-0 pb-12 sm:pb-24 bg-black overflow-hidden">
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* --- BLOCO 1: A ARMADILHA --- */}
          <motion.div 
              className="text-center max-w-4xl mx-auto mt-10" 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              POR QUE SOMOS DIFERENTES
            </h2>
            <p className="text-base font-bold text-neutral-400 uppercase tracking-[0.2em] mb-6">
                A ARMADILHA DAS FERRAMENTAS TRADICIONAIS
            </p>
            <p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-3xl mx-auto mb-12">
              Enquanto todo mundo constrói ferramentas que esperam comandos e organizam o passado: você gasta horas categorizando o que já aconteceu, mas continua sem saber o que vem pela frente.
            </p>
          </motion.div>

          {/* --- BLOCO 2: INVERSÃO DO JOGO (REATIVO VS PROATIVO) --- */}
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
          >
             <div className="bg-neutral-900/40 rounded-3xl border border-white/10 p-8 md:p-12 backdrop-blur-sm">
                <div className="text-center mb-10">
                    <h3 className="text-3xl font-bold text-white mb-4">Nós invertemos o jogo</h3>
                    <p className="text-neutral-400 max-w-2xl mx-auto">
                        Criamos um sistema unificado para que, <strong>NO DIA DE HOJE</strong>, você observe o <strong>FUTURO</strong> com previsibilidade e consiga tomar as <strong>MELHORES DECISÕES</strong> baseadas em dados e métricas reais, como as melhores consultorias de negócios do mundo fazem.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
                    {/* Divisor Vertical Desktop */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    
                    {/* Coluna Tradicional */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-2 mb-6">
                             <div className="w-2 h-2 rounded-full bg-red-500" />
                             <span className="text-sm font-bold uppercase tracking-widest text-red-400">Sistemas Tradicionais: Reativos</span>
                        </div>
                        {reactiveVsProactive.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                                <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-neutral-400 font-medium">{item.negative}</p>
                            </div>
                        ))}
                    </div>

                    {/* Coluna Sócio */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-2 mb-6">
                             <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                             <span className="text-sm font-bold uppercase tracking-widest text-green-400">Socceo: Proativo</span>
                        </div>
                        {reactiveVsProactive.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/10 shadow-[0_0_30px_-15px_rgba(34,197,94,0.1)]">
                                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <p className="text-white font-bold">{item.positive}</p>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
          </motion.div>
          
        </div>
      </section>
    );
};
