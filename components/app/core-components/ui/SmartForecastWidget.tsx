
import React from 'react';
import { Lightbulb, ArrowRight } from "lucide-react";

export const SmartForecastWidget: React.FC<{
    currentValue?: number;
    previousValue?: number;
    percentageChange?: number;
    period?: string;
    type?: 'income' | 'expense' | 'balance' | 'health';
    customTitle?: string;
    customText?: string;
    nextStep?: string; // Nova prop para ação sugerida
    forceColor?: 'green' | 'red' | 'neutral';
}> = ({ currentValue = 0, previousValue = 0, percentageChange = 0, period = '', type = 'balance', customTitle, customText, nextStep, forceColor }) => {
    
    const getInsight = () => {
        const colorMap = {
            green: {
                color: "text-green-700 dark:text-green-400",
                bg: "bg-green-50 dark:bg-green-900/20",
                border: "border-green-200 dark:border-green-800",
                iconBg: "bg-green-100 dark:bg-green-800",
                separator: "border-green-200 dark:border-green-800"
            },
            red: {
                color: "text-red-700 dark:text-red-400",
                bg: "bg-red-50 dark:bg-red-900/20",
                border: "border-red-200 dark:border-red-800",
                iconBg: "bg-red-100 dark:bg-red-800",
                separator: "border-red-200 dark:border-red-800"
            },
            neutral: {
                color: "text-gray-700 dark:text-gray-300",
                bg: "bg-[var(--bg-card)]",
                border: "border-[var(--border-color)]",
                iconBg: "bg-[var(--bg-input)]",
                separator: "border-[var(--border-color)]"
            }
        };

        if (customTitle && customText) {
             const theme = colorMap[forceColor || 'neutral'];
             return { title: customTitle, text: customText, ...theme };
        }

        // Logic for colors and texts
        const absChange = Math.abs(percentageChange);
        const isSignificant = absChange > 2; 

        // Default Neutral
        let theme = {
            title: "Estabilidade",
            text: `Variação mínima de ${percentageChange.toFixed(1)}%. Você está mantendo um padrão consistente.`,
            ...colorMap.neutral
        };

        if (isSignificant) {
            if (type === 'expense') {
                if (percentageChange > 0) {
                    // Expenses increasing -> Bad -> Red
                    theme = {
                        title: "Alerta de Gastos",
                        text: `Seus gastos aumentaram ${percentageChange.toFixed(1)}%. Atenção ao orçamento!`,
                        ...colorMap.red
                    };
                } else {
                    // Expenses decreasing -> Good -> Green
                    theme = {
                        title: "Economia Detectada",
                        text: `Você reduziu seus gastos em ${absChange.toFixed(1)}%. Excelente trabalho!`,
                        ...colorMap.green
                    };
                }
            } else { // Income or Balance
                if (percentageChange > 0) {
                    // Income/Balance increasing -> Good -> Green
                    theme = {
                        title: "Crescimento Positivo",
                        text: `Seus rendimentos subiram ${percentageChange.toFixed(1)}%. Ótimo momento para investir.`,
                        ...colorMap.green
                    };
                } else {
                    // Income/Balance decreasing -> Bad -> Red
                    theme = {
                        title: "Queda de Rendimento",
                        text: `Houve uma queda de ${absChange.toFixed(1)}%. Verifique suas entradas.`,
                        ...colorMap.red
                    };
                }
            }
        }
        return theme;
    };

    const insight = getInsight();

    return (
        <div className={`p-4 rounded-xl border ${insight.bg} ${insight.border} flex flex-col shadow-sm`}>
            <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-full shrink-0 ${insight.iconBg} ${insight.color}`}>
                    <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                    <h4 className={`font-bold text-sm flex items-center gap-2 ${insight.color}`}>
                        {insight.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                        {insight.text}
                    </p>
                    {period && !customTitle && (
                        <div className="mt-2 text-xs font-medium opacity-60 text-gray-500 dark:text-gray-400">
                            Baseado em dados de {period.toLowerCase()}.
                        </div>
                    )}
                </div>
            </div>

            {nextStep && (
                <div className={`mt-3 pt-3 border-t ${insight.separator} flex items-start gap-2 animate-in fade-in slide-in-from-top-1`}>
                    <ArrowRight className={`h-4 w-4 mt-0.5 shrink-0 ${insight.color}`} />
                    <div>
                        <span className={`text-xs font-bold uppercase tracking-wide mr-1 ${insight.color}`}>Próximo Passo:</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{nextStep}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
