
import React from 'react';
// FIX: Cast motion to `any` to bypass TypeScript errors due to a likely configuration issue.
import { motion as untypedMotion } from "framer-motion";

const motion = untypedMotion as any;

export default function CtaSection() {
  return (
    <section className="py-24 sm:py-32 bg-transparent relative overflow-hidden">
      
      {/* Background is now handled by the parent wrapper in App.tsx for seamless grid */}

      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative isolate overflow-hidden rounded-3xl bg-neutral-950/90 border border-white/20 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16"
        >
          <h2 className="mx-auto max-w-2xl text-4xl font-bold leading-tight sm:text-6xl sm:leading-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Pronto para ser o próximo caso de sucesso?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-neutral-300">
            Faça como eles: garanta seu kit e construa seu próprio agente financeiro em tempo recorde.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-full bg-green-400 px-8 py-3 text-base font-bold text-neutral-900 shadow-sm transition-all duration-300 hover:bg-green-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 active:scale-95"
            >
              Garantir Meu Kit Também
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
