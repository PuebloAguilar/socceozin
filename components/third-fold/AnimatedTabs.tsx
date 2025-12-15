
"use client";

import React, { useState } from "react";
// FIX: Cast motion to `any` to bypass TypeScript errors due to a likely configuration issue.
import { motion as untypedMotion, AnimatePresence } from "framer-motion";
import { cn } from '../header/utils';

const motion = untypedMotion as any;

interface Subtask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  subtasks: Subtask[];
}

const planejamentoTasks: Task[] = [
    {
        id: "plan-1", title: "Agenda Sincronizada com Estratégia", description: "", status: "in-progress", priority: "high",
        subtasks: [
            { id: "plan-1.1", title: "Integração completa com Google Agenda e visão centralizada", description: "", status: "completed", priority: "high" },
            { id: "plan-1.2", title: "Alertas estratégicos antes de compromissos relevantes", description: "", status: "in-progress", priority: "medium" },
            { id: "plan-1.3", title: "Eventos conectados a prazos financeiros e prioridades-chave", description: "", status: "pending", priority: "high" },
            { id: "plan-1.4", title: "Garantia de que nenhuma oportunidade escape do radar", description: "", status: "pending", priority: "low" },
        ],
    },
    {
        id: "plan-2", title: "Mapeamento Estratégico de Crescimento", description: "", status: "pending", priority: "high",
        subtasks: [
            { id: "plan-2.1", title: "Análise de contexto e identificação de alavancas reais", description: "", status: "pending", priority: "high" },
            { id: "plan-2.2", title: "Frameworks validados aplicados diretamente ao seu cenário", description: "", status: "pending", priority: "high" },
            { id: "plan-2.3", title: "Rotas traçadas com base em quem já escalou de verdade", description: "", status: "pending", priority: "medium" },
            { id: "plan-2.4", title: "Sistema completo e claro antes da execução começar", description: "", status: "pending", priority: "low" },
        ],
    },
    {
        id: "plan-3", title: "Preparação Inteligente de Negociações", description: "", status: "completed", priority: "medium",
        subtasks: [
            { id: "plan-3.1", title: "Briefings automáticos gerados a partir de dados históricos", description: "", status: "completed", priority: "high" },
            { id: "plan-3.2", title: "Antecipação de objeções mapeadas com IA e padrões do mercado", description: "", status: "completed", priority: "medium" },
            { id: "plan-3.3", title: "Simulação de cenários para decisões mais fortes e seguras", description: "", status: "completed", priority: "low" },
            { id: "plan-3.4", title: "Reuniões iniciadas com total clareza estratégica", description: "", status: "completed", priority: "low" },
        ],
    },
];

const acaoTasks: Task[] = [
    {
        id: "acao-1", title: "Registro Multi-Formato Inteligente", description: "", status: "in-progress", priority: "high",
        subtasks: [
            { id: "acao-1.1", title: "Texto, áudio ou foto viram dados estruturados automaticamente", description: "", status: "completed", priority: "high" },
            { id: "acao-1.2", title: "Categorização guiada por frameworks de execução", description: "", status: "in-progress", priority: "high" },
            { id: "acao-1.3", title: "Registros entram no fluxo como tarefas priorizadas", description: "", status: "pending", priority: "medium" },
            { id: "acao-1.4", title: "Linguagem natural convertida em ação imediata", description: "", status: "pending", priority: "low" },
        ],
    },
    {
        id: "acao-2", title: "Execução com Frameworks de Alta Performance", description: "", status: "pending", priority: "high",
        subtasks: [
            { id: "acao-2.1", title: "Movimentos guiados por frameworks usados pelos top performers", description: "", status: "pending", priority: "high" },
            { id: "acao-2.2", title: "Ações calibradas para impacto alto com desgaste mínimo", description: "", status: "pending", priority: "medium" },
            { id: "acao-2.3", title: "Insights traduzidos em tarefas priorizadas com precisão", description: "", status: "pending", priority: "high" },
            { id: "acao-2.4", title: "Ações críticas organizadas conforme impacto e urgência", description: "", status: "pending", priority: "low" },
        ],
    },
    {
        id: "acao-3", title: "Ação Contínua e Otimização por Dados", description: "", status: "need-help", priority: "medium",
        subtasks: [
            { id: "acao-3.1", title: "Ações estratégicas disparadas automaticamente conforme contexto", description: "", status: "need-help", priority: "high" },
            { id: "acao-3.2", title: "Investimentos ajustados em tempo real com base em métricas", description: "", status: "pending", priority: "medium" },
            { id: "acao-3.4", title: "Sistema que executa, aprende e otimiza sem sua intervenção", description: "", status: "pending", priority: "low" },
        ],
    },
];

const controleTasks: Task[] = [
    {
        id: "ctrl-1", title: "Visão Financeira Completa em Tempo Real", description: "", status: "in-progress", priority: "high",
        subtasks: [
            { id: "ctrl-1.1", title: "Fluxo de caixa atualizado instantaneamente", description: "", status: "completed", priority: "high" },
            { id: "ctrl-1.2", title: "DRE gerencial automático e sem erros", description: "", status: "in-progress", priority: "high" },
            { id: "ctrl-1.3", title: "Previsibilidade financeira para decisões seguras", description: "", status: "pending", priority: "medium" },
            { id: "ctrl-1.4", title: "Visualização clara de onde está indo cada centavo", description: "", status: "pending", priority: "low" },
        ],
    },
    {
        id: "ctrl-2", title: "Monitoramento de Metas e Indicadores", description: "", status: "pending", priority: "high",
        subtasks: [
            { id: "ctrl-2.1", title: "Acompanhamento de KPIs em tempo real", description: "", status: "pending", priority: "high" },
            { id: "ctrl-2.2", title: "Alertas de desvio de meta e correções sugeridas", description: "", status: "pending", priority: "high" },
            { id: "ctrl-2.3", title: "Visão consolidada de performance vs. planejado", description: "", status: "pending", priority: "medium" },
            { id: "ctrl-2.4", title: "Controle total sobre o ritmo de crescimento", description: "", status: "pending", priority: "low" },
        ],
    },
    {
        id: "ctrl-3", title: "Gestão Inteligente de Recursos", description: "", status: "completed", priority: "medium",
        subtasks: [
            { id: "ctrl-3.1", title: "Otimização automática de alocação de verba", description: "", status: "completed", priority: "high" },
            { id: "ctrl-3.2", title: "Identificação de desperdícios e custos invisíveis", description: "", status: "completed", priority: "medium" },
            { id: "ctrl-3.3", title: "Máxima eficiência operacional com o mesmo time", description: "", status: "completed", priority: "low" },
        ],
    },
];

export default function AnimatedTabs() {
    const [activeTab, setActiveTab] = useState("planejamento");

    const tabs = [
        { id: "planejamento", label: "Planejamento", tasks: planejamentoTasks },
        { id: "acao", label: "Ação", tasks: acaoTasks },
        { id: "controle", label: "Controle", tasks: controleTasks },
    ];

    const activeTasks = tabs.find((t) => t.id === activeTab)?.tasks || [];

    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
            <div className="flex space-x-1 mb-8 bg-neutral-900/50 p-1 rounded-full border border-white/10 backdrop-blur-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                            activeTab === tab.id ? "text-black" : "text-neutral-400 hover:text-white"
                        )}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-white rounded-full shadow-lg"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="w-full relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="grid gap-4"
                    >
                        {activeTasks.map((task) => (
                            <div key={task.id} className="bg-neutral-900/40 border border-white/10 rounded-xl p-5 md:p-6 backdrop-blur-sm hover:border-white/20 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <h3 className="text-lg md:text-xl font-bold text-white">{task.title}</h3>
                                    <span className={cn(
                                        "text-xs font-bold px-3 py-1 rounded-full border w-fit uppercase tracking-wider",
                                        task.priority === 'high' ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                        task.priority === 'medium' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                                        "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                    )}>
                                        {task.priority === 'high' ? 'Alta Prioridade' : task.priority === 'medium' ? 'Média Prioridade' : 'Baixa Prioridade'}
                                    </span>
                                </div>
                                
                                <div className="space-y-4">
                                    {task.subtasks.map((subtask) => (
                                        <div key={subtask.id} className="flex items-start gap-3 md:gap-4 group">
                                             <div className={cn(
                                                 "mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300",
                                                 subtask.status === 'completed' ? "bg-green-500 border-green-500" : "border-white/20 group-hover:border-[#FFA11D]"
                                             )}>
                                                 {subtask.status === 'completed' && (
                                                     <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="3">
                                                         <path d="M2 6L4.5 9L10 3" strokeLinecap="round" strokeLinejoin="round" />
                                                     </svg>
                                                 )}
                                             </div>
                                             <div className="flex-1">
                                                 <p className={cn(
                                                     "text-sm font-medium transition-colors duration-300",
                                                     subtask.status === 'completed' ? "text-neutral-500 line-through" : "text-neutral-200 group-hover:text-white"
                                                 )}>
                                                     {subtask.title}
                                                 </p>
                                                 {subtask.description && (
                                                     <p className="text-xs text-neutral-500 mt-1">{subtask.description}</p>
                                                 )}
                                             </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
