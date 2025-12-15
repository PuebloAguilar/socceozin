
"use client";

import * as React from "react";

type CtaButtonProps = {
  ctaText?: string;
  ctaHref?: string;
  className?: string;
};

export default function CtaButton({
  ctaText = "Browse courses",
  ctaHref = "#",
  className = "",
}: CtaButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Se for um link âncora (começa com #), faz o scroll suave
    if (ctaHref?.startsWith('#')) {
      e.preventDefault();
      const id = ctaHref.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <a href={ctaHref} onClick={handleClick} className={`group block ${className}`}>
      <div className="relative overflow-hidden rounded-full p-[1.5px]">
        {/* Borda girando em conic-gradient laranja (#FFA11D) */}
        <span className="pointer-events-none absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFA11D_0%,#FFC562_50%,#FFA11D_100%)]" />
        {/* Corpo do botão: Este span define o tamanho do botão e não escala mais. */}
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-10 py-4 text-sm font-medium text-white backdrop-blur-3xl">
          {/* Texto do botão: Apenas este span escala, dentro dos limites do pai. */}
          <span className="block font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-95 will-change-transform">
            {ctaText}
          </span>
        </span>
      </div>
    </a>
  );
}
