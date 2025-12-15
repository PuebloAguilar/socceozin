
import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Search,
  Edit3,
  X,
  Filter,
  ChevronDown,
  Calendar,
  CreditCard,
  Tag,
  FileText,
  Landmark,
  Target,
  Lightbulb
} from "lucide-react";
import { StatCard } from '../ui/StatCard';
import { CreditCardItem } from './CardsPage';
import { SmartForecastWidget } from '../ui/SmartForecastWidget';
import { Meta } from '../../types';

// Interface para tipagem
export interface Transaction {
    id: number;
    name: string;
    category: string;
    date: string;
    details: string;
    amount: number;
    type: 'income' | 'expense';
    status: 'completed' | 'pending';
    paymentMethod: string;
    bank: string;
    cardId?: number;
}

interface Bank {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface TransactionsContentProps {
    transactions: Transaction[];
    availableBanks: Bank[];
    categories: Category[];
    cards: CreditCardItem[];
    onSaveTransaction: (data: Transaction) => void;
    onDeleteTransaction: (id: number) => void;
    onDeleteAllTransactions: () => void;
    currency: string;
    okrs?: Meta[];
}

const TransactionItem: React.FC<{ 
    transaction: Transaction; 
    onClick: () => void;
    onEdit: (t: Transaction) => void;
    onDelete: (id: number) => void;
    formatCurrency: (value: number) => string;
}> = ({ transaction, onClick, onEdit, onDelete, formatCurrency }) => {
    const isExpense = transaction.type === 'expense';
    const amountColor = isExpense ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
    const tagColor = isExpense ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    const Icon = isExpense ? TrendingDown : TrendingUp;
    const iconContainerColor = isExpense ? 'bg-red-100 dark:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/50';
    const iconColor = isExpense ? 'text-red-500' : 'text-green-500';

    return (
        <div 
            onClick={onClick}
            className="group bg-[var(--bg-card)] p-4 rounded-lg shadow-sm flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 cursor-pointer hover:shadow-md transition-all border border-[var(--border-color)] hover:border-primary-200 dark:hover:border-primary-800"
        >
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${iconContainerColor}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">{transaction.name}</h4>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagColor}`}>
                            {isExpense ? 'despesa' : 'receita'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {transaction.category}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {transaction.date}
                        </span>
                        <span className="flex items-center gap-1">
                            <Landmark className="h-3 w-3" />
                            {transaction.bank}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-center">
                <p className={`font-bold text-lg ${amountColor}`}>
                    {isExpense ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                </p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(transaction); }} 
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                        title="Editar"
                    >
                        <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(transaction.id); }} 
                        className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        title="Excluir"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const TransactionDetailsModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    transaction: Transaction | null;
    cards: CreditCardItem[];
    onEdit: (t: Transaction) => void;
    formatCurrency: (value: number) => string;
}> = ({ isOpen, onClose, transaction, cards, onEdit, formatCurrency }) => {
    if (!isOpen || !transaction) return null;

    const isExpense = transaction.type === 'expense';
    const card = transaction.cardId ? cards.find(c => c.id === transaction.cardId) : null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300 p-4">
            <div 
                className="bg-[var(--bg-card)] rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`h-24 ${isExpense ? 'bg-red-500' : 'bg-green-500'} flex items-center justify-center relative`}>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="text-center text-white">
                         <p className="opacity-90 text-sm font-medium uppercase tracking-wide">Valor Total</p>
                         <h2 className="text-4xl font-bold mt-1">
                            {isExpense ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                         </h2>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 bg-[var(--bg-card)]">
                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Estabelecimento / Descrição</p>
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{transaction.name}</h3>
                            </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                <Calendar className="h-4 w-4" />
                                Data
                            </div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.date}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                <Tag className="h-4 w-4" />
                                Categoria
                            </div>
                             <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.category}</p>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                <CreditCard className="h-4 w-4" />
                                Método
                            </div>
                             <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.paymentMethod}</p>
                        </div>

                        {transaction.paymentMethod === 'Cartão de Crédito' && card && (
                          <div className="space-y-1">
                              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                  <CreditCard className="h-4 w-4" />
                                  Cartão Utilizado
                              </div>
                               <p className="font-medium text-gray-900 dark:text-gray-100">{card.name} (Final {card.lastDigits})</p>
                          </div>
                        )}
                    </div>
                     <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                            <FileText className="h-4 w-4" />
                            Detalhes
                        </div>
                         <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{transaction.details || 'Sem detalhes adicionais.'}</p>
                    </div>
                </div>

                {/* Footer - Same Tone as Body */}
                <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex gap-3 justify-end">
                     <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                     >
                        Fechar
                     </button>
                     <button 
                        onClick={() => {
                            onEdit(transaction);
                        }}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-2"
                    >
                        <Edit3 className="h-4 w-4" />
                        Editar
                     </button>
                </div>
            </div>
        </div>
    );
};

const TransactionFormModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    initialData?: Transaction | null;
    availableBanks: Bank[];
    categories: Category[];
    cards: CreditCardItem[];
    onSave: (data: Transaction) => void;
}> = ({ isOpen, onClose, initialData, availableBanks, categories, cards, onSave }) => {
  
  // Estados do formulário
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bank, setBank] = useState('');
  const [date, setDate] = useState('');
  const [details, setDetails] = useState('');
  const [cardId, setCardId] = useState<string>('');

  // Converter data DD/MM/AAAA para AAAA-MM-DD
  const dateToInput = (dateStr: string) => {
      if (!dateStr) return '';
      const parts = dateStr.split('/');
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
      return '';
  };

  // Converter input AAAA-MM-DD para DD/MM/AAAA
  const inputToDate = (inputStr: string) => {
      if (!inputStr) return '';
      const parts = inputStr.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return '';
  };

  // Resetar ou preencher formulário ao abrir
  useEffect(() => {
      if (isOpen) {
          if (initialData) {
              setType(initialData.type);
              setAmount(initialData.amount.toString());
              setName(initialData.name);
              setCategory(initialData.category);
              setPaymentMethod(initialData.paymentMethod);
              setBank(initialData.bank);
              setDate(dateToInput(initialData.date));
              setDetails(initialData.details || '');
              setCardId(initialData.cardId?.toString() || '');
          } else {
              // Padrões para nova transação
              setType('expense');
              setAmount('');
              setName('');
              setCategory('');
              setPaymentMethod('');
              setBank('');
              setDate(new Date().toISOString().split('T')[0]); // Hoje
              setDetails('');
              setCardId('');
          }
      }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const transactionData: Transaction = {
          id: initialData?.id || 0,
          name,
          amount: parseFloat(amount) || 0,
          type,
          category: category || 'Outros',
          paymentMethod: paymentMethod || 'Outros',
          bank: bank || 'N/A',
          date: inputToDate(date),
          details,
          status: initialData?.status || 'completed',
          cardId: cardId ? Number(cardId) : undefined,
      };

      onSave(transactionData);
      onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 p-4">
      <div 
        className="bg-[var(--bg-card)] rounded-xl shadow-xl w-full max-w-md relative flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Fixo */}
        <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-start shrink-0 bg-gray-50/50 dark:bg-gray-900">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {initialData ? 'Editar Transação' : 'Nova Transação'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {initialData ? 'Atualize os dados.' : 'Preencha os detalhes abaixo.'}
                </p>
            </div>
            <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Fechar modal"
            >
            <X className="h-5 w-5" />
            </button>
        </div>
        
        {/* Corpo Scrollável */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            <form id="transaction-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="type" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                        <select 
                            id="type" 
                            value={type}
                            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                            className="w-full p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        >
                            <option value="income">Receita</option>
                            <option value="expense">Despesa</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Valor</label>
                        <input 
                            type="number" 
                            id="amount" 
                            placeholder="0.00" 
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm font-medium" 
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição / Estabelecimento</label>
                    <input 
                        type="text" 
                        id="name" 
                        placeholder="Ex: Supermercado, Salário..." 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                        required
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                    <select 
                        id="category" 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        required
                    >
                        <option value="" disabled>Selecione</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="paymentMethod" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Método de Pagamento</label>
                    <select 
                        id="paymentMethod" 
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        required
                    >
                        <option value="" disabled>Selecione</option>
                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                        <option value="Cartão de Débito">Cartão de Débito</option>
                        <option value="Pix">Pix</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Transferência Bancária">Transferência Bancária</option>
                        <option value="Boleto">Boleto</option>
                    </select>
                </div>

                {paymentMethod === 'Cartão de Crédito' && (
                    <div>
                        <label htmlFor="cardId" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Cartão</label>
                        <select
                            id="cardId"
                            value={cardId}
                            onChange={(e) => setCardId(e.target.value)}
                            className="w-full p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        >
                            <option value="">Selecione um cartão</option>
                            {cards.map(c => <option key={c.id} value={c.id}>{c.name} (Final {c.lastDigits})</option>)}
                        </select>
                    </div>
                )}


                <div>
                    <label htmlFor="bank" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Banco / Instituição</label>
                    <select 
                        id="bank" 
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className="w-full p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        required
                    >
                        <option value="" disabled>Selecione</option>
                        {availableBanks.map(b => (
                            <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label htmlFor="date" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Data</label>
                    <input 
                        type="date" 
                        id="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm dark:[color-scheme:dark]" 
                        required
                    />
                </div>

                <div>
                    <label htmlFor="details" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Detalhes (Opcional)</label>
                    <textarea 
                        id="details" 
                        rows={2} 
                        placeholder="Informações adicionais..." 
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full p-2 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm resize-none"
                    ></textarea>
                </div>
            </form>
        </div>

        {/* Footer Fixo */}
        <div className="p-4 border-t border-[var(--border-color)] shrink-0 bg-gray-50/50 dark:bg-gray-900">
            <button 
                type="submit" 
                form="transaction-form"
                className="w-full py-2.5 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 text-sm"
            >
            {initialData ? 'Salvar Alterações' : 'Adicionar Transação'}
            </button>
        </div>
      </div>
    </div>
  );
};

export const TransactionsContent: React.FC<TransactionsContentProps> = ({
    transactions,
    availableBanks,
    categories,
    cards,
    onSaveTransaction,
    onDeleteTransaction,
    onDeleteAllTransactions,
    currency,
    okrs = []
}) => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const handleTransactionClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDetailsModalOpen(true);
    };

    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsDetailsModalOpen(false);
        setIsFormModalOpen(true);
    };

    const handleNewTransaction = () => {
        setEditingTransaction(null);
        setIsFormModalOpen(true);
    };

    const sortedTransactions = useMemo(() => {
      return [...transactions].sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
        const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
        return dateB - dateA;
      });
    }, [transactions]);

    // Only calculate totals from the current transactions list (Isolated View)
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const balance = totalIncome - totalExpense;

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency }).format(val);

    // --- OKR Integration: Burn Rate / Management ---
    const managementOkr = okrs.find(o => o.area === 'management');
    const expensesKR = managementOkr?.keyResults.find(kr => 
        kr.unit === 'R$' && (kr.description.toLowerCase().includes('despesa') || kr.description.toLowerCase().includes('custo') || kr.description.toLowerCase().includes('burn'))
    );
    const monthlyBudget = expensesKR ? expensesKR.target : 50000; // Default budget

    const getBurnRateForecast = () => {
        // Calculate current monthly expense (Approx)
        const today = new Date();
        const currentMonthTransactions = transactions.filter(t => {
            const [d, m, y] = t.date.split('/');
            return parseInt(m) === today.getMonth() + 1 && parseInt(y) === today.getFullYear() && t.type === 'expense';
        });
        const currentMonthExpense = currentMonthTransactions.reduce((acc, t) => acc + t.amount, 0);

        if (currentMonthExpense > monthlyBudget) {
             return {
                forceColor: 'red' as 'red',
                customTitle: "Orçamento Estourado (OKR)",
                customText: `Você já gastou ${formatCurrency(currentMonthExpense)}, ultrapassando a meta de ${formatCurrency(monthlyBudget)} definida no OKR de Gestão.`,
                nextStep: "Pausar novos gastos variáveis não essenciais e revisar contratos de fornecedores."
            };
        }
        if (currentMonthExpense > monthlyBudget * 0.8) {
             return {
                forceColor: 'neutral' as 'neutral',
                customTitle: "Atenção ao Orçamento",
                customText: `Você atingiu 80% do teto de gastos definido no OKR. Restam ${formatCurrency(monthlyBudget - currentMonthExpense)}.`,
                nextStep: "Monitorar gastos diários para garantir que o fechamento fique dentro da meta do KR."
            };
        }
        return {
            forceColor: 'green' as 'green',
            customTitle: "Burn Rate Controlado",
            customText: `Gastos dentro da meta do OKR. Você tem uma margem de ${formatCurrency(monthlyBudget - currentMonthExpense)}.`,
            nextStep: "Manter o controle e avaliar possibilidade de realocar a sobra para KRs de investimento."
        };
    };

    return (
        <div className="h-[calc(100vh-9rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 pr-2 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Transações</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie suas receitas e despesas</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={onDeleteAllTransactions}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
                    >
                        <Trash2 className="h-4 w-4" />
                        Remover Todas
                    </button>
                    <button 
                        onClick={handleNewTransaction}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Nova Transação
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total Receitas" amount={formatCurrency(totalIncome)} Icon={TrendingUp} iconColor="text-green-500" borderColor="border-green-500" amountColor="text-green-600 dark:text-green-400" />
                <StatCard title="Total Despesas" amount={formatCurrency(totalExpense)} Icon={TrendingDown} iconColor="text-red-500" borderColor="border-red-500" amountColor="text-red-600 dark:text-red-400" />
                <StatCard title="Saldo Líquido" amount={formatCurrency(balance)} Icon={DollarSign} iconColor="text-primary-500" borderColor="border-primary-500" amountColor={balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"} />
            </div>

            {/* OKR-Based Forecast Widget */}
            <div className="mb-6">
                <SmartForecastWidget {...getBurnRateForecast()} />
            </div>

            <div className="bg-[var(--bg-card)] p-4 rounded-lg shadow-sm border border-[var(--border-color)]">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="relative w-full sm:max-w-xs">
                        <input type="text" placeholder="Pesquisar por estabelecimento..." className="w-full p-2 pl-10 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <button className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Filter className="h-4 w-4" />
                            Todos os tipos
                            <ChevronDown className="h-4 w-4" />
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            Todas categorias
                            <ChevronDown className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 space-y-3">
                {transactions.length === 0 && (
                    <div className="text-center py-10 bg-[var(--bg-card)] rounded-xl border border-dashed border-[var(--border-color)]">
                        <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">Nenhuma transação encontrada.</p>
                    </div>
                )}
                {sortedTransactions.map(tx => (
                    <TransactionItem 
                        key={tx.id} 
                        transaction={tx} 
                        onClick={() => handleTransactionClick(tx)}
                        onEdit={handleEditTransaction}
                        onDelete={onDeleteTransaction}
                        formatCurrency={formatCurrency}
                    />
                ))}
            </div>

            <TransactionFormModal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)} 
                initialData={editingTransaction}
                availableBanks={availableBanks}
                categories={categories}
                cards={cards}
                onSave={onSaveTransaction}
            />

            <TransactionDetailsModal 
                isOpen={isDetailsModalOpen} 
                onClose={() => setIsDetailsModalOpen(false)} 
                transaction={selectedTransaction}
                cards={cards}
                onEdit={handleEditTransaction}
                formatCurrency={formatCurrency}
            />
        </div>
    );
};
