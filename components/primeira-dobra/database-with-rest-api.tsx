
import React, { useEffect, useMemo, useState } from "react";

/**
 * StrategyExecutionPanel
 * — Minimal, extracted panel showing only Strategy / Execution content
 *   with its own self-contained animations.
 *
 * TailwindCSS required. Assumes dark mode.
 */

const STYLE_ID = "strategy-execution-anim";

export default function StrategyExecutionPanel({
  defaultMode = "science" as "science" | "strategy" | "execution" | "gestao",
}: {
  defaultMode?: "science" | "strategy" | "execution" | "gestao";
}) {
  const [mode, setMode] = useState<"science" | "strategy" | "execution" | "gestao">(defaultMode);
  const [userInteracted, setUserInteracted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [shadowVisible, setShadowVisible] = useState(false);

  // Inject keyframes used here only
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.innerHTML = `
      /* === EXACT keyframes from original === */
      @keyframes hero3-intro {
        0% { opacity: 0; transform: translate3d(0, 64px, 0) scale(0.98); filter: blur(12px); }
        60% { filter: blur(0); }
        100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
      }
      @keyframes hero3-card {
        0% { opacity: 0; transform: translate3d(0, 32px, 0) scale(0.95); }
        100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
      }
      @keyframes hero3-orbit {
        0% { stroke-dashoffset: 0; transform: rotate(0deg); }
        100% { stroke-dashoffset: -64; transform: rotate(360deg); }
      }
      @keyframes hero3-grid {
        0%, 100% { transform: rotate(-2deg); opacity: 0.7; }
        50% { transform: rotate(2deg); opacity: 1; }
      }
      @keyframes hero3-pulse {
        0%, 100% { stroke-dasharray: 0 200; opacity: 0.2; }
        45%, 60% { stroke-dasharray: 200 0; opacity: 1; }
      }
      @keyframes content-fade-in-up {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, []);
  
  // Auto-switch modes until user interacts
  useEffect(() => {
    if (userInteracted) {
      return;
    }
    const timer = setInterval(() => {
      setMode((prevMode) => {
        if (prevMode === "science") return "strategy";
        if (prevMode === "strategy") return "execution";
        if (prevMode === "execution") return "gestao";
        return "science";
      });
    }, 8500); // Switch every 8.5 seconds

    return () => clearInterval(timer);
  }, [userInteracted]);


  // Reveal on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  // Trigger shadow after intro animation
  useEffect(() => {
    if (visible) {
      const shadowTimer = setTimeout(() => {
        setShadowVisible(true);
      }, 1000); // 1s animation duration for hero3-intro
      return () => clearTimeout(shadowTimer);
    }
  }, [visible]);

  const palette = useMemo(
    () => ({
      subtle: "text-white/60",
      border: "border-white/30",
      card: "bg-neutral-950",
      accent: "bg-neutral-900",
    }),
    []
  );

  const modes = useMemo(
    () => ({
      science: {
        title: "CIÊNCIA APLICADA",
        description:
          "O Socceo foi treinado com frameworks absorvidos de consultorias milionárias. Cada ação vem de quem já dominou o mercado.",
        items: [
          "Decisões baseadas em evidências;",
          "Acesso ao processo dos melhores;",
          "Use o pensamento da elite a seu favor.",
        ],
      },
      strategy: {
        title: "ESTRATÉGIA NEXIALISTA",
        description:
          "O Socceo vê negócios como sistemas vivos. Ele entende variáveis, antecipa falhas e constrói poder antes da necessidade.",
        items: [
          "Substitua improviso por engenharia;",
          "Cada insight vira um sistema;",
          "Toda ação vira venda.",
        ],
      },
      execution: {
        title: "LOOPING DE EXECUÇÃO",
        description:
          "O Socceo sabe que não existe momento certo. Cada movimento é calibrado até transformar ritmo em resultado.",
        items: [
          "Não espere recursos, crie recursos;",
          "Tolerância zero à estagnação;",
          "Construa impérios com o que tem hoje.",
        ],
      },
      gestao: {
        title: "SISTEMA DE CONTROLE",
        description:
          "O Socceo organiza sua gestão financeira com inteligência. Mostra, prevê e ajusta tudo em tempo real.",
        items: [
          "Organize seu financeiro sem planilhas;",
          "Monitore cada centavo com inteligência;",
          "Receba relatórios e alertas em tempo real.",
        ],
      },
    }),
    []
  );

  const active = modes[mode];

  return (
    <section
      className="relative w-full text-white"
      style={{
        animation: visible ? "hero3-intro 1s cubic-bezier(.22,.68,0,1) forwards" : undefined,
      }}
    >
      {/* FADING SHELL with background, border, and shadow */}
      <div
        className={`absolute inset-0 rounded-[24px] border ${palette.border} bg-black ${
          shadowVisible ? "shadow-[0_0_2rem_rgba(255,255,255,0.15)] transition-shadow ease-in-out duration-1000" : ""
        }`}
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 85%)",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 85%)",
        }}
        aria-hidden="true"
      />
      {/* NON-FADING CONTENT */}
      <div className={`relative`}>
        <div className="mx-auto grid max-w-5xl gap-6 p-6 sm:p-8 md:p-10">
          <div
            className={`rounded-3xl border ${palette.border} ${palette.card} p-6 md:p-8`}
            style={{ animation: "hero3-card 0.8s ease 0.05s both" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.35em] opacity-70">Modo</p>
                <h2
                  key={mode + "-title"}
                  className="text-lg md:text-2xl font-semibold tracking-tight"
                  style={{ animation: "content-fade-in-up 0.5s ease-out" }}
                >
                  {active.title}
                </h2>
              </div>

              {/* Right-side animated indicator */}
              {(() => {
                const stroke = "#f5f5f5";
                const fill = "rgba(255,255,255,0.08)";
                return (
                  <span aria-hidden className="relative inline-flex h-16 w-16 items-center justify-center">
                    <svg viewBox="0 0 120 120" className="h-16 w-16" aria-hidden>
                      <circle
                        cx="60" cy="60" r="46"
                        fill="none"
                        stroke={stroke}
                        strokeWidth="1.4"
                        style={{ strokeDasharray: '18 14', animation: 'hero3-orbit 8.5s linear infinite' }}
                      />
                      <rect
                        x="34" y="34" width="52" height="52" rx="14"
                        fill={fill}
                        stroke={stroke}
                        strokeWidth="1.2"
                        style={{ animation: 'hero3-grid 5.4s ease-in-out infinite', transformOrigin: '60px 60px' }}
                      />
                      <circle cx="60" cy="60" r="7" fill={stroke} />
                      <path
                        d="M60 30v10M60 80v10M30 60h10M80 60h10"
                        stroke={stroke}
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        style={{ animation: 'hero3-pulse 6s ease-in-out infinite' }}
                      />
                    </svg>
                  </span>
                );
              })()}
            </div>

            <p
              key={mode + "-desc"}
              className={`mt-0 text-sm md:text-base leading-relaxed ${palette.subtle}`}
              style={{ animation: "content-fade-in-up 0.5s ease-out" }}
            >
              {active.description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                type="button"
                onMouseEnter={() => {
                  setMode("science");
                  setUserInteracted(true);
                }}
                onClick={() => {
                  setMode("science");
                  setUserInteracted(true);
                }}
                className={`rounded-full border ${palette.border} px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.35em] transition hover:scale-105 active:scale-95 ${
                  mode === "science"
                    ? "bg-white/90 text-black"
                    : `${palette.accent}`
                }`}
              >
                Ciência
              </button>
              <button
                type="button"
                onMouseEnter={() => {
                  setMode("strategy");
                  setUserInteracted(true);
                }}
                onClick={() => {
                  setMode("strategy");
                  setUserInteracted(true);
                }}
                className={`rounded-full border ${palette.border} px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.35em] transition hover:scale-105 active:scale-95 ${
                  mode === "strategy"
                    ? "bg-white/90 text-black"
                    : `${palette.accent}`
                }`}
              >
                Estratégia
              </button>
              <button
                type="button"
                onMouseEnter={() => {
                  setMode("execution");
                  setUserInteracted(true);
                }}
                onClick={() => {
                  setMode("execution");
                  setUserInteracted(true);
                }}
                className={`rounded-full border ${palette.border} px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.35em] transition hover:scale-105 active:scale-95 ${
                  mode === "execution"
                    ? "bg-white/90 text-black"
                    : `${palette.accent}`
                }`}
              >
                Execução
              </button>
              <button
                type="button"
                onMouseEnter={() => {
                  setMode("gestao");
                  setUserInteracted(true);
                }}
                onClick={() => {
                  setMode("gestao");
                  setUserInteracted(true);
                }}
                className={`rounded-full border ${palette.border} px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.35em] transition hover:scale-105 active:scale-95 ${
                  mode === "gestao"
                    ? "bg-white/90 text-black"
                    : `${palette.accent}`
                }`}
              >
                Gestão
              </button>
            </div>

            <ul
              key={mode + "-list"}
              className="mt-6 space-y-2 text-sm"
              style={{ animation: "content-fade-in-up 0.5s ease-out" }}
            >
              {active.items.map((it) => (
                <li key={it} className={`flex items-start gap-3 ${palette.subtle}`}>
                  <span className="mt-1 h-2 w-2 rounded-full bg-current" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
