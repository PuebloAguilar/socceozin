
import React, { useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Target,
  Activity,
  HeartPulse,
  Sparkles
} from "lucide-react";
import { StatCard } from '../ui/StatCard';
import { Transaction } from './TransactionsContent';
import { CreditCardItem } from './CardsPage';
import { LoanItem } from './LoansPage';
import { SmartForecastWidget } from '../ui/SmartForecastWidget';
import { Meta } from '../../types';

interface DashboardContentProps {
    transactions: Transaction[];
    cards: CreditCardItem[];
    loans: LoanItem[];
    currency: string;
    okrs?: Meta[];
}

// --- Componente de Saúde Estratégica (Baseada em OKRs) ---
const StrategicHealthOverview: React.FC<{
    okrs: Meta[];
}> = ({ okrs }) => {
    // Cálculo do Score Global baseado no progresso médio de todos os OKRs
    const totalScore = useMemo(() => {
        if (!okrs || okrs.length === 0) return 50; // Default score
        
        let weightedSum = 0;
        let totalWeight = 0;

        okrs.forEach(okr => {
            okr.keyResults.forEach(kr => {
                const progress = Math.min((kr.current / kr.target) * 100, 100);
                weightedSum += progress * kr.weight;
                totalWeight += kr.weight;
            });
        });

        return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
    }, [okrs]);

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-emerald-500';
        if (score >= 40) return 'text-amber-500';
        return 'text-red-500';
    };

    // Find lagging OKR for display
    const laggingOkr = okrs.find(o => {
        const p = o.keyResults.reduce((acc, kr) => acc + (Math.min((kr.current/kr.target)*100, 100)), 0) / o.keyResults.length;
        return p < 40;
    });

    const getHealthForecast = () => {
        if (totalScore >= 70) {
            return {
                forceColor: 'green' as 'green' | 'red' | 'neutral',
                customTitle: "Estratégia: On Track",
                customText: "Excelente execução! A maioria dos seus Key Results está progredindo conforme o esperado.",
                nextStep: "Manter o ritmo atual e documentar os aprendizados para o próximo ciclo."
            };
        }
        if (totalScore >= 40) {
            return {
                forceColor: 'neutral' as 'green' | 'red' | 'neutral',
                customTitle: "Estratégia: Atenção",
                customText: "Alguns objetivos estão ficando para trás. O ritmo atual pode comprometer o fechamento do trimestre.",
                nextStep: laggingOkr 
                    ? `Priorizar a Meta de ${laggingOkr.area}: Revisar ações do KR mais atrasado.` 
                    : "Identificar gargalos nos KRs amarelos e realocar recursos esta semana."
            };
        }
        return {
            forceColor: 'red' as 'green' | 'red' | 'neutral',
            customTitle: "Estratégia: Crítico",
            customText: "Alerta vermelho. Seus principais resultados chave estão comprometidos.",
            nextStep: "Agendar reunião de emergência para pivotar a estratégia do trimestre ou reduzir escopo dos KRs."
        };
    };

    return (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 shadow-sm mb-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <HeartPulse className="h-6 w-6 text-rose-500" />
                        Saúde Estratégica Global
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Baseado nos seus OKRs ativos na Área de Trabalho.</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-input)] border border-[var(--border-color)]`}>
                    <span className={`text-lg font-bold ${getScoreColor(totalScore)}`}>{totalScore}%</span>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Score</span>
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {/* Execution Score */}
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-300">
                            <Activity className="h-4 w-4" />
                            <span className="text-sm font-medium">Execução de Metas</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalScore}%</span>
                            <span className="text-xs text-gray-500 mb-1">concluído</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-3 overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${totalScore > 70 ? 'bg-emerald-500' : totalScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                style={{ width: `${totalScore}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Alert Area */}
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-300">
                            <Target className="h-4 w-4" />
                            <span className="text-sm font-medium">Foco Necessário</span>
                        </div>
                        {laggingOkr ? (
                            <>
                                <div className="flex items-end gap-2">
                                    <span className="text-lg font-bold text-red-500 dark:text-red-400 truncate">{laggingOkr.area.toUpperCase()}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                    "{laggingOkr.objective}" está atrasado.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="flex items-end gap-2">
                                    <span className="text-lg font-bold text-green-500 dark:text-green-400">Tudo OK</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Nenhum OKR crítico no momento.
                                </p>
                            </>
                        )}
                    </div>
                </div>
                
                <div className="mt-[-1rem]">
                    <SmartForecastWidget {...getHealthForecast()} />
                </div>
            </div>
        </div>
    );
};

export const DashboardContent: React.FC<DashboardContentProps> = ({
    transactions,
    cards,
    loans,
    currency,
    okrs = []
}) => {
    // 1. Receitas
    const transactionIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    
    // 2. Despesas Variáveis
    const transactionExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

    // 3. Despesas Fixas
    const cardsExpense = cards.reduce((acc, card) => {
         return acc + (card.installments ? card.installments.reduce((s, i) => s + i.amount, 0) : 0);
    }, 0);

    const loansExpense = loans.filter(l => l.status === 'active').reduce((acc, l) => acc + l.installmentValue, 0);

    // Totais
    const totalIncome = transactionIncome;
    const totalExpense = transactionExpense + cardsExpense + loansExpense; 
    const balance = totalIncome - totalExpense;

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency }).format(val);

    // Projeção
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const remainingDays = Math.max(0, daysInMonth - currentDay);
    
    const avgDailyVariableIncome = currentDay > 0 ? transactionIncome / currentDay : 0;
    const avgDailyVariableExpense = currentDay > 0 ? transactionExpense / currentDay : 0;
    
    const projectedIncome = transactionIncome + (avgDailyVariableIncome * remainingDays);
    const projectedVariableExpense = transactionExpense + (avgDailyVariableExpense * remainingDays);
    
    const projectedTotalExpense = projectedVariableExpense + cardsExpense + loansExpense;
    const projectedBalance = projectedIncome - projectedTotalExpense;

    return (
        <div className="h-[calc(100vh-9rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 pr-2 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Visão consolidada & Estratégica</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Receitas" amount={formatCurrency(totalIncome)} Icon={TrendingUp} iconColor="text-green-500" borderColor="border-green-500" amountColor="text-green-600 dark:text-green-400" />
                <StatCard 
                    title="Total Despesas" 
                    amount={formatCurrency(totalExpense)} 
                    Icon={TrendingDown} 
                    iconColor="text-red-500" 
                    borderColor="border-red-500" 
                    amountColor="text-red-600 dark:text-red-400" 
                    period="Transações + Cartões + Empréstimos"
                />
                <StatCard title="Saldo Líquido" amount={formatCurrency(balance)} Icon={DollarSign} iconColor="text-primary-500" borderColor="border-primary-500" amountColor={balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"} />
                <StatCard 
                    title="Fluxo Projetado" 
                    amount={formatCurrency(projectedBalance)} 
                    Icon={Sparkles} 
                    iconColor={projectedBalance >= 0 ? "text-green-500" : "text-red-500"} 
                    borderColor={projectedBalance >= 0 ? "border-green-500" : "border-red-500"} 
                    amountColor={projectedBalance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
                    period="Estimativa de fechamento"
                />
            </div>

            {/* Nova Seção de Saúde Estratégica (OKR Driven) */}
            <StrategicHealthOverview okrs={okrs} />

            <div className="grid grid-cols-1 gap-6">
               {/* Quick Summary of OKR Impact could go here */}
            </div>
        </div>
    );
};
