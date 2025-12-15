
import React, { useState, useEffect, useMemo } from 'react';
import {
  Trash2,
  Edit3,
  CreditCard,
  X,
  BarChart3,
  Wallet,
  Check,
  Briefcase,
  TrendingUp,
  Plus,
  Lightbulb
} from "lucide-react";
import { CreditCardItem } from './CardsPage';
import { LoanItem } from './LoansPage';
import { SmartForecastWidget } from '../ui/SmartForecastWidget';

// --- Interfaces ---
export interface Bank {
    id: number;
    name: string;
    color: string;
    icon?: string;
}

interface BanksPageProps {
    banks: Bank[];
    cards: CreditCardItem[];
    loans: LoanItem[];
    onSaveBank: (bank: Bank) => void;
    onDeleteBank: (id: number) => void;
    isSubPage?: boolean;
}

// --- Modals and Helpers ---

const BankEditModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    bank: Bank | null;
    onSave: (bank: Bank) => void;
}> = ({ isOpen, onClose, bank, onSave }) => {
    
    const [selectedColor, setSelectedColor] = useState('bg-primary-500');
    const [name, setName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setSelectedColor(bank?.color || 'bg-primary-500');
            setName(bank?.name || '');
        }
    }, [isOpen, bank]);

    if (!isOpen) return null;

    const isNew = !bank?.id;

    const colorPalette = [
        'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-400', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500',
        'bg-teal-500', 'bg-cyan-500', 'bg-sky-500', 'bg-primary-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500',
        'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500', 'bg-rose-700', 'bg-purple-700', 'bg-primary-700', 'bg-cyan-700',
        'bg-green-700', 'bg-amber-700', 'bg-red-700'
    ];
    
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        onSave({
            id: bank?.id || 0, // 0 indicates new
            name: name,
            color: selectedColor
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--bg-card)] rounded-2xl shadow-xl w-full max-w-md relative transform transition-all duration-300 animate-in fade-in zoom-in-95 p-8 border border-[var(--border-color)]"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg-input)] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    type="button"
                >
                    <X className="h-6 w-6" />
                </button>
                
                <div className="text-left mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {isNew ? 'Nova Instituição' : 'Editar Instituição'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {isNew ? 'Adicione uma nova instituição financeira.' : 'Personalize os dados da instituição.'}
                    </p>
                </div>

                <form onSubmit={handleSave}>
                    <div className="mb-6">
                        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Instituição</label>
                        <input 
                            type="text" 
                            id="bankName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Nubank, Banco do Brasil" 
                            className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400" 
                            required
                        />
                    </div>

                    <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Paleta de Cores</h3>
                        <div className="grid grid-cols-6 gap-3">
                            {colorPalette.map(colorClass => (
                                <button
                                    key={colorClass}
                                    type="button"
                                    onClick={() => setSelectedColor(colorClass)}
                                    className={`w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center ${colorClass} ${selectedColor === colorClass ? 'ring-4 ring-offset-2 ring-primary-500 dark:ring-offset-gray-900 scale-110' : 'hover:scale-110'}`}
                                    aria-label={`Selecionar cor ${colorClass}`}
                                >
                                    {selectedColor === colorClass && <Check className="h-6 w-6 text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3">
                         <button 
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-[var(--bg-input)] transition-colors shadow-sm"
                         >
                            Cancelar
                         </button>
                         <button 
                            type="submit"
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BankChartModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    bank: Bank | null;
    cards: CreditCardItem[];
    loans: LoanItem[];
}> = ({ isOpen, onClose, bank, cards, loans }) => {
    if (!isOpen || !bank) return null;

    const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const colors = ['#3b82f6', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#14b8a6'];
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    
    // Calcula o total gasto considerando Cartões (Fatura) + Empréstimos (Parcela)
    const totalCardSpending = cards.reduce((acc, card) => acc + card.usedLimit, 0);
    const totalLoanSpending = loans.reduce((acc, loan) => acc + loan.installmentValue, 0);
    const totalMonthlySpending = totalCardSpending + totalLoanSpending;

    // Combina os dados para o gráfico
    const segments = useMemo(() => {
        let accumulatedAngle = -90; 
        const allItems = [
            ...cards.map(c => ({ type: 'card', name: c.name, value: c.usedLimit, label: 'Fatura' })),
            ...loans.map(l => ({ type: 'loan', name: l.title, value: l.installmentValue, label: 'Parcela' }))
        ].filter(i => i.value > 0);

        return allItems.map((item, index) => {
            const percentage = totalMonthlySpending > 0 ? (item.value / totalMonthlySpending) : 0;
            const segment = {
                id: index,
                ...item,
                percentage: percentage,
                strokeDasharray: `${percentage * circumference} ${circumference}`,
                rotation: accumulatedAngle,
                color: colors[index % colors.length]
            };
            accumulatedAngle += percentage * 360;
            return segment;
        });
    }, [cards, loans, totalMonthlySpending, circumference]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--bg-card)] rounded-2xl shadow-xl w-full max-w-2xl relative transform transition-all duration-300 animate-in fade-in zoom-in-95 p-8 border border-[var(--border-color)]"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg-input)] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    type="button"
                >
                    <X className="h-6 w-6" />
                </button>
                
                <div className="text-left mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Comprometimento Mensal: {bank.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Soma de faturas de cartão e parcelas de empréstimos ativos.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Chart */}
                    <div className="relative w-48 h-48 shrink-0">
                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                            <circle cx="50" cy="50" r={radius} fill="transparent" strokeWidth="12" className="stroke-gray-200 dark:stroke-gray-700" />
                            {segments.map(segment => (
                                <circle
                                    key={segment.id}
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    fill="transparent"
                                    strokeWidth="12"
                                    stroke={segment.color}
                                    strokeDasharray={segment.strokeDasharray}
                                    transform={`rotate(${segment.rotation} 50 50)`}
                                    className="transition-all duration-1000"
                                />
                            ))}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Total Mensal</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalMonthlySpending)}</span>
                        </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="w-full space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                        {segments.map((item, index) => {
                             const percentage = ((item.percentage) * 100).toFixed(1);
                             return (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <div>
                                            <div className="flex items-center gap-1">
                                                {item.type === 'card' ? <CreditCard className="h-3 w-3 text-gray-400"/> : <Briefcase className="h-3 w-3 text-gray-400"/>}
                                                <p className="font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(item.value)}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{percentage}%</p>
                                    </div>
                                </div>
                            );
                        })}
                        {segments.length === 0 && (
                             <p className="text-center text-gray-500 dark:text-gray-400 italic py-4">Nenhum custo ativo vinculado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---
export const BanksPage: React.FC<BanksPageProps> = ({ banks, cards, loans, onSaveBank, onDeleteBank, isSubPage = false }) => {
    const [isBankChartModalOpen, setIsBankChartModalOpen] = useState(false);
    const [selectedBankForChart, setSelectedBankForChart] = useState<Bank | null>(null);
    const [isBankEditModalOpen, setIsBankEditModalOpen] = useState(false);
    const [editingBank, setEditingBank] = useState<Bank | null>(null);

    const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // --- Logic for Active Banks Statistics ---
    const bankStats = useMemo(() => {
        return banks.map(bank => {
            // Filter Cards for this bank
            const bankCards = cards.filter(c => c.bankId === bank.id);
            const totalLimitCards = bankCards.reduce((acc, curr) => acc + curr.limit, 0);
            const totalUsedCards = bankCards.reduce((acc, curr) => acc + curr.usedLimit, 0);

            // Filter Loans for this bank (using fuzzy match)
            // Normaliza nomes para evitar erros de case/espaço
            const bankNameNormalized = bank.name.trim().toLowerCase();
            const bankLoans = loans.filter(l => 
                l.status === 'active' && 
                (l.bank.trim().toLowerCase() === bankNameNormalized || l.bank.toLowerCase().includes(bankNameNormalized))
            );
            
            const totalLoanMonthlyPayment = bankLoans.reduce((acc, l) => acc + l.installmentValue, 0);
            
            // Total Mensal (O que sai do bolso para este banco)
            const totalMonthlyCommitment = totalUsedCards + totalLoanMonthlyPayment;
            
            // Lógica Visual Unificada:
            const totalVisualCapacity = totalLimitCards + totalLoanMonthlyPayment;
            const percentUsedUnified = totalVisualCapacity > 0 ? (totalMonthlyCommitment / totalVisualCapacity) * 100 : 0;
            
            return { 
                ...bank, 
                totalLimitCards, 
                totalUsedCards, 
                totalLoanMonthlyPayment,
                totalMonthlyCommitment,
                percentUsedUnified,
                cardsCount: bankCards.length,
                loansCount: bankLoans.length,
                hasActivity: bankCards.length > 0 || bankLoans.length > 0
            };
        }).filter(stat => stat.hasActivity);
    }, [banks, cards, loans]);

    // Calculate Global Prediction Data (Mocked Logic for Demo)
    const currentTotalSpending = bankStats.reduce((acc, stat) => acc + stat.totalMonthlyCommitment, 0);
    // Simulate previous month being slightly lower to trigger "High Expense" alert (Red) if forecast is negative
    const simulatedPreviousMonth = currentTotalSpending * 0.85; 
    const percentageChange = currentTotalSpending > 0 ? ((currentTotalSpending - simulatedPreviousMonth) / simulatedPreviousMonth) * 100 : 0;


    // --- INTERACTION HANDLERS ---
    const handleBankClick = (bank: Bank) => {
        setSelectedBankForChart(bank);
        setIsBankChartModalOpen(true);
    };
    
    const handleEditBank = (bank: Bank) => {
        setEditingBank(bank);
        setIsBankEditModalOpen(true);
    };

    const handleNewBank = () => {
        setEditingBank(null);
        setIsBankEditModalOpen(true);
    };

    const containerClass = isSubPage 
        ? "w-full pr-2" 
        : "h-[calc(100vh-9rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 pr-2 pb-4";

    return (
        <div className={containerClass}>
            {!isSubPage && (
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Bancos</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie suas instituições financeiras cadastradas.</p>
                    </div>
                </div>
            )}

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-[var(--bg-card)] p-6 rounded-xl shadow-sm border border-[var(--border-color)]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Gastos por Instituição</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Comprometimento mensal (Faturas + Parcelas)</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                         {bankStats.length === 0 && (
                             <p className="text-center text-gray-500 dark:text-gray-400 py-4">Sem dados de gastos. Vincule cartões ou empréstimos.</p>
                         )}
                        {bankStats.map(stat => (
                            <div key={stat.id}>
                                <div className="flex justify-between items-end mb-2">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                                            <span className="font-medium text-gray-700 dark:text-gray-200">{stat.name}</span>
                                        </div>
                                        <div className="flex gap-2 text-[10px] text-gray-400 pl-5">
                                            {stat.totalUsedCards > 0 && <span>Fatura: {formatCurrency(stat.totalUsedCards)}</span>}
                                            {stat.totalUsedCards > 0 && stat.totalLoanMonthlyPayment > 0 && <span>•</span>}
                                            {stat.totalLoanMonthlyPayment > 0 && <span>Parcelas: {formatCurrency(stat.totalLoanMonthlyPayment)}</span>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(stat.totalMonthlyCommitment)}</div>
                                        <div className="text-xs text-gray-400 dark:text-gray-500">{stat.percentUsedUnified.toFixed(1)}% comprometido</div>
                                    </div>
                                </div>
                                
                                <div className="h-2.5 w-full bg-[var(--color-detail)] rounded-full overflow-hidden relative" title={`Comprometimento total: ${stat.percentUsedUnified.toFixed(1)}%`}>
                                    <div 
                                        className={`h-full rounded-full ${stat.color} opacity-90 transition-all duration-700`} 
                                        style={{ width: `${Math.min(stat.percentUsedUnified, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Smart Forecast Widget - Moved Below Chart Window */}
                {bankStats.length > 0 && (
                    <div className="mt-[-1.5rem]">
                        <SmartForecastWidget 
                            currentValue={currentTotalSpending}
                            previousValue={simulatedPreviousMonth}
                            percentageChange={percentageChange}
                            period="Mês"
                            type="expense"
                        />
                    </div>
                )}

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-gray-500" />
                            Instituições Cadastradas
                        </h3>
                        <button 
                            onClick={handleNewBank}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Nova Instituição
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {banks.map(bank => {
                            const bankNameNormalized = bank.name.trim().toLowerCase();
                            const linkedLoans = loans.filter(l => 
                                l.status === 'active' && 
                                (l.bank.trim().toLowerCase() === bankNameNormalized || 
                                l.bank.toLowerCase().includes(bankNameNormalized) ||
                                bank.name.toLowerCase().includes(l.bank.toLowerCase()))
                            );
                            
                            return (
                            <div key={bank.id} className="group relative text-left bg-[var(--bg-card)] p-5 rounded-xl shadow-sm border border-[var(--border-color)] transition-all flex flex-col justify-between h-full hover:border-primary-200 dark:hover:border-primary-800">
                                <button onClick={() => handleBankClick(bank)} className="absolute inset-0 w-full h-full z-0" aria-label="Ver detalhes do banco"></button>
                                <div className="relative z-10 pointer-events-none">
                                    <div className="flex items-center justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full ${bank.color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                                                {bank.name.charAt(0).toUpperCase()}
                                            </div>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">{bank.name}</p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleEditBank(bank); }}
                                                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-[var(--bg-input)] transition-colors" title="Editar Banco"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onDeleteBank(bank.id); }}
                                                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Excluir Banco"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Cartões Ativos */}
                                    <div className="mb-4">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Cartões Ativos</p>
                                        <div className="flex flex-wrap gap-2">
                                            {cards.filter(c => c.bankId === bank.id).length > 0 ? (
                                                cards.filter(c => c.bankId === bank.id).map(c => (
                                                    <span key={c.id} className="text-xs px-2 py-1 bg-[var(--bg-input)] rounded-md text-gray-600 dark:text-gray-300 border border-[var(--border-color)] flex items-center gap-1">
                                                        <CreditCard className="h-3 w-3 opacity-70" />
                                                        {c.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Nenhum cartão ativo</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Créditos Ativos */}
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Créditos Ativos</p>
                                        <div className="flex flex-wrap gap-2">
                                            {linkedLoans.length > 0 ? (
                                                linkedLoans.map(loan => (
                                                    <span key={loan.id} className="text-xs px-2 py-1 bg-primary-50 dark:bg-primary-900/20 rounded-md text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800 flex items-center gap-1">
                                                        <Briefcase className="h-3 w-3 opacity-70" />
                                                        {loan.title}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Nenhum crédito ativo</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>
            </div>

            <BankChartModal
                isOpen={isBankChartModalOpen}
                onClose={() => setIsBankChartModalOpen(false)}
                bank={selectedBankForChart}
                cards={cards.filter(c => c.bankId === selectedBankForChart?.id)}
                loans={loans.filter(l => 
                    l.status === 'active' && 
                    (l.bank.trim().toLowerCase() === selectedBankForChart?.name.trim().toLowerCase() ||
                     l.bank.toLowerCase().includes(selectedBankForChart?.name.trim().toLowerCase()))
                )}
            />

            <BankEditModal
                isOpen={isBankEditModalOpen}
                onClose={() => setIsBankEditModalOpen(false)}
                bank={editingBank}
                onSave={onSaveBank}
            />
        </div>
    );
};
