
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Calendar,
  X,
  TrendingDown,
  CheckCircle2,
  Clock,
  Briefcase,
  DollarSign
} from "lucide-react";
import { StatCard } from '../ui/StatCard';
import { Bank } from './BanksPage';

// --- Interfaces ---

export interface LoanItem {
    id: number;
    title: string; // Finalidade (ex: Carro, Reforma)
    bank: string; // Credor
    totalValue: number;
    installmentValue: number;
    totalInstallments: number;
    paidInstallments: number;
    dueDateDay: number;
    status: 'active' | 'finished';
}

interface LoansPageProps {
    loans: LoanItem[];
    banks?: Bank[]; // Opcional, pois pode não ser passado se não estiver na WalletsContent
    onSave: (item: LoanItem) => void;
    onDelete: (id: number) => void;
    onPayInstallment?: (id: number) => void;
    pageTitle?: string;
    currency: string;
    isSubPage?: boolean;
}

// --- Componentes ---

const LoanDetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    loan: LoanItem | null;
    onEdit: (item: LoanItem) => void;
    onPayInstallment?: (id: number) => void;
    formatCurrency: (value: number) => string;
}> = ({ isOpen, onClose, loan, onEdit, onPayInstallment, formatCurrency }) => {
    if (!isOpen || !loan) return null;

    // --- Cálculos ---
    const totalRepayment = loan.installmentValue * loan.totalInstallments;
    const totalInterest = totalRepayment - loan.totalValue;
    const interestPerPayment = totalInterest > 0 ? totalInterest / loan.totalInstallments : 0;
    const principalPerPayment = loan.installmentValue - interestPerPayment;
    const remainingDebt = (loan.totalInstallments - loan.paidInstallments) * loan.installmentValue;
    const percentagePaid = (loan.paidInstallments / loan.totalInstallments) * 100;
    const isFinished = loan.paidInstallments >= loan.totalInstallments;

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentagePaid / 100) * circumference;

    const amortizationSchedule = Array.from({ length: loan.totalInstallments }).map((_, i) => {
        const installmentNumber = i + 1;
        const isPaid = installmentNumber <= loan.paidInstallments;
        const remainingBalance = loan.totalValue - (principalPerPayment * installmentNumber);
        return {
            number: installmentNumber,
            principal: principalPerPayment,
            interest: interestPerPayment,
            total: loan.installmentValue,
            remainingBalance: remainingBalance < 0 ? 0 : remainingBalance,
            isPaid,
        };
    });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--bg-card)] rounded-2xl shadow-2xl w-full max-w-4xl relative transform transition-all duration-300 animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-start shrink-0 bg-[var(--bg-card)]">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{loan.title}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                            {loan.bank} • 
                            <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${loan.status === 'active' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'}`}>
                                {loan.status === 'active' ? 'Ativo' : 'Quitado'}
                            </span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Left Panel - Stats & Chart */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[var(--bg-card)] p-4 rounded-lg shadow-sm border border-[var(--border-color)]">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Saldo Devedor</p>
                                <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(remainingDebt)}</p>
                            </div>
                            <div className="bg-[var(--bg-card)] p-4 rounded-lg shadow-sm border border-[var(--border-color)]">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Parcela Mensal</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(loan.installmentValue)}</p>
                            </div>
                             <div className="bg-[var(--bg-card)] p-4 rounded-lg shadow-sm border border-[var(--border-color)]">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Juros Totais</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalInterest)}</p>
                            </div>
                            <div className="bg-[var(--bg-card)] p-4 rounded-lg shadow-sm border border-[var(--border-color)]">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Próx. Vencimento</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Dia {loan.dueDateDay}</p>
                            </div>
                        </div>

                        {/* Pay Button */}
                        {!isFinished && onPayInstallment && (
                            <button
                                onClick={() => {
                                    if(window.confirm(`Confirmar pagamento da parcela ${loan.paidInstallments + 1}/${loan.totalInstallments}?`)) {
                                        onPayInstallment(loan.id);
                                    }
                                }}
                                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <DollarSign className="h-5 w-5" />
                                Registrar Pagamento de Parcela
                            </button>
                        )}

                        {/* Progress Chart */}
                        <div className="bg-[var(--bg-card)] p-4 rounded-lg shadow-sm border border-[var(--border-color)] flex flex-col items-center justify-center">
                             <div className="relative w-40 h-40">
                                <svg className="w-full h-full" viewBox="0 0 140 140">
                                    <circle cx="70" cy="70" r={radius} fill="none" strokeWidth="12" className="stroke-gray-200 dark:stroke-gray-700" />
                                    <circle cx="70" cy="70" r={radius} fill="none" strokeWidth="12"
                                        className="stroke-primary-500 transition-all duration-1000 ease-out"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        transform="rotate(-90 70 70)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{percentagePaid.toFixed(1)}%</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Quitado</span>
                                </div>
                             </div>
                             <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 text-center">
                                <span className="font-bold">{loan.paidInstallments}</span> de <span className="font-bold">{loan.totalInstallments}</span> parcelas pagas.
                            </p>
                        </div>
                    </div>

                    {/* Right Panel - Amortization Table */}
                    <div className="lg:col-span-3 bg-[var(--bg-card)] rounded-lg shadow-sm border border-[var(--border-color)] flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-4 border-b border-[var(--border-color)] shrink-0">Tabela de Amortização</h3>
                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-950 dark:text-gray-100 uppercase bg-[var(--color-detail)] sticky top-0 font-bold">
                                    <tr>
                                        <th className="px-4 py-2">Nº</th>
                                        <th className="px-4 py-2">Principal</th>
                                        <th className="px-4 py-2">Juros</th>
                                        <th className="px-4 py-2">Saldo Devedor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {amortizationSchedule.map(item => (
                                        <tr key={item.number} className={`${item.isPaid ? 'bg-green-50 dark:bg-green-900/20 text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                            <td className="px-4 py-2 font-medium">
                                                <div className="flex items-center gap-2">
                                                    {item.isPaid && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                                                    {item.number}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">{formatCurrency(item.principal)}</td>
                                            <td className="px-4 py-2">{formatCurrency(item.interest)}</td>
                                            <td className="px-4 py-2 font-semibold">{formatCurrency(item.remainingBalance)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                 {/* Footer Actions */}
                <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex gap-3 justify-end shrink-0">
                     <button 
                        onClick={() => {
                            onClose();
                            onEdit(loan);
                        }}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-2 text-sm"
                    >
                        <Edit3 className="h-4 w-4" />
                        Editar Crédito
                     </button>
                </div>
            </div>
        </div>
    );
};


// Barra de Progresso
const LoanProgressBar: React.FC<{ total: number; paid: number }> = ({ total, paid }) => {
    const isHighCount = total > 24;
    
    return (
        <div className="mt-3">
            <div className="flex justify-between items-end mb-1 text-xs">
                <span className="font-medium text-primary-600 dark:text-primary-400">
                    {paid} pagas
                </span>
                <span className="text-gray-400 dark:text-gray-500">
                    {total - paid} restantes
                </span>
            </div>
            
            <div className={`flex w-full ${isHighCount ? 'gap-0.5' : 'gap-1'}`}>
                {Array.from({ length: total }).map((_, index) => {
                    const isPaid = index < paid;
                    const isCurrent = index === paid;
                    
                    return (
                        <div
                            key={index}
                            className={`
                                h-2.5 first:rounded-l-sm last:rounded-r-sm flex-1 transition-all duration-300
                                ${isPaid 
                                    ? 'bg-primary-500 dark:bg-primary-600' 
                                    : isCurrent 
                                        ? 'bg-primary-200 dark:bg-primary-900/60 animate-pulse' 
                                        : 'bg-[var(--color-detail)]'
                                }
                            `}
                            title={`Parcela ${index + 1}/${total} - ${isPaid ? 'Paga' : 'Pendente'}`}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const LoanFormModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    initialData?: LoanItem | null; 
    onSave: (item: LoanItem) => void;
    banks?: Bank[];
}> = ({ isOpen, onClose, initialData, onSave, banks }) => {
    const [title, setTitle] = useState('');
    const [bank, setBank] = useState('');
    const [totalValue, setTotalValue] = useState('');
    const [totalInstallments, setTotalInstallments] = useState('');
    const [paidInstallments, setPaidInstallments] = useState('');
    const [dueDateDay, setDueDateDay] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setTitle(initialData.title);
                setBank(initialData.bank);
                setTotalValue(initialData.totalValue.toString());
                setTotalInstallments(initialData.totalInstallments.toString());
                setPaidInstallments(initialData.paidInstallments.toString());
                setDueDateDay(initialData.dueDateDay.toString());
            } else {
                setTitle('');
                setBank('');
                setTotalValue('');
                setTotalInstallments('');
                setPaidInstallments('0');
                setDueDateDay('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const tInstallments = parseInt(totalInstallments) || 1;
        const tValue = parseFloat(totalValue) || 0;
        const instValue = tValue / tInstallments;

        const newItem: LoanItem = {
            id: initialData?.id || 0,
            title,
            bank,
            totalValue: tValue,
            installmentValue: instValue,
            totalInstallments: tInstallments,
            paidInstallments: parseInt(paidInstallments) || 0,
            dueDateDay: parseInt(dueDateDay) || 10,
            status: (parseInt(paidInstallments) || 0) >= tInstallments ? 'finished' : 'active'
        };

        onSave(newItem);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--bg-card)] rounded-2xl shadow-xl w-full max-w-md relative animate-in fade-in zoom-in-95 p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {initialData ? 'Editar Crédito' : 'Novo Crédito'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Finalidade</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Ex: Financiamento Carro, Reforma..." 
                            className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                            required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instituição Financeira</label>
                        {banks ? (
                            <select 
                                value={bank}
                                onChange={e => setBank(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                required
                            >
                                <option value="" disabled>Selecione</option>
                                {banks.map(b => (
                                    <option key={b.id} value={b.name}>{b.name}</option>
                                ))}
                            </select>
                        ) : (
                            <input 
                                type="text" 
                                value={bank}
                                onChange={e => setBank(e.target.value)}
                                placeholder="Ex: Santander, Caixa..." 
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor Total (R$)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={totalValue}
                                onChange={e => setTotalValue(e.target.value)}
                                placeholder="0,00" 
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                                required
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Parcelas</label>
                             <input 
                                type="number" 
                                min="1"
                                value={totalInstallments}
                                onChange={e => setTotalInstallments(e.target.value)}
                                placeholder="24" 
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Já pagas</label>
                             <input 
                                type="number" 
                                min="0"
                                max={totalInstallments}
                                value={paidInstallments}
                                onChange={e => setPaidInstallments(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dia Vencimento</label>
                             <input 
                                type="number" 
                                min="1"
                                max={31}
                                value={dueDateDay}
                                onChange={e => setDueDateDay(e.target.value)}
                                placeholder="Dia" 
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm mt-4">
                        Salvar Crédito
                    </button>
                </form>
            </div>
        </div>
    );
};

export const LoansPage: React.FC<LoansPageProps> = ({ loans, banks, onSave, onDelete, onPayInstallment, pageTitle = "Créditos", currency, isSubPage = false }) => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<LoanItem | null>(null);
    const [selectedLoan, setSelectedLoan] = useState<LoanItem | null>(null);
    
    // Sincroniza o selectedLoan quando os dados de loans mudam (ex: após pagamento)
    useEffect(() => {
        if (selectedLoan) {
            const updatedLoan = loans.find(l => l.id === selectedLoan.id);
            if (updatedLoan) {
                setSelectedLoan(updatedLoan);
            }
        }
    }, [loans, selectedLoan]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency }).format(val);

    // --- Cálculos de Métricas ---
    const activeLoans = loans.filter(i => i.status === 'active');
    
    const totalRemainingDebt = activeLoans.reduce((acc, curr) => {
        return acc + ((curr.totalInstallments - curr.paidInstallments) * curr.installmentValue);
    }, 0);

    const monthlyCommitment = activeLoans.reduce((acc, curr) => acc + curr.installmentValue, 0);

    const totalItems = loans.length;
    const finishedItems = loans.filter(i => i.status === 'finished').length;

    // --- Handlers ---

    const handleEdit = (item: LoanItem) => {
        setEditingItem(item);
        setIsFormModalOpen(true);
    };

    const handleNew = () => {
        setEditingItem(null);
        setIsFormModalOpen(true);
    };

    const handleLoanClick = (item: LoanItem) => {
        setSelectedLoan(item);
        setIsDetailsModalOpen(true);
    };

    const containerClass = isSubPage 
        ? "w-full pr-2" 
        : "h-[calc(100vh-9rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 pr-2 pb-4";

    return (
        <div className={containerClass}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{pageTitle}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Controle seus financiamentos e crédito pessoal.</p>
                </div>
            </div>

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Action Bar */}
                <div className="flex justify-end">
                    <button 
                        onClick={handleNew}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Novo {pageTitle === "Empréstimos" ? "Empréstimo" : "Crédito"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard 
                        title="Saldo Devedor" 
                        amount={formatCurrency(totalRemainingDebt)} 
                        Icon={TrendingDown} 
                        iconColor="text-red-500" 
                        borderColor="border-red-500" 
                        period="Total restante a pagar"
                    />
                    <StatCard 
                        title="Parcela Mensal" 
                        amount={formatCurrency(monthlyCommitment)} 
                        Icon={Calendar} 
                        iconColor="text-primary-500" 
                        borderColor="border-primary-500" 
                        period="Compromisso mensal atual"
                    />
                    <StatCard 
                        title="Contratos Quitados" 
                        amount={`${finishedItems}/${totalItems}`} 
                        Icon={CheckCircle2} 
                        iconColor="text-green-500" 
                        borderColor="border-green-500" 
                        period="Créditos finalizados"
                    />
                </div>

                {/* Lista de Créditos */}
                <div className="space-y-4">
                    {loans.length === 0 && (
                        <div className="text-center py-12 bg-[var(--bg-card)] rounded-xl border border-dashed border-[var(--border-color)]">
                            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Sem {pageTitle.toLowerCase()}</h3>
                            <p className="text-gray-500 dark:text-gray-400">Adicione um crédito ou financiamento para acompanhar.</p>
                        </div>
                    )}

                    {loans.map(item => {
                        const remainingValue = (item.totalInstallments - item.paidInstallments) * item.installmentValue;
                        const isFinished = item.status === 'finished';

                        return (
                            <div 
                                key={item.id} 
                                onClick={() => handleLoanClick(item)}
                                className={`bg-[var(--bg-card)] p-5 rounded-xl shadow-sm border transition-all relative overflow-hidden group cursor-pointer
                                    ${isFinished 
                                        ? 'border-green-200 dark:border-green-900/30 opacity-80 hover:opacity-100' 
                                        : 'border-[var(--border-color)] hover:border-primary-200 dark:hover:border-primary-800'
                                    }
                                `}
                            >
                                {/* Status Ribbon (Finished) */}
                                {isFinished && (
                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 shadow-sm">
                                        QUITADO
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row justify-between gap-6">
                                    {/* Left Info */}
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={`p-3 rounded-xl shrink-0 ${isFinished ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'}`}>
                                            <Briefcase className="h-6 w-6" />
                                        </div>
                                        <div className="w-full">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg transition-colors">{item.title}</h3>
                                                {item.bank && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-[var(--bg-input)] px-2 py-0.5 rounded-full truncate max-w-[150px]">
                                                        {item.bank}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center">
                                                    {formatCurrency(item.installmentValue)}/mês
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Vence todo dia {item.dueDateDay}
                                                </span>
                                            </div>

                                            {/* Custom Progress Bar */}
                                            <LoanProgressBar total={item.totalInstallments} paid={item.paidInstallments} />
                                        </div>
                                    </div>

                                    {/* Right Info / Actions */}
                                    <div className="flex flex-row sm:flex-col justify-between items-end sm:w-48 shrink-0 gap-2">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Saldo Devedor</p>
                                            <p className={`text-xl font-bold ${isFinished ? 'text-green-500' : 'text-gray-900 dark:text-gray-100'}`}>
                                                {formatCurrency(remainingValue)}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                de {formatCurrency(item.totalValue)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                                                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                                className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <LoanFormModal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)}
                initialData={editingItem}
                onSave={onSave}
                banks={banks}
            />
            
            <LoanDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                loan={selectedLoan}
                onEdit={(item) => {
                    setIsDetailsModalOpen(false);
                    handleEdit(item);
                }}
                onPayInstallment={onPayInstallment}
                formatCurrency={formatCurrency}
            />
        </div>
    );
};
