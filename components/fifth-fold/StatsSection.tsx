
import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, animate } from "framer-motion";
import { cn } from '../header/utils';

const stats = [
  {
    value: 47,
    suffix: "%",
    prefix: "+",
    label: "Aumento em Receita",
    description: "Média de aumento trimestral para clientes que utilizam o Socceo há mais de 90 dias.",
  },
  {
    value: 12,
    suffix: "h/semana",
    prefix: "-",
    label: "Redução de Tempo",
    description: "Menos tempo em tarefas operacionais, mais foco na estratégia e no crescimento do negócio.",
  },
  {
    value: 3,
    suffix: "x",
    prefix: "",
    label: "Mais Rápido",
    description: "Velocidade na tomada de decisão. Análises complexas agora são feitas em minutos via WhatsApp.",
  },
  {
    value: 92,
    suffix: "%",
    prefix: "",
    label: "Retenção de Clientes",
    description: "Taxa de retenção após 1 ano. O Socceo se torna um parceiro indispensável para a operação.",
  },
];

const AnimatedNumber = ({ to, prefix, suffix }: { to: number; prefix: string; suffix: string; }) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
  
    useEffect(() => {
      if (isInView) {
        controls.start({
            // @ts-ignore
          count: to,
          transition: { duration: 2, ease: "easeOut" },
        });
      }
    }, [isInView, to, controls]);
  
    return (
        <motion.p 
            ref={ref}
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
            // @ts-ignore
            initial={{ count: 0 }}
            animate={controls}
        >
            {prefix}{Math.round(to)}{suffix}
        </motion.p>
    );
};


const AnimatedNumberWrapper = ({ value, prefix, suffix }: { value: number; prefix: string; suffix: string; }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const controls = useAnimation();
    const [displayValue, setDisplayValue] = React.useState(0);

    useEffect(() => {
        if (isInView) {
            controls.start({
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: 'easeOut' }
            });

            const animation = animate(0, value, {
                duration: 2,
                ease: "easeOut",
                onUpdate(latest) {
                    setDisplayValue(Math.round(latest));
                }
            });
            return () => animation.stop();
        }
    }, [isInView, value, controls]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
        >
            {prefix}{displayValue}{suffix}
        </motion.div>
    );
};

// FIX: Explicitly typed the StatCard component with React.FC. This resolves a TypeScript inference issue where props passed during list rendering (like the 'key' prop) caused a type mismatch error.
const StatCard: React.FC<{ stat: typeof stats[0] }> = ({ stat }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/20 bg-neutral-950/80">
      <AnimatedNumberWrapper value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
      <h3 className="mt-4 text-lg font-semibold text-white">{stat.label}</h3>
      <p className="mt-2 text-sm text-neutral-400">{stat.description}</p>
    </div>
  );
};

export default function StatsSection() {
  return (
    <section className="py-24 sm:py-32 bg-black">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h2 className="text-4xl font-bold leading-tight sm:text-6xl sm:leading-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Números que Comprovam
        </h2>
        <p className="mt-4 text-md max-w-2xl mx-auto font-normal text-neutral-300 sm:text-lg">
          O Socceo não é sobre promessas, é sobre performance. Veja o impacto real que estamos gerando em negócios como o seu.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
