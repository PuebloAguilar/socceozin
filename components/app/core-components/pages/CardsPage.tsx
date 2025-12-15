import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  CreditCard,
  Calendar,
  X,
  Landmark,
  ShoppingBag,
  Banknote,
  Calculator,
  Check,
  Clock,
  DollarSign
} from "lucide-react";
import { LoanItem } from './LoansPage';

// --- Interfaces ---
export interface Bank {
    id: number;
    name: string;
    color: string;
    icon?: string;
}

export interface CardInstallment {
    id: number;
    store: string;
    current: number;
    total: number;
    amount: number; // Valor da parcela
    totalAmount: number; // Valor total da compra
}

export interface CreditCardItem {
    id: number;
    name: string;
    nickname?: string;
    bankId: number;
    bankName: string;
    brand: string;
    limit: number;
    maxSpend?: number;
    usedLimit: number;
    closingDay: number;
    dueDay: number;
    lastDigits: string;
    installments: CardInstallment[];
}

interface CardsPageProps {
    cards: CreditCardItem[];
    banks: Bank[];
    onSaveCard: (card: CreditCardItem) => void;
    onDeleteCard: (id: number) => void;
    onSaveInstallment: (cardId: number, installment: CardInstallment) => void;
    onPayInstallment: (cardId: number, installmentId: number) => void;
    currency: string;
    isSubPage?: boolean;
}


// --- Components Helper ---

const MiniProgressBar: React.FC<{ total: number; current: number }> = ({ total, current }) => {
    return (
        <div className="flex gap-0.5 w-full mt-1.5">
             {Array.from({ length: total }).map((_, index) => {
                const isPaid = index < current;
                const isCurrent = index === current;
                return (
                    <div
                        key={index}
                        className={`
                            h-1.5 flex-1 first:rounded-l-sm last:rounded-r-sm
                            ${isPaid 
                                ? 'bg-primary-500' 
                                : isCurrent 
                                    ? 'bg-primary-300 dark:bg-primary-800 animate-pulse' 
                                    : 'bg-[var(--color-detail)]'
                            }
                        `}
                    />
                );
            })}
        </div>
    );
};

const InstallmentDetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    installment: CardInstallment | null;
    card: CreditCardItem | null;
    formatCurrency: (value: number) => string;
    onPayInstallment: (cardId: number, installmentId: number) => void;
}> = ({ isOpen, onClose, installment, card, formatCurrency, onPayInstallment }) => {
    if (!isOpen || !installment || !card) return null;

    const isFinished = installment.current >= installment.total;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] transition-opacity duration-300 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--bg-card)] rounded-2xl shadow-xl w-full max-w-2xl relative animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{installment.store}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Parcela {installment.current} de {installment.total} no cartão {card.name}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                    {/* Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Valor da Parcela</p>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatCurrency(installment.amount)}</p>
                        </div>
                         <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Valor Total da Compra</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(installment.totalAmount)}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Progresso</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{installment.current} / {installment.total}</p>
                        </div>
                    </div>

                    {/* Action Pay Button */}
                    {!isFinished && (
                        <div className="p-4 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800 rounded-xl flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-primary-700 dark:text-primary-300">Pagar Parcela Manualmente</h4>
                                <p className="text-xs text-primary-600 dark:text-primary-400">Registrar pagamento da parcela atual ({installment.current + 1})</p>
                            </div>
                            <button 
                                onClick={() => {
                                    if(window.confirm(`Confirmar pagamento manual da parcela de ${formatCurrency(installment.amount)}?`)) {
                                        onPayInstallment(card.id, installment.id);
                                        onClose();
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                            >
                                <DollarSign className="h-4 w-4" />
                                Pagar Agora
                            </button>
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Progresso de Pagamento</h3>
                        <MiniProgressBar total={installment.total} current={installment.current} />
                    </div>

                    {/* Installment List */}
                     <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Detalhes das Parcelas</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                             {Array.from({ length: installment.total }).map((_, index) => {
                                const installmentNumber = index + 1;
                                const isPaid = installmentNumber <= installment.current; // Consider current as paid or pending logic depending on semantics, assuming index based
                                const isCurrent = installmentNumber === installment.current + 1;
                                
                                return (
                                <div key={index} className={`flex justify-between items-center p-3 rounded-md ${
                                    isPaid ? 'bg-green-50 dark:bg-green-900/20 text-gray-500 dark:text-gray-400' : 
                                    'bg-gray-50 dark:bg-gray-800/50'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        {isPaid && <Check className="h-4 w-4 text-green-500" />}
                                        {!isPaid && <Clock className="h-4 w-4 text-gray-400" />}
                                        <p className="font-medium text-gray-800 dark:text-gray-200">Parcela {installmentNumber}</p>
                                    </div>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(installment.amount)}</p>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                 <div className="p-4 border-t border-[var(--border-color)] bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-sm font-medium shadow-sm hover:bg-gray-100 dark:hover:bg-white/5">Fechar</button>
                </div>
            </div>
        </div>
    );
};

const InstallmentFormModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    cards: CreditCardItem[]; 
    onSave: (cardId: number, installment: CardInstallment) => void;
    cardIdContext?: number | null;
    formatCurrency: (value: number) => string;
}> = ({ isOpen, onClose, cards, onSave, cardIdContext, formatCurrency }) => {
    const [cardId, setCardId] = useState('');
    const [store, setStore] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [totalInstallments, setTotalInstallments] = useState('');
    const [currentInstallment, setCurrentInstallment] = useState('1');

    // Reset form
    useEffect(() => {
        if (isOpen) {
            if (cardIdContext) {
                setCardId(String(cardIdContext));
            } else {
                setCardId(cards.length > 0 ? String(cards[0].id) : '');
            }
            setStore('');
            setTotalAmount('');
            setTotalInstallments('');
            setCurrentInstallment('1');
        }
    }, [isOpen, cards, cardIdContext]);

    if (!isOpen) return null;

    const installmentValue = (parseFloat(totalAmount) || 0) / (parseInt(totalInstallments) || 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardId || !store || !totalAmount || !totalInstallments) return;

        const newInstallment: CardInstallment = {
            id: Date.now(), // Simple ID generation
            store,
            totalAmount: parseFloat(totalAmount),
            total: parseInt(totalInstallments),
            current: parseInt(currentInstallment),
            amount: installmentValue
        };

        onSave(Number(cardId), newInstallment);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] transition-opacity duration-300 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--bg-card)] rounded-2xl shadow-xl w-full max-w-md relative animate-in fade-in zoom-in-95 p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                 <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Nova Parcela</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Adicione uma compra parcelada ao cartão.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!cardIdContext && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cartão</label>
                            <select 
                                value={cardId}
                                onChange={(e) => setCardId(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                required
                            >
                                <option value="">Selecione um cartão</option>
                                {cards.map(card => (
                                    <option key={card.id} value={card.id}>{card.name} (Final {card.lastDigits})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estabelecimento / Loja</label>
                        <input 
                            type="text" 
                            value={store}
                            onChange={(e) => setStore(e.target.value)}
                            placeholder="Ex: Magazine Luiza, Amazon..." 
                            className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor Total</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                                placeholder="0,00" 
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                required
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qtd. Parcelas</label>
                             <input 
                                type="number" 
                                min="1"
                                value={totalInstallments}
                                onChange={(e) => setTotalInstallments(e.target.value)}
                                placeholder="10" 
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parcela Atual</label>
                             <input 
                                type="number" 
                                min="1"
                                max={parseInt(totalInstallments) || 100}
                                value={currentInstallment}
                                onChange={(e) => setCurrentInstallment(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Valor da Parcela</label>
                            <div className="w-full p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-semibold border border-transparent">
                                {installmentValue > 0 ? formatCurrency(installmentValue) : formatCurrency(0)}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm mt-2 flex items-center justify-center gap-2">
                        <Plus className="h-4 w-4" />
                        Adicionar Parcela
                    </button>
                </form>
            </div>
        </div>
    );
};

const CardDetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    card: CreditCardItem | null;
    onAddNewInstallment: () => void;
    onInstallmentClick: (installment: CardInstallment) => void;
    formatCurrency: (value: number) => string;
}> = ({ isOpen, onClose, card, onAddNewInstallment, onInstallmentClick, formatCurrency }) => {
    if (!isOpen || !card) return null;

    const { limit = 0, usedLimit = 0 } = card;
    const effectiveMaxSpend = card.maxSpend && card.maxSpend > 0 ? card.maxSpend : limit;

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeWidth = 16;
    
    const usedPercent = limit > 0 ? (usedLimit / limit) * 100 : 0;
    const visualMaxSpendPercent = limit > 0 ? Math.min((effectiveMaxSpend / limit) * 100, 100) : 0;
    const visualUsedPercent = Math.min(usedPercent, 100);
    const usedDash = (visualUsedPercent / 100) * circumference;
    const safeUsedDash = isNaN(usedDash) ? 0 : usedDash;
    const maxSpendAngle = visualMaxSpendPercent * 3.6;
    const isOverLimit = usedLimit > limit;
    const usedAmountColorClass = isOverLimit ? 'text-red-500' : 'text-gray-900 dark:text-gray-100';

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--bg-card)] rounded-2xl shadow-xl w-full max-w-3xl relative transform transition-all duration-300 animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Close Button */}
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{card.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Final •••• {card.lastDigits} • {card.bankName}
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                    
                    <div className="flex flex-col lg:flex-row gap-8 mb-8">
                        {/* Donut Chart Section */}
                        <div className="flex flex-col items-center justify-center shrink-0">
                            <div className="relative w-48 h-48">
                                <svg viewBox="0 0 140 140" className="transform -rotate-90">
                                    <circle cx="70" cy="70" r={radius} fill="transparent" strokeWidth={strokeWidth} className="stroke-gray-200 dark:stroke-gray-800" />
                                    <circle 
                                        cx="70" 
                                        cy="70" 
                                        r={radius} 
                                        fill="transparent" 
                                        strokeWidth={strokeWidth} 
                                        className={`transition-all duration-1000 ease-out ${isOverLimit ? "stroke-red-500" : "stroke-primary-500"}`}
                                        strokeDasharray={`${safeUsedDash} ${circumference}`}
                                        strokeLinecap="round"
                                    />
                                    <line
                                        x1="70"
                                        y1={70 - radius - (strokeWidth / 2)}
                                        x2="70"
                                        y2={70 - radius + (strokeWidth / 2)}
                                        className="stroke-red-500 dark:stroke-red-400"
                                        strokeWidth="3"
                                        strokeLinecap="butt"
                                        style={{ 
                                            transform: `rotate(${maxSpendAngle}deg)`, 
                                            transformOrigin: '70px 70px',
                                            transition: 'transform 1s ease-out'
                                        }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Fatura Atual</span>
                                    <span className={`text-2xl font-bold ${usedAmountColorClass}`}>{formatCurrency(usedLimit)}</span>
                                    <span className={`text-xs font-medium ${isOverLimit ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {usedPercent.toFixed(1)}% usado
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Stats Legend */}
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${isOverLimit ? 'bg-red-500' : 'bg-primary-500'}`}></div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">Fatura Atual</p>
                                </div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(usedLimit)}</p>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-0.5 h-3 bg-red-500 rounded-full"></div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">Seu Gasto Máximo</p>
                                </div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(effectiveMaxSpend)}</p>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">Limite Total</p>
                                </div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(limit)}</p>
                            </div>
                            <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">Limite Disponível</p>
                                <p className={`font-bold ${limit - usedLimit < 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>{formatCurrency(limit - usedLimit)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Installments Section inside Modal */}
                    <div className="bg-primary-50 dark:bg-primary-900/10 rounded-xl p-5 border border-primary-100 dark:border-primary-800/30">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-primary-500" />
                                Parcelas Ativas
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-md">
                                    {card.installments?.length || 0} compras
                                </span>
                                <button 
                                    onClick={onAddNewInstallment}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/80 transition-colors text-xs font-semibold"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Adicionar
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            {card.installments && card.installments.length > 0 ? (
                                card.installments.map(inst => (
                                    <button 
                                        key={inst.id} 
                                        onClick={() => onInstallmentClick(inst)}
                                        className="w-full text-left bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{inst.store}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    Total da compra: {formatCurrency(inst.totalAmount)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(inst.amount)}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1">
                                                    {inst.current}/{inst.total}
                                                </p>
                                            </div>
                                        </div>
                                        <MiniProgressBar total={inst.total} current={inst.current} />
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhuma compra parcelada ativa neste cartão.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CardFormModal: React.FC<{ isOpen: boolean; onClose: () => void; banks: Bank[]; initialData?: CreditCardItem | null; onSave: (card: CreditCardItem) => void }> = ({ isOpen, onClose, banks, initialData, onSave }) => {
    
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [bankId, setBankId] = useState('');
    const [brand, setBrand] = useState('');
    const [lastDigits, setLastDigits] = useState('');
    const [maxSpend, setMaxSpend] = useState('');
    const [limit, setLimit] = useState('');
    const [usedLimit, setUsedLimit] = useState('');
    const [closingDay, setClosingDay] = useState('');
    const [dueDay, setDueDay] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name || '');
                setNickname(initialData.nickname || '');
                setBankId(String(initialData.bankId || ''));
                setBrand(initialData.brand || '');
                setLastDigits(initialData.lastDigits || '');
                setMaxSpend(initialData.maxSpend ? String(initialData.maxSpend) : '');
                setLimit(initialData.limit ? String(initialData.limit) : '');
                setUsedLimit(initialData.usedLimit ? String(initialData.usedLimit) : '');
                setClosingDay(initialData.closingDay ? String(initialData.closingDay) : '');
                setDueDay(initialData.dueDay ? String(initialData.dueDay) : '');
            } else {
                setName('');
                setNickname('');
                setBankId('');
                setBrand('');
                setLastDigits('');
                setMaxSpend('');
                setLimit('');
                setUsedLimit('');
                setClosingDay('');
                setDueDay('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name || !bankId || !limit) {
            alert("Preencha os campos obrigatórios (Nome, Banco e Limite).");
            return;
        }

        const selectedBank = banks.find(b => b.id === Number(bankId));

        const newCard: CreditCardItem = {
            id: initialData?.id || 0,
            name,
            nickname: nickname || undefined,
            bankId: Number(bankId),
            bankName: selectedBank ? selectedBank.name : 'Desconhecido',
            brand: brand || 'Desconhecida',
            limit: parseFloat(limit) || 0,
            maxSpend: maxSpend ? parseFloat(maxSpend) : undefined,
            usedLimit: parseFloat(usedLimit) || 0,
            closingDay: parseInt(closingDay, 10) || 1,
            dueDay: parseInt(dueDay, 10) || 10,
            lastDigits: lastDigits || '0000',
            installments: initialData?.installments || []
        };

        onSave(newCard);
        onClose();
    };

    const formKey = initialData ? `edit-card-${initialData.id}` : 'new-card';

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300" onClick={onClose}>
            <div 
                className="bg-[var(--bg-card)] rounded-lg shadow-xl p-8 w-full max-w-md relative transform transition-all duration-300 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    type="button"
                >
                    <X className="h-6 w-6" />
                </button>
                
                <div className="text-left mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {initialData ? 'Editar Cartão' : 'Novo Cartão'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {initialData ? 'Atualize os dados do cartão de crédito.' : 'Cadastre um novo cartão de crédito.'}
                    </p>
                </div>

                <form key={formKey} onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Cartão <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            id="name" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ex: Nubank Principal" 
                            className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                            required 
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apelido (Opcional)</label>
                        <input 
                            type="text" 
                            id="nickname" 
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            placeholder="Ex: Compras Online" 
                            className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="bankSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Banco <span className="text-red-500">*</span></label>
                            <select 
                                id="bankSelect" 
                                value={bankId}
                                onChange={e => setBankId(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                required
                            >
                                <option value="" disabled>Selecione</option>
                                {banks.map(bank => (
                                    <option key={bank.id} value={bank.id.toString()}>{bank.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bandeira</label>
                            <select 
                                id="brand" 
                                value={brand}
                                onChange={e => setBrand(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                            >
                                <option value="" disabled>Selecione</option>
                                <option value="Mastercard">Mastercard</option>
                                <option value="Visa">Visa</option>
                                <option value="Amex">Amex</option>
                                <option value="Elo">Elo</option>
                                <option value="Hipercard">Hipercard</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="lastDigits" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Final do Cartão</label>
                        <div className="relative flex items-center w-full rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus-within:ring-2 focus-within:ring-primary-500 overflow-hidden">
                            <div className="pl-4 py-2.5 flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm font-mono select-none">
                                <span className="tracking-widest">****</span>
                                <span className="tracking-widest">****</span>
                                <span className="tracking-widest">****</span>
                                <span className="tracking-widest">****</span>
                            </div>
                            <div className="flex-1"></div>
                            <div className="text-gray-300 dark:text-gray-600 select-none text-lg font-light pb-0.5 px-2">|</div>
                            <input 
                                type="text" 
                                inputMode="numeric"
                                id="lastDigits" 
                                maxLength={4}
                                placeholder="0000" 
                                value={lastDigits}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setLastDigits(val);
                                }}
                                className="w-24 p-2.5 bg-transparent border-none outline-none text-sm font-mono text-gray-900 dark:text-gray-100 tracking-widest text-center placeholder-gray-400 dark:placeholder-gray-600"
                            />
                        </div>
                    </div>

                     <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="limit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Limite Total <span className="text-red-500">*</span></label>
                            <input 
                                type="number" 
                                id="limit" 
                                placeholder="0,00" 
                                value={limit}
                                onChange={e => setLimit(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="maxSpend" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teto de Gastos</label>
                            <input 
                                type="number" 
                                id="maxSpend" 
                                placeholder="Opcional" 
                                value={maxSpend}
                                onChange={e => setMaxSpend(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                            />
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="usedLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fatura Atual</label>
                        <input 
                            type="number" 
                            id="usedLimit" 
                            placeholder="0,00" 
                            value={usedLimit}
                            onChange={e => setUsedLimit(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                        />
                         <p className="text-xs text-gray-500 mt-1">Simule o valor já gasto para visualizar os gráficos em ação.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label htmlFor="closingDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dia Fechamento</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="31" 
                                id="closingDay" 
                                placeholder="Dia" 
                                value={closingDay}
                                onChange={e => setClosingDay(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                            />
                        </div>
                        <div>
                            <label htmlFor="dueDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dia Vencimento</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="31" 
                                id="dueDay" 
                                placeholder="Dia" 
                                value={dueDay}
                                onChange={e => setDueDay(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900">
                        {initialData ? 'Salvar Alterações' : 'Salvar Cartão'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export const CardsPage: React.FC<CardsPageProps> = ({ cards, banks, onSaveCard, onDeleteCard, onSaveInstallment, onPayInstallment, currency, isSubPage = false }) => {
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<CreditCardItem | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedCardForDetails, setSelectedCardForDetails] = useState<CreditCardItem | null>(null);
    const [isInstallmentDetailsModalOpen, setIsInstallmentDetailsModalOpen] = useState(false);
    const [selectedInstallment, setSelectedInstallment] = useState<CardInstallment | null>(null);
    const [cardIdForNewInstallment, setCardIdForNewInstallment] = useState<number | null>(null);

    useEffect(() => {
        if (selectedCardForDetails) {
            const updatedCard = cards.find(c => c.id === selectedCardForDetails.id);
            if (updatedCard && JSON.stringify(updatedCard) !== JSON.stringify(selectedCardForDetails)) {
                setSelectedCardForDetails(updatedCard);
            } else if (!updatedCard) {
                setIsDetailsModalOpen(false);
                setSelectedCardForDetails(null);
            }
        }
    }, [cards, selectedCardForDetails]);

    useEffect(() => {
         if (selectedInstallment && selectedCardForDetails) {
             const updatedCard = cards.find(c => c.id === selectedCardForDetails.id);
             if(updatedCard) {
                const updatedInstallment = updatedCard.installments.find(i => i.id === selectedInstallment.id);
                if (updatedInstallment && JSON.stringify(updatedInstallment) !== JSON.stringify(selectedInstallment)) {
                    setSelectedInstallment(updatedInstallment);
                } else if (!updatedInstallment) {
                    setIsInstallmentDetailsModalOpen(false);
                    setSelectedInstallment(null);
                }
             }
         }
    }, [cards, selectedInstallment, selectedCardForDetails]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency }).format(val);

    // --- INTERACTION HANDLERS ---
    const handleCardClick = (card: CreditCardItem) => {
        const freshCard = cards.find(c => c.id === card.id) || card;
        setSelectedCardForDetails(freshCard);
        setIsDetailsModalOpen(true);
    };

    const handleEditCard = (card: CreditCardItem) => {
        setEditingCard(card);
        setIsCardModalOpen(true);
    };

    const handleNewCard = () => {
        setEditingCard(null);
        setIsCardModalOpen(true);
    };
    
    const handleAddNewInstallmentFromDetails = () => {
        if (selectedCardForDetails) {
            setCardIdForNewInstallment(selectedCardForDetails.id);
            setIsInstallmentModalOpen(true);
        }
    };
    
    const handleInstallmentClick = (installment: CardInstallment) => {
        setSelectedInstallment(installment);
        setIsInstallmentDetailsModalOpen(true);
    };

    const containerClass = isSubPage 
        ? "w-full pr-2" 
        : "h-[calc(100vh-9rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 pr-2 pb-4";

    return (
        <div className={containerClass}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Cartões</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie seus cartões de crédito e visualize suas faturas.</p>
                </div>
            </div>

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-end gap-3">
                     <button 
                        onClick={() => {
                            setCardIdForNewInstallment(null);
                            setIsInstallmentModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-gray-700 dark:text-gray-200 hover:bg-[var(--bg-input)] transition-colors text-sm font-medium shadow-sm"
                    >
                        <ShoppingBag className="h-4 w-4 text-primary-500" />
                        Nova Parcela
                    </button>
                     <button 
                        onClick={handleNewCard}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Novo Cartão
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {cards.length === 0 && (
                        <div className="text-center py-10 bg-[var(--bg-card)] rounded-xl border border-dashed border-[var(--border-color)]">
                            <CreditCard className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 dark:text-gray-400">Nenhum cartão cadastrado.</p>
                        </div>
                    )}
                    {cards.map(card => {
                         const bank = banks.find(b => b.id === card.bankId);
                         const bankColor = bank?.color || 'bg-gray-500';
                         const bankName = bank?.name || card.bankName || 'Banco Excluído';
                         const effectiveMaxSpend = card.maxSpend && card.maxSpend > 0 ? card.maxSpend : card.limit;
                         
                         const usedPercent = card.limit > 0 ? (card.usedLimit / card.limit) * 100 : 0;
                         const maxSpendPercent = card.limit > 0 ? (effectiveMaxSpend / card.limit) * 100 : 100;
                         const bluePartWidth = Math.min(usedPercent, maxSpendPercent);
                         const redPartWidth = usedPercent > maxSpendPercent ? Math.min(usedPercent - maxSpendPercent, 100 - maxSpendPercent) : 0;
                         const isOverTotalLimit = usedPercent > 100;
                         const activeInstallmentsCount = card.installments?.length || 0;

                         return (
                            <div key={card.id} onClick={() => handleCardClick(card)} className="group bg-[var(--bg-card)] p-5 rounded-xl shadow-sm border border-[var(--border-color)] transition-all relative overflow-hidden cursor-pointer hover:border-primary-200 dark:hover:border-primary-800">
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${bankColor}`}></div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pl-2">
                                    <div className="flex items-start gap-4 w-full sm:w-auto flex-grow">
                                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shrink-0">
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{card.name}</h3>
                                                {card.nickname && (
                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                        {card.nickname}
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto sm:ml-0">
                                                    Terminado em •••• {card.lastDigits}
                                                </span>
                                            </div>
                                            
                                            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                 <span className="flex items-center gap-1">
                                                    <Landmark className="h-3 w-3" />
                                                    {bankName}
                                                </span>
                                                <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Fecha dia {card.closingDay}
                                                </span>
                                                
                                                {activeInstallmentsCount > 0 && (
                                                    <>
                                                        <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
                                                        <span className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-1.5 py-0.5 rounded-md">
                                                            <ShoppingBag className="h-3 w-3" />
                                                            {activeInstallmentsCount} parcelas
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-2/5 xl:w-1/3 shrink-0">
                                        <div className="grid grid-cols-3 items-baseline text-xs mb-1">
                                            <div className="text-left">
                                                <span className="text-gray-500 dark:text-gray-400">Fatura: <span className={`font-semibold ${isOverTotalLimit ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'}`}>{formatCurrency(card.usedLimit)}</span></span>
                                            </div>
                                            <div className="text-center">
                                                <span className="text-gray-500 dark:text-gray-400" title="Seu gasto máximo definido">
                                                    Máx: <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(effectiveMaxSpend)}</span>
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-gray-400 dark:text-gray-500">Limite: {formatCurrency(card.limit)}</span>
                                            </div>
                                        </div>
                                        <div className="relative h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="absolute h-full bg-primary-500 rounded-l-full transition-all duration-500"
                                                style={{ width: `${Math.min(bluePartWidth, 100)}%` }}
                                            />
                                            
                                            {redPartWidth > 0 && (
                                                <div
                                                    className="absolute h-full bg-red-500 transition-all duration-500"
                                                    style={{ left: `${maxSpendPercent}%`, width: `${redPartWidth}%` }}
                                                />
                                            )}

                                            {maxSpendPercent <= 100 && (
                                                <div
                                                    className="absolute top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-600 z-10"
                                                    style={{ left: `calc(${maxSpendPercent}% - 1px)` }}
                                                    title={`Teto: ${formatCurrency(effectiveMaxSpend)}`}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 w-full sm:w-auto justify-end sm:border-l sm:border-[var(--border-color)] sm:pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleEditCard(card); }}
                                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors" 
                                            title="Editar"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onDeleteCard(card.id); }}
                                            className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" 
                                            title="Excluir"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                         );
                    })}
                </div>
            </div>
            
            <CardFormModal 
                isOpen={isCardModalOpen} 
                onClose={() => setIsCardModalOpen(false)}
                banks={banks}
                initialData={editingCard}
                onSave={onSaveCard}
            />

            <InstallmentFormModal 
                isOpen={isInstallmentModalOpen}
                onClose={() => {
                    setIsInstallmentModalOpen(false);
                    setCardIdForNewInstallment(null);
                }}
                cards={cards}
                onSave={onSaveInstallment}
                cardIdContext={cardIdForNewInstallment}
                formatCurrency={formatCurrency}
            />

            <CardDetailsModal 
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                card={selectedCardForDetails}
                onAddNewInstallment={handleAddNewInstallmentFromDetails}
                onInstallmentClick={handleInstallmentClick}
                formatCurrency={formatCurrency}
            />

            <InstallmentDetailsModal
                isOpen={isInstallmentDetailsModalOpen}
                onClose={() => setIsInstallmentDetailsModalOpen(false)}
                installment={selectedInstallment}
                card={selectedCardForDetails}
                formatCurrency={formatCurrency}
                onPayInstallment={onPayInstallment}
            />
        </div>
    );
};