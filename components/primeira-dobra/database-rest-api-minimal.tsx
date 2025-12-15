
"use client";

import React, { useEffect } from "react";

type Props = {
  lightColor?: string; // cor da “luz” da animação (hex ou rgb)
  buttonLabels?: [string, string, string, string, string, string];
};

const STYLE_ID = "db-rest-api-anim";

export default function DatabaseRestApiMinimal({
  lightColor = "#FFA11D",
  // Atualizado para incluir VENDAS e LIDERANÇA
  buttonLabels = ["MARKETING", "VENDAS", "NEGOCIAÇÃO", "GESTÃO", "FINANÇAS", "LIDERANÇA"],
}: Props) {
  // Inject CSS for animations
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    // Cálculos de paths ajustados para convergir ao centro (x=150) em um viewBox de 300
    style.innerHTML = `
      @keyframes db-light-anim {
        from { offset-distance: 0%; }
        to   { offset-distance: 100%; }
      }
      #db-light-1 {
        offset-path: path("M 25 10 v 10 q 0 5 5 5 h 115 q 5 0 5 5 v 10");
        animation: db-light-anim 3s linear infinite;
      }
      #db-light-2 {
        offset-path: path("M 75 10 v 10 q 0 5 5 5 h 65 q 5 0 5 5 v 10");
        animation: db-light-anim 3s linear 0.15s infinite;
      }
      #db-light-3 {
        offset-path: path("M 125 10 v 10 q 0 5 5 5 h 15 q 5 0 5 5 v 10");
        animation: db-light-anim 3s linear 0.3s infinite;
      }
      #db-light-4 {
        offset-path: path("M 175 10 v 10 q 0 5 -5 5 h -15 q -5 0 -5 5 v 10");
        animation: db-light-anim 3s linear 0.45s infinite;
      }
      #db-light-5 {
        offset-path: path("M 225 10 v 10 q 0 5 -5 5 h -65 q -5 0 -5 5 v 10");
        animation: db-light-anim 3s linear 0.6s infinite;
      }
      #db-light-6 {
        offset-path: path("M 275 10 v 10 q 0 5 -5 5 h -115 q -5 0 -5 5 v 10");
        animation: db-light-anim 3s linear 0.75s infinite;
      }
      @keyframes db-draw-line {
        from { stroke-dashoffset: 100; }
        to { stroke-dashoffset: 0; }
      }
      #db-line-1 { animation: db-draw-line 1s cubic-bezier(0.25, 0.1, 0.5, 1) forwards; }
      #db-line-2 { animation: db-draw-line 1s cubic-bezier(0.25, 0.1, 0.5, 1) 0.1s forwards; }
      #db-line-3 { animation: db-draw-line 1s cubic-bezier(0.25, 0.1, 0.5, 1) 0.2s forwards; }
      #db-line-4 { animation: db-draw-line 1s cubic-bezier(0.25, 0.1, 0.5, 1) 0.3s forwards; }
      #db-line-5 { animation: db-draw-line 1s cubic-bezier(0.25, 0.1, 0.5, 1) 0.4s forwards; }
      #db-line-6 { animation: db-draw-line 1s cubic-bezier(0.25, 0.1, 0.5, 1) 0.5s forwards; }
      
      /* Animação para o tronco central */
      #db-trunk { animation: db-draw-line 1s cubic-bezier(0.25, 0.1, 0.5, 1) 0.4s forwards; }

      /* Animação para a linha física de conexão (HTML div) */
      @keyframes connector-grow {
        from { transform: translateX(-50%) scaleY(0); opacity: 0; }
        to { transform: translateX(-50%) scaleY(1); opacity: 1; }
      }

      .db-button-group {
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  return (
    // Aumentei o max-w para acomodar os 6 itens confortavelmente
    <div className="relative flex h-[100px] w-full max-w-[750px] flex-col items-center">
      {/* --- SVG: ViewBox expandido para 300 de largura --- */}
      {/* CORRIGIDO: text-[#4C4C4C] (Sólido) equivale visualmente a border-white/30 em fundo preto */}
      <svg
        className="h-full w-full text-[#4C4C4C]"
        viewBox="0 0 300 60"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        preserveAspectRatio="xMidYMax meet"
      >
        {/* ====== Definições reutilizáveis ====== */}
        <defs>
          {/* Caminhos das 6 trilhas convergindo para o centro (x=150) */}
          <path id="route1" d="M 25 10 v 10 q 0 5 5 5 h 115 q 5 0 5 5 v 10" />
          <path id="route2" d="M 75 10 v 10 q 0 5 5 5 h 65 q 5 0 5 5 v 10" />
          <path id="route3" d="M 125 10 v 10 q 0 5 5 5 h 15 q 5 0 5 5 v 10" />
          <path id="route4" d="M 175 10 v 10 q 0 5 -5 5 h -15 q -5 0 -5 5 v 10" />
          <path id="route5" d="M 225 10 v 10 q 0 5 -5 5 h -65 q -5 0 -5 5 v 10" />
          <path id="route6" d="M 275 10 v 10 q 0 5 -5 5 h -115 q -5 0 -5 5 v 10" />

          {/* Máscaras p/ limitar a luz ao traço - Revertido para 0.8 (fino) */}
          <mask id="db-mask-1"><use href="#route1" stroke="white" strokeWidth="0.8" fill="none" /></mask>
          <mask id="db-mask-2"><use href="#route2" stroke="white" strokeWidth="0.8" fill="none" /></mask>
          <mask id="db-mask-3"><use href="#route3" stroke="white" strokeWidth="0.8" fill="none" /></mask>
          <mask id="db-mask-4"><use href="#route4" stroke="white" strokeWidth="0.8" fill="none" /></mask>
          <mask id="db-mask-5"><use href="#route5" stroke="white" strokeWidth="0.8" fill="none" /></mask>
          <mask id="db-mask-6"><use href="#route6" stroke="white" strokeWidth="0.8" fill="none" /></mask>

          {/* Gradiente da “luz” */}
          <radialGradient id="db-blue-grad" fx="1">
            <stop offset="0%" stopColor={lightColor} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* ====== Traços visíveis (com animação de desenhar) - Revertido para 0.6 (fino) ====== */}
        <g
          stroke="currentColor"
          fill="none"
          strokeWidth="0.6"
          strokeDasharray="100 100"
          pathLength={100}
        >
          <use id="db-line-1" href="#route1" />
          <use id="db-line-2" href="#route2" />
          <use id="db-line-3" href="#route3" />
          <use id="db-line-4" href="#route4" />
          <use id="db-line-5" href="#route5" />
          <use id="db-line-6" href="#route6" />
        </g>

        {/* ====== TRONCO CENTRAL MAIS GROSSO ====== */}
        {/* Adicionado manualmente para criar a espessura solicitada apenas na conexão final */}
        <path 
          id="db-trunk"
          d="M 150 30 V 60" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          fill="none"
          strokeDasharray="100 100"
          pathLength={100}
          className="opacity-0" // Inicia invisível e a animação revela
        />
        
        {/* ====== “Luzes” se movendo pelas trilhas (CSS animation) ====== */}
        <g mask="url(#db-mask-1)"><circle id="db-light-1" r="10" fill="url(#db-blue-grad)" /></g>
        <g mask="url(#db-mask-2)"><circle id="db-light-2" r="10" fill="url(#db-blue-grad)" /></g>
        <g mask="url(#db-mask-3)"><circle id="db-light-3" r="10" fill="url(#db-blue-grad)" /></g>
        <g mask="url(#db-mask-4)"><circle id="db-light-4" r="10" fill="url(#db-blue-grad)" /></g>
        <g mask="url(#db-mask-5)"><circle id="db-light-5" r="10" fill="url(#db-blue-grad)" /></g>
        <g mask="url(#db-mask-6)"><circle id="db-light-6" r="10" fill="url(#db-blue-grad)" /></g>

        {/* ====== Botões (posicionados a cada 50px começando em 25) ====== */}
        <g stroke="currentColor" fill="none" strokeWidth="0.4">
          {/* Botão 1 - 25 */}
          <g className="db-button-group">
            <rect fill="#18181B" x="2.5" y="4" width="45" height="12" rx="5"></rect>
            <DatabaseIcon x="6.5" y="7.5" />
            <text x="29.5" y="10" textAnchor="middle" dominantBaseline="middle" fill="white" stroke="none" fontSize="4.5" fontWeight="500">
              {buttonLabels[0]}
            </text>
          </g>

          {/* Botão 2 - 75 */}
          <g className="db-button-group">
            <rect fill="#18181B" x="52.5" y="4" width="45" height="12" rx="5"></rect>
            <DatabaseIcon x="56.5" y="7.5" />
            <text x="79.5" y="10" textAnchor="middle" dominantBaseline="middle" fill="white" stroke="none" fontSize="4.5" fontWeight="500">
              {buttonLabels[1]}
            </text>
          </g>

          {/* Botão 3 - 125 */}
          <g className="db-button-group">
            <rect fill="#18181B" x="102.5" y="4" width="45" height="12" rx="5"></rect>
            <DatabaseIcon x="106.5" y="7.5" />
            <text x="129.5" y="10" textAnchor="middle" dominantBaseline="middle" fill="white" stroke="none" fontSize="4.5" fontWeight="500">
              {buttonLabels[2]}
            </text>
          </g>

          {/* Botão 4 - 175 */}
          <g className="db-button-group">
            <rect fill="#18181B" x="152.5" y="4" width="45" height="12" rx="5"></rect>
            <DatabaseIcon x="156.5" y="7.5" />
            <text x="179.5" y="10" textAnchor="middle" dominantBaseline="middle" fill="white" stroke="none" fontSize="4.5" fontWeight="500">
              {buttonLabels[3]}
            </text>
          </g>

          {/* Botão 5 - 225 */}
          <g className="db-button-group">
            <rect fill="#18181B" x="202.5" y="4" width="45" height="12" rx="5"></rect>
            <DatabaseIcon x="206.5" y="7.5" />
            <text x="229.5" y="10" textAnchor="middle" dominantBaseline="middle" fill="white" stroke="none" fontSize="4.5" fontWeight="500">
              {buttonLabels[4]}
            </text>
          </g>

          {/* Botão 6 - 275 */}
          <g className="db-button-group">
            <rect fill="#18181B" x="252.5" y="4" width="45" height="12" rx="5"></rect>
            <DatabaseIcon x="256.5" y="7.5" />
            <text x="279.5" y="10" textAnchor="middle" dominantBaseline="middle" fill="white" stroke="none" fontSize="4.5" fontWeight="500">
              {buttonLabels[5]}
            </text>
          </g>
        </g>
      </svg>

      {/* 
        Linha de conexão física (HTML) 
        Garante que, independente da escala do SVG, haja uma linha saindo do fundo 
        do componente para conectar com o badge abaixo.
      */}
      <div 
        className="absolute bottom-0 left-1/2 w-[1.5px] bg-[#4C4C4C] origin-top z-0"
        style={{
            height: '40px', // Estende para fora do container para cruzar o margin-top negativo do próximo elemento
            animation: 'connector-grow 0.6s cubic-bezier(0.25, 0.1, 0.5, 1) 0.8s forwards',
            opacity: 0,
            transform: 'translateX(-50%) scaleY(0)' // Inicia colapsado
        }}
      />
    </div>
  );
}

/* Ícone minúsculo do "banco" usado nos botões (mesmo do seu código, sem dependências externas) */
function DatabaseIcon({ x = "0", y = "0" }: { x?: string; y?: string }) {
  return (
    <svg
      x={x}
      y={y}
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
