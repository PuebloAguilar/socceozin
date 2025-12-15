
import React, { useRef, useState } from 'react';
import { BanksPage, Bank } from './BanksPage';
import { CardsPage, CreditCardItem, CardInstallment } from './CardsPage';
import { LoansPage, LoanItem } from './LoansPage';
import { Landmark, CreditCard, Briefcase } from 'lucide-react';
import { Transaction } from './TransactionsContent';

interface WalletsContentProps {
    banks: Bank[];
    cards: CreditCardItem[];
    loans: LoanItem[];
    transactions: Transaction[]; // Received to help with projections if needed, mostly for consistency
    onSaveBank: (bank: Bank) => void;
    onDeleteBank: (id: number) => void;
    onSaveCard: (card: CreditCardItem) => void;
    onDeleteCard: (id: number) => void;
    onSaveInstallment: (cardId: number, installment: CardInstallment) => void;
    onPayInstallment: (cardId: number, installmentId: number) => void;
    onSaveLoan: (item: LoanItem) => void;
    onDeleteLoan: (id: number) => void;
    onPayLoanInstallment: (loanId: number) => void;
    currency: string;
    accountType: 'personal' | 'business';
}

export const WalletsContent: React.FC<WalletsContentProps> = ({
    banks,
    cards,
    loans,
    transactions,
    onSaveBank,
    onDeleteBank,
    onSaveCard,
    onDeleteCard,
    onSaveInstallment,
    onPayInstallment,
    onSaveLoan,
    onDeleteLoan,
    onPayLoanInstallment,
    currency,
    accountType
}) => {
    // Refs para scroll
    const banksRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const loansRef = useRef<HTMLDivElement>(null);

    const [activeSection, setActiveSection] = useState<'banks' | 'cards' | 'loans'>('banks');

    const scrollToSection = (section: 'banks' | 'cards' | 'loans') => {
        setActiveSection(section);
        let ref = banksRef;
        if (section === 'cards') ref = cardsRef;
        if (section === 'loans') ref = loansRef;

        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="flex flex-col h-full bg-[var(--bg-right)]">
            <div className="h-[calc(100vh-9rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 pb-12">
                
                {/* Header Integrado (Não Fixo) */}
                <div className="px-6 pt-2 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Minhas Carteiras</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Visão integrada de ativos e passivos.</p>
                    </div>

                    {/* Seletor de Navegação */}
                    <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-[var(--border-color)] self-start md:self-center">
                        <button
                            onClick={() => scrollToSection('banks')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeSection === 'banks' ? 'bg-white dark:bg-[var(--bg-card)] shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        >
                            <Landmark className="h-4 w-4" />
                            Bancos
                        </button>
                        <button
                            onClick={() => scrollToSection('cards')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeSection === 'cards' ? 'bg-white dark:bg-[var(--bg-card)] shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        >
                            <CreditCard className="h-4 w-4" />
                            Cartões
                        </button>
                        <button
                            onClick={() => scrollToSection('loans')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeSection === 'loans' ? 'bg-white dark:bg-[var(--bg-card)] shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        >
                            <Briefcase className="h-4 w-4" />
                            {accountType === 'business' ? 'Créditos' : 'Empréstimos'}
                        </button>
                    </div>
                </div>

                <div className="px-6 space-y-12">
                    
                    <section ref={banksRef} className="scroll-mt-6">
                        <BanksPage 
                            banks={banks} 
                            cards={cards} 
                            loans={loans} 
                            onSaveBank={onSaveBank} 
                            onDeleteBank={onDeleteBank} 
                            isSubPage={true}
                        />
                    </section>
                    
                    <div className="border-t border-[var(--border-color)]"></div>

                    <section ref={cardsRef} className="scroll-mt-6">
                        <CardsPage 
                            cards={cards} 
                            banks={banks} 
                            onSaveCard={onSaveCard} 
                            onDeleteCard={onDeleteCard} 
                            onSaveInstallment={onSaveInstallment} 
                            onPayInstallment={onPayInstallment}
                            currency={currency} 
                            isSubPage={true}
                        />
                    </section>

                    <div className="border-t border-[var(--border-color)]"></div>

                    <section ref={loansRef} className="scroll-mt-6">
                        <LoansPage 
                            loans={loans} 
                            banks={banks}
                            onSave={onSaveLoan} 
                            onDelete={onDeleteLoan} 
                            onPayInstallment={onPayLoanInstallment}
                            pageTitle={accountType === 'business' ? 'Créditos' : 'Empréstimos'}
                            currency={currency} 
                            isSubPage={true}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
};
