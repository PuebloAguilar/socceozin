
import React from 'react';
import { Spotlight } from '../ui/spotlight-new';
import CtaButton from '../primeira-dobra/cta-button';
import { Button } from '../header/ui/Button';
import { PinContainer } from '../third-fold/PinContainer';
import { BarChart } from '../header/ui/Icons';

const colors = [
    { name: 'Fundo Principal', hex: '#000000', className: 'bg-black' },
    { name: 'Fundo Secundário', hex: '#101112', className: 'bg-[#101112]' },
    { name: 'Painel/Card', hex: '#18181B', className: 'bg-neutral-900' },
    { name: 'Destaque (Ciano)', hex: '#0ea5e9', className: 'bg-sky-500' },
    { name: 'Texto Principal', hex: '#F5F5F5', className: 'bg-neutral-100' },
    { name: 'Texto Secundário', hex: '#A3A3A3', className: 'bg-neutral-400' },
];

const StyleGuideSection: React.FC = () => {
    return (
        <section className="relative w-full py-24 sm:py-32 overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Spotlight />
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold leading-tight sm:text-6xl sm:leading-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                        Guia de Estilo Visual
                    </h2>
                    <p className="mt-4 text-md max-w-3xl mx-auto font-normal text-neutral-300 sm:text-lg">
                        Um resumo dos padrões visuais para garantir consistência na construção de novas funcionalidades e telas do Socceo.
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Paleta de Cores */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6 text-center">Paleta de Cores</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {colors.map((color) => (
                                <div key={color.name} className="flex flex-col items-center">
                                    <div className={`h-24 w-24 rounded-lg border border-white/20 ${color.className}`} />
                                    <p className="mt-3 font-semibold text-white">{color.name}</p>
                                    <p className="text-sm text-neutral-400 font-mono">{color.hex}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tipografia */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-8 text-center">Tipografia</h3>
                        <div className="p-8 rounded-xl border border-white/20 bg-neutral-950/70 space-y-6">
                            <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                                Título Principal (H1)
                            </h1>
                             <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                                Título de Seção (H2)
                            </h2>
                            <h3 className="text-2xl font-bold text-white">Subtítulo (H3)</h3>
                            <p className="text-base text-neutral-300">
                                Este é um parágrafo de texto padrão. Ele é usado para descrições e conteúdos mais longos. O Sócio opera direto no seu WhatsApp como um cérebro estratégico paralelo, unindo ciência, estratégia e execução em um sistema integrado.
                            </p>
                             <p className="text-sm text-neutral-400">
                                Este é um texto secundário ou de suporte, um pouco menor e com menos destaque, ideal para legendas ou informações complementares.
                            </p>
                        </div>
                    </div>

                    {/* Componentes */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-8 text-center">Componentes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            {/* Botões */}
                            <div className="p-8 rounded-xl border border-white/20 bg-neutral-950/70 space-y-6 flex flex-col items-center">
                                <h4 className="text-xl font-semibold text-white">Botões</h4>
                                <CtaButton ctaText="BOTÃO PRIMÁRIO" />
                                <Button variant="outline">Botão Secundário</Button>
                                 <div className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/30 bg-neutral-900 text-white/70 transition-colors hover:bg-neutral-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </div>
                            </div>

                            {/* Cards e Painéis */}
                             <div className="p-8 rounded-xl border border-white/20 bg-neutral-950/70 space-y-4">
                                <h4 className="text-xl font-semibold text-white text-center">Painéis</h4>
                                <div className="rounded-xl border border-white/30 bg-neutral-950 p-6">
                                    <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">Exemplo de Painel</p>
                                    <h3 className="mt-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-300">
                                        Estrutura Padrão
                                    </h3>
                                    <p className="mt-4 text-base text-neutral-300">
                                       Painéis usam bordas sutis, fundo escuro e tipografia clara para criar hierarquia e foco no conteúdo.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Componente Interativo */}
                            <div className="md:col-span-2 p-8 rounded-xl border border-white/20 bg-neutral-950/70 flex flex-col items-center justify-center min-h-[30rem]">
                                 <h4 className="text-xl font-semibold text-white text-center mb-8">Componente Interativo (Pin)</h4>
                                 <PinContainer title="Marketing" href="#">
                                    <div className="flex flex-col p-4 w-60 h-60 md:w-40 md:h-48 lg:w-56 lg:h-56">
                                        <div className="flex-shrink-0">
                                          <BarChart className="text-white/75 size-6 mb-2" strokeWidth={1.5} aria-hidden />
                                          <h3 className="text-base font-bold text-white">Exemplo de Pin</h3>
                                        </div>
                                        <p className="text-neutral-400 mt-2 text-sm font-normal flex-grow">
                                            Este é um exemplo do componente 'Pin' que revela conteúdo adicional e animações ao passar o mouse.
                                        </p>
                                    </div>
                                </PinContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StyleGuideSection;
