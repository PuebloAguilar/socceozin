
import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  BarChart3,
  PanelLeft,
  Bell,
  Settings,
  User,
  LucideIcon,
  Wallet,
  ArrowRightLeft,
  Folder,
  FileText,
  Calendar,
  ChevronDown,
  CreditCard,
  Clock,
  X,
  Bot,
  Send,
  Landmark,
  Briefcase,
  ChevronsUpDown,
  LogOut,
  FileCheck,
  Building2,
  Sparkles,
  Map,
  Layout
} from "lucide-react";
import { DashboardContent } from "../pages/DashboardContent";
import { TransactionsContent, Transaction } from "../pages/TransactionsContent";
import { CategoriesContent } from "../pages/CategoriesContent";
import { ReportsContent } from "../pages/ReportsContent";
import { MetricsContent } from "../pages/MetricsContent";
import { AppointmentsContent } from "../pages/AppointmentsContent";
import { SettingsContent, LogoutSettings, PRESET_THEMES } from "../pages/SettingsContent";
import { AgentsContent } from "../pages/AgentsContent";
import { CardsPage, CreditCardItem, CardInstallment } from '../pages/CardsPage';
import { LoanItem } from '../pages/LoansPage';
import { BanksPage, Bank } from '../pages/BanksPage';
import { HelpContent } from '../pages/HelpContent';
import { PlaceholderContent } from './PlaceholderContent';
import { WalletsContent } from '../pages/WalletsContent';
import { OpportunitiesContent, Deal, initialDeals } from '../pages/OpportunitiesContent';
import { ContractsContent, Contract, initialContracts } from '../pages/ContractsContent';
import { PlanningContent } from '../pages/PlanningContent';
import { WorkspaceContent } from '../pages/WorkspaceContent';
import { Meta } from "../../types";

interface OptionProps {
  Icon: LucideIcon;
  title: string;
  selected: string;
  setSelected: (title: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  notifs?: number;
  badge?: string;
}

interface TitleSectionProps {
  open: boolean;
}

interface ExampleContentProps {
  colorMode: 'light' | 'dark' | 'system';
  setColorMode: (mode: 'light' | 'dark' | 'system') => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  currentTheme: string;
  setCurrentTheme: (themeId: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: string;
  setSelected: (title: string) => void;
  isDark: boolean; 
  accountType: 'personal' | 'business';
  setAccountType: (type: 'personal' | 'business') => void;
  userName: string;
  setUserName: (name: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  onLogout: () => void;
  extraContext?: any;
  metas?: Meta[];
  onUpdateMetas?: (metas: Meta[]) => void;
}

const colorThemes = {
    blue: {
        '--color-primary-50': '239 246 255',
        '--color-primary-100': '219 234 254',
        '--color-primary-200': '191 219 254',
        '--color-primary-300': '147 197 253',
        '--color-primary-400': '96 165 250',
        '--color-primary-500': '59 130 246',
        '--color-primary-600': '37 99 235',
        '--color-primary-700': '29 78 216',
        '--color-primary-800': '30 64 175',
        '--color-primary-900': '30 58 138',
        '--color-primary-950': '23 37 84',
    },
    tango: {
        '--color-primary-50': '254 242 242',
        '--color-primary-100': '254 226 226',
        '--color-primary-200': '254 202 202',
        '--color-primary-300': '248 113 113',
        '--color-primary-400': '248 113 113',
        '--color-primary-500': '220 38 38', 
        '--color-primary-600': '185 28 28',
        '--color-primary-700': '153 27 27',
        '--color-primary-800': '127 29 29',
        '--color-primary-900': '69 10 10',
        '--color-primary-950': '69 10 10',
    },
    emerald: {
        '--color-primary-50': '236 253 245',
        '--color-primary-100': '209 250 229',
        '--color-primary-200': '167 243 208',
        '--color-primary-300': '110 231 183',
        '--color-primary-400': '52 211 153',
        '--color-primary-500': '16 185 129',
        '--color-primary-600': '5 150 105',
        '--color-primary-700': '4 120 87',
        '--color-primary-800': '6 95 70',
        '--color-primary-900': '6 78 59',
        '--color-primary-950': '2 44 34',
    },
    violet: {
        '--color-primary-50': '245 243 255',
        '--color-primary-100': '237 233 254',
        '--color-primary-200': '221 214 254',
        '--color-primary-300': '196 181 253',
        '--color-primary-400': '167 139 250',
        '--color-primary-500': '139 92 246',
        '--color-primary-600': '124 58 237',
        '--color-primary-700': '109 40 217',
        '--color-primary-800': '91 33 182',
        '--color-primary-900': '76 29 149',
        '--color-primary-950': '46 16 101',
    },
    gold: {
        '--color-primary-50': '254 252 232',
        '--color-primary-100': '255 247 205',
        '--color-primary-200': '254 236 152',
        '--color-primary-300': '253 218 109',
        '--color-primary-400': '251 191 36', 
        '--color-primary-500': '240 164 66',
        '--color-primary-600': '217 119 6',
        '--color-primary-700': '180 83 9',
        '--color-primary-800': '146 64 14',
        '--color-primary-900': '120 53 15',
        '--color-primary-950': '69 26 3',
    },
    green: {
        '--color-primary-50': '220 252 231',
        '--color-primary-100': '220 252 231',
        '--color-primary-200': '187 247 208',
        '--color-primary-300': '134 239 172',
        '--color-primary-400': '74 222 128',
        '--color-primary-500': '0 200 83', 
        '--color-primary-600': '22 163 74',
        '--color-primary-700': '21 128 61',
        '--color-primary-800': '22 101 52',
        '--color-primary-900': '20 83 45',
        '--color-primary-950': '5 46 22',
    }
};

interface DashboardPageProps {
  onLogout: () => void;
  onUpdateMetas: (metas: Meta[]) => void;
  initialConfig?: {
      userName: string;
      companyName: string;
      accountType: 'personal' | 'business';
      colorMode: 'light' | 'dark' | 'system';
      accentColor: string;
      currentTheme: string;
      currency: string;
      nicho?: string;
      area_maior_incomodo?: string;
      nome_preferido?: string;
      metas?: Meta[];
  };
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout, initialConfig, onUpdateMetas }) => {
  const [colorMode, setColorMode] = useState<'light' | 'dark' | 'system'>(initialConfig?.colorMode || 'dark');
  const [isDark, setIsDark] = useState(true); 
  const [accentColor, setAccentColor] = useState(initialConfig?.accentColor || 'green');
  const [currentTheme, setCurrentTheme] = useState<string>(initialConfig?.currentTheme || 'default');
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const [accountType, setAccountType] = useState<'personal' | 'business'>(initialConfig?.accountType || 'business');
  
  const [userName, setUserName] = useState(initialConfig?.userName || 'John');
  const [companyName, setCompanyName] = useState(initialConfig?.companyName || '(NOME DA SUA EMPRESA AQUI)');
  const [currency, setCurrency] = useState(initialConfig?.currency || 'BRL');

  const metas = initialConfig?.metas || [];

  // --- Lifted State ---
  const [banks, setBanks] = useState<Bank[]>([
    { id: 1, name: 'Nubank', color: 'bg-purple-600' },
    { id: 2, name: 'Itaú', color: 'bg-orange-500' },
    { id: 3, name: 'XP', color: 'bg-amber-500' },
    { id: 4, name: 'Inter', color: 'bg-orange-400' },
    { id: 5, name: 'Bradesco', color: 'bg-red-700' },
    { id: 6, name: 'Santander', color: 'bg-red-500' },
    { id: 7, name: 'C6 Bank', color: 'bg-gray-800' },
  ]);

  const [cards, setCards] = useState<CreditCardItem[]>([
    { 
        id: 1, name: 'Nubank Principal', nickname: 'Roxinho', bankId: 1, bankName: 'Nubank', brand: 'Mastercard',
        limit: 5000.00, maxSpend: 4000.00, usedLimit: 2350.00, closingDay: 5, dueDay: 12, lastDigits: '4829',
        installments: [
            { id: 1, store: 'Magazine Luiza', current: 3, total: 10, amount: 199.90, totalAmount: 1999.00 },
            { id: 2, store: 'Amazon', current: 1, total: 3, amount: 85.00, totalAmount: 255.00 },
        ]
    },
    { 
        id: 2, name: 'XP Infinite', nickname: 'Investimentos', bankId: 3, bankName: 'XP', brand: 'Visa',
        limit: 15000.00, maxSpend: 3000.00, usedLimit: 4100.50, closingDay: 1, dueDay: 8, lastDigits: '9011',
        installments: [
            { id: 3, store: 'Apple Store', current: 8, total: 12, amount: 850.00, totalAmount: 10200.00 }
        ]
    },
    { 
        id: 3, name: 'Itaú Click', nickname: 'Casa', bankId: 2, bankName: 'Itaú', brand: 'Mastercard',
        limit: 3500.00, usedLimit: 1200.00, closingDay: 20, dueDay: 28, lastDigits: '1122',
        installments: []
    },
  ]);

  const [loans, setLoans] = useState<LoanItem[]>([
      { 
          id: 1, 
          title: 'Financiamento Carro', 
          bank: 'Santander', 
          totalValue: 45000, 
          installmentValue: 1250, 
          totalInstallments: 36, 
          paidInstallments: 12, 
          dueDateDay: 10,
          status: 'active'
      },
      { 
          id: 3, 
          title: 'Crédito Pessoal', 
          bank: 'Nubank', 
          totalValue: 5000, 
          installmentValue: 500, 
          totalInstallments: 10, 
          paidInstallments: 10, 
          dueDateDay: 5,
          status: 'finished'
      }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, name: 'Salário Outubro', category: 'Salário', date: '05/10/2025', details: 'Pagamento referente ao mês de Setembro.', amount: 7500.00, type: 'income', status: 'completed', paymentMethod: 'Transferência Bancária', bank: 'Itaú' },
    { id: 2, name: 'Salário Novembro', category: 'Salário', date: '05/11/2025', details: 'Pagamento referente ao mês de Outubro.', amount: 7500.00, type: 'income', status: 'completed', paymentMethod: 'Transferência Bancária', bank: 'Itaú' },
    { id: 4, name: 'Aluguel Outubro', category: 'Moradia', date: '10/10/2025', details: 'Mensalidade Outubro.', amount: 2200.00, type: 'expense', status: 'completed', paymentMethod: 'Boleto', bank: 'Bradesco' },
    { id: 9, name: 'Supermercado (mês)', category: 'Alimentação', date: '03/10/2025', details: 'Compras do mês.', amount: 850.70, type: 'expense', status: 'completed', paymentMethod: 'Cartão de Crédito', bank: 'Nubank', cardId: 1 },
  ]);

  const [categories, setCategories] = useState([
      { id: 1, name: 'Salário' },
      { id: 2, name: 'Renda Extra' },
      { id: 3, name: 'Moradia' },
      { id: 4, name: 'Contas' },
      { id: 5, name: 'Alimentação' },
      { id: 6, name: 'Transporte' },
      { id: 7, name: 'Lazer' },
      { id: 8, name: 'Compras' },
      { id: 9, name: 'Saúde' },
      { id: 10, name: 'Serviços' },
      { id: 11, name: 'Outros' },
  ]);

  // Lifted State for Deals and Contracts
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);

  // --- Handlers ---
  const handleSaveCard = (cardData: CreditCardItem) => {
    setCards(prevCards => {
        if (cardData.id === 0) {
            const newId = prevCards.length > 0 ? Math.max(...prevCards.map(c => c.id)) + 1 : 1;
            return [...prevCards, { ...cardData, id: newId }];
        } else {
            return prevCards.map(c => c.id === cardData.id ? cardData : c);
        }
    });
  };

  const handleSaveInstallment = (cardId: number, installment: CardInstallment) => {
      setCards(prevCards => prevCards.map(c => {
          if (c.id === cardId) {
              return { ...c, installments: [...c.installments, installment] };
          }
          return c;
      }));
  };

  const handlePayInstallment = (cardId: number, installmentId: number) => {
      setCards(prevCards => prevCards.map(c => {
          if (c.id === cardId) {
              return {
                  ...c,
                  installments: c.installments.map(inst => {
                      if (inst.id === installmentId) {
                          const nextCurrent = inst.current + 1;
                          return { ...inst, current: Math.min(nextCurrent, inst.total) };
                      }
                      return inst;
                  })
              };
          }
          return c;
      }));
  };

  const handleDeleteCard = (id: number) => {
      if (window.confirm("Tem certeza que deseja excluir este cartão?")) {
          setCards(prevCards => prevCards.filter(c => c.id !== id));
      }
  };

  const handleSaveLoan = (item: LoanItem) => {
    setLoans(prevLoans => {
        if (item.id === 0) {
            const newId = prevLoans.length > 0 ? Math.max(...prevLoans.map(i => i.id)) + 1 : 1;
            return [...prevLoans, { ...item, id: newId }];
        } else {
            return prevLoans.map(i => i.id === item.id ? item : i);
        }
    });
  };

  const handlePayLoanInstallment = (loanId: number) => {
      setLoans(prevLoans => prevLoans.map(loan => {
          if (loan.id === loanId) {
              const nextPaid = loan.paidInstallments + 1;
              const isFinished = nextPaid >= loan.totalInstallments;
              return { 
                  ...loan, 
                  paidInstallments: Math.min(nextPaid, loan.totalInstallments),
                  status: isFinished ? 'finished' : loan.status
              };
          }
          return loan;
      }));
  };

  const handleDeleteLoan = (id: number) => {
      if(window.confirm("Deseja excluir este crédito?")) {
          setLoans(prevLoans => prevLoans.filter(i => i.id !== id));
      }
  };

  const handleSaveBank = (bankData: Bank) => {
    setBanks(prevBanks => {
        if (bankData.id === 0) {
            const newId = prevBanks.length > 0 ? Math.max(...prevBanks.map(b => b.id)) + 1 : 1;
            return [...prevBanks, { ...bankData, id: newId }];
        } else {
            return prevBanks.map(b => b.id === bankData.id ? bankData : b);
        }
    });
  };

  const handleDeleteBank = (id: number) => {
      setBanks(prevBanks => prevBanks.filter(b => b.id !== id));
  };

  const handleSaveTransaction = (data: Transaction) => {
      setTransactions(prev => {
          if (data.id === 0) {
              const newId = prev.length > 0 ? Math.max(...prev.map(t => t.id)) + 1 : 1;
              return [...prev, { ...data, id: newId }];
          } else {
              return prev.map(t => t.id === data.id ? data : t);
          }
      });
  };

  const handleDeleteTransaction = (id: number) => {
      if(window.confirm("Deseja excluir esta transação?")) {
          setTransactions(prev => prev.filter(t => t.id !== id));
      }
  };
  
  const handleDeleteAllTransactions = () => {
      if(window.confirm("Atenção! Todas as suas transações serão excluídas permanentemente. Deseja continuar?")) {
          setTransactions([]);
      }
  };
  
  const handleSaveCategory = (data: { id: number; name: string }) => {
      setCategories(prev => {
          if (data.id === 0) {
              const newId = prev.length > 0 ? Math.max(...prev.map(c => c.id)) + 1 : 1;
              return [...prev, { ...data, id: newId }];
          } else {
              return prev.map(c => c.id === data.id ? data : c);
          }
      });
  };

  const handleDeleteCategory = (id: number) => {
      setCategories(prev => prev.filter(c => c.id !== id));
  };

  const handleAccountTypeChange = (type: 'personal' | 'business') => {
      setAccountType(type);
      if (type === 'personal') {
          if (selected === 'Clientes') {
              setSelected('Dashboard');
          }
      } 
  };

  useEffect(() => {
      const checkSystemPreference = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (colorMode === 'system') {
          setIsDark(checkSystemPreference());
          
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
          
          mediaQuery.addEventListener('change', handleChange);
          return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
          setIsDark(colorMode === 'dark');
      }
  }, [colorMode]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const theme = colorThemes[accentColor as keyof typeof colorThemes] || colorThemes.green;
    const root = document.documentElement;
    
    for (const [key, value] of Object.entries(theme)) {
        root.style.setProperty(key, value);
    }

    const activeTheme = PRESET_THEMES.find(t => t.id === currentTheme);
    
    if (activeTheme) {
        const themeValues = isDark ? activeTheme.dark : activeTheme.light;
        
        root.style.setProperty('--bg-left', themeValues.bg_left);
        root.style.setProperty('--bg-right', themeValues.bg_right);
        root.style.setProperty('--bg-card', themeValues.bg_left);
        root.style.setProperty('--border-color', themeValues.border);
        root.style.setProperty('--bg-input', themeValues.bg_input);
        root.style.setProperty('--color-detail', themeValues.detail);
    } else {
        if (isDark) {
            root.style.setProperty('--bg-left', '#181818'); 
            root.style.setProperty('--bg-right', '#212121'); 
            root.style.setProperty('--bg-card', '#181818'); 
            root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.08'); 
            root.style.setProperty('--bg-input', 'rgba(0, 0, 0, 0.2)');
            root.style.setProperty('--color-detail', '#334155');
        } else {
             root.style.setProperty('--bg-left', '#F9F9F9');
             root.style.setProperty('--bg-right', '#FFFFFF'); 
             root.style.setProperty('--bg-card', '#F9F9F9');
             root.style.setProperty('--border-color', '#E5E7EB'); 
             root.style.setProperty('--bg-input', 'rgba(0, 0, 0, 0.05)'); 
             root.style.setProperty('--color-detail', '#E2E8F0');
        }
    }
  }, [accentColor, currentTheme, isDark]);

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`} style={{ backgroundColor: 'var(--bg-right)' }}>
      <div className="flex w-full text-gray-900 dark:text-gray-100 bg-[var(--bg-right)]">
        <Sidebar 
            open={open} 
            setOpen={setOpen}
            selected={selected} 
            setSelected={setSelected}
            accountType={accountType}
            setAccountType={handleAccountTypeChange}
            userName={userName}
        />
        <ExampleContent 
            colorMode={colorMode}
            setColorMode={setColorMode}
            isDark={isDark} 
            accentColor={accentColor} 
            setAccentColor={setAccentColor} 
            currentTheme={currentTheme} 
            setCurrentTheme={setCurrentTheme}
            open={open} 
            setOpen={setOpen} 
            selected={selected} 
            setSelected={setSelected}
            banks={banks}
            cards={cards}
            loans={loans}
            transactions={transactions}
            categories={categories}
            handleSaveCard={handleSaveCard}
            handleDeleteCard={handleDeleteCard}
            handleSaveInstallment={handleSaveInstallment}
            handlePayInstallment={handlePayInstallment}
            handleSaveLoan={handleSaveLoan}
            handleDeleteLoan={handleDeleteLoan}
            handlePayLoanInstallment={handlePayLoanInstallment}
            handleSaveBank={handleSaveBank}
            handleDeleteBank={handleDeleteBank}
            handleSaveTransaction={handleSaveTransaction}
            handleDeleteTransaction={handleDeleteTransaction}
            handleDeleteAllTransactions={handleDeleteAllTransactions}
            handleSaveCategory={handleSaveCategory}
            handleDeleteCategory={handleDeleteCategory}
            accountType={accountType}
            setAccountType={handleAccountTypeChange}
            userName={userName}
            setUserName={setUserName}
            companyName={companyName}
            setCompanyName={setCompanyName}
            currency={currency}
            setCurrency={setCurrency}
            onLogout={onLogout}
            extraContext={initialConfig}
            metas={metas} 
            onUpdateMetas={onUpdateMetas}
            deals={deals}
            setDeals={setDeals}
            contracts={contracts}
            setContracts={setContracts}
        />
      </div>
    </div>
  );
};

const UserProfile = ({ open, setOpen, selected, setSelected, userName }: { open: boolean, setOpen: (open: boolean) => void, selected: string, setSelected: (t: string) => void, userName: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleProfileClick = () => {
    if (!open) {
      setOpen(true);
      setTimeout(() => setIsMenuOpen(true), 150);
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  return (
    <div className="border-t border-[var(--border-color)] p-2 mt-auto">
      <button 
        onClick={handleProfileClick}
        className={`flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left group ${isMenuOpen ? 'bg-black/5 dark:bg-white/5' : ''}`}
      >
        <div className="relative shrink-0">
           <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
           <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[var(--bg-left)] rounded-full"></div>
        </div>
        
        <div className={`flex-1 overflow-hidden transition-all duration-300 flex flex-col justify-center ${open ? 'opacity-100 ml-0 w-auto' : 'opacity-0 w-0 ml-[-10px]'}`}>
           <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">{userName}</p>
           <p className="text-xs text-gray-500 dark:text-gray-400 truncate leading-tight">Sócio Fundador</p>
        </div>

        <ChevronDown className={`h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${open ? 'opacity-100' : 'opacity-0 w-0'} ${isMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen && open ? 'max-h-24 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
         <div className="flex flex-col gap-0.5 pl-2">
            <button 
               onClick={() => setSelected('Configurações')}
               className={`flex items-center gap-2 w-full p-2 rounded-lg text-sm transition-colors ${selected === 'Configurações' ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'}`}
            >
               <Settings className="h-4 w-4" />
               Configurações
            </button>
            <button 
               onClick={() => setSelected('Sair')}
               className={`flex items-center gap-2 w-full p-2 rounded-lg text-sm transition-colors ${selected === 'Sair' ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20' : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
            >
               <LogOut className="h-4 w-4" />
               Sair
            </button>
         </div>
      </div>
    </div>
  );
};

const Sidebar: React.FC<{
    open: boolean; 
    setOpen: (open: boolean) => void;
    selected: string; 
    setSelected: (title: string) => void;
    accountType: 'personal' | 'business';
    setAccountType: (type: 'personal' | 'business') => void;
    userName: string;
}> = ({ open, setOpen, selected, setSelected, accountType, setAccountType, userName }) => {
    
  const sidebarRef = useRef<HTMLElement>(null);

  const menuItems = [
      { icon: Home, title: "Dashboard" },
      { icon: User, title: "Agentes", badge: "EM BREVE" },
      { icon: Layout, title: "Metas Estratégicas" }, // Renamed from Área de Trabalho
      { icon: Map, title: "Planejamento" },
      { icon: Sparkles, title: "Oportunidades" }, 
      { icon: FileCheck, title: "Clientes" },
      { icon: ArrowRightLeft, title: "Transações" },
      { icon: Folder, title: "Categorias" },
      { icon: Wallet, title: "Carteiras" },
      { icon: BarChart3, title: "Métricas", badge: "EM BREVE" },
      { icon: FileText, title: "Relatórios" },
      { icon: Calendar, title: "Agenda" }
  ];

  return (
    <nav
      ref={sidebarRef}
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-[var(--border-color)] shadow-sm flex flex-col bg-[var(--bg-left)]`}
    >
      <div className="flex-1 flex flex-col min-h-0 p-2">
        <TitleSection open={open} />

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 space-y-1 mb-2 mt-2">
          {menuItems.map((item, index) => (
              <Option 
                key={index}
                Icon={item.icon} 
                title={item.title} 
                badge={item.badge}
                selected={selected} 
                setSelected={setSelected} 
                open={open} 
                setOpen={setOpen} 
              />
          ))}
        </div>
      </div>

      <UserProfile open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} userName={userName} />
    </nav>
  );
};

const Option: React.FC<OptionProps> = ({ Icon, title, selected, setSelected, open, setOpen, notifs, badge }) => {
  const isSelected = selected === title;
  
  return (
    <button
      onClick={() => {
          setSelected(title);
          if (!open) setOpen(true);
      }}
      className={`relative flex h-10 w-full items-center rounded-md transition-all duration-200 ${
        isSelected 
          ? "bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 shadow-sm border-l-2 border-primary-500" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
      }`}
    >
      <div className="grid h-full w-12 shrink-0 place-content-center">
        <Icon className={`h-4 w-4 ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
      </div>
      
      <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${open ? 'opacity-100 max-w-[200px] translate-x-0 ml-0' : 'opacity-0 max-w-0 -translate-x-5 ml-0'}`}>
          {title}
      </span>

      {badge && (
        <span className={`ml-auto mr-2 whitespace-nowrap text-[10px] font-bold px-1.5 py-0.5 rounded border transition-all duration-300 ${open ? 'opacity-100 scale-100' : 'opacity-0 w-0 scale-95 overflow-hidden p-0 border-0'} bg-primary-100 text-primary-600 border-primary-200 dark:bg-primary-900/40 dark:text-primary-300 dark:border-primary-800`}>
            {badge}
        </span>
      )}
    </button>
  );
};

const TitleSection: React.FC<TitleSectionProps> = ({ open }) => {
  return (
    <div className="mb-3 pb-3 border-b border-[var(--border-color)]">
      <div className="flex items-center gap-3 px-2">
        <Logo />
        <div className={`flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300 ${open ? 'opacity-100 max-w-[150px] ml-0' : 'opacity-0 max-w-0 -ml-4'}`}>
              <span className="block text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                  SÓCIO v1.0
              </span>
        </div>
      </div>
    </div>
  );
};

const Logo: React.FC = () => {
  return (
    <div className="grid size-8 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm">
      <Wallet className="h-4 w-4 fill-white text-white" />
    </div>
  );
};

// ... NotificationsDropdown and AgentChatDropdown kept same ...
const NotificationsDropdown: React.FC<{ isOpen: boolean; onClose: () => void; onNavigate: () => void }> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const appointments = [
    { id: 1, title: 'Reunião de Orçamento', time: '14:00 - Hoje', type: 'work', important: true },
    { id: 2, title: 'Dentista (Dr. Silva)', time: '09:30 - Amanhã', type: 'health', important: false },
    { id: 3, title: 'Pagar Fatura Nubank', time: 'Vence em 2 dias', type: 'finance', important: true },
  ];

  return (
    <div className="absolute top-12 right-0 w-80 bg-white dark:bg-[var(--bg-card)] rounded-xl shadow-2xl border border-gray-200 dark:border-[var(--border-color)] z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-[var(--border-color)] bg-gray-50/50 dark:bg-[var(--bg-input)]">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary-500" />
          Compromissos
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-[300px] overflow-y-auto p-2">
        {appointments.map(app => (
          <div key={app.id} className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group relative">
            {app.important && (
               <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></div>
            )}
            <div className="flex items-start gap-3">
               <div className={`mt-1 p-2 rounded-full shrink-0 ${
                 app.type === 'finance' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
               }`}>
                 <Clock className="h-3.5 w-3.5" />
               </div>
               <div>
                 <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                   {app.title}
                 </h4>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{app.time}</p>
               </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-100 dark:border-[var(--border-color)] bg-gray-50 dark:bg-[var(--bg-input)] text-center">
        <button onClick={() => { onNavigate(); onClose(); }} className="w-full py-2 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm text-sm">
          Ver agenda completa
        </button>
      </div>
    </div>
  );
};

const AgentChatDropdown: React.FC<{ isOpen: boolean; onClose: () => void; onNavigate: () => void }> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const messages = [
    { id: 1, text: 'Olá! Como posso ajudar?', sender: 'bot' },
    { id: 2, text: 'Qual foi meu maior gasto esse mês?', sender: 'user' },
  ];

  return (
    <div className="absolute top-12 right-0 w-80 bg-white dark:bg-[var(--bg-card)] rounded-xl shadow-2xl border border-gray-200 dark:border-[var(--border-color)] z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col" style={{ height: '400px' }}>
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-[var(--border-color)] bg-gray-50/50 dark:bg-[var(--bg-input)] shrink-0">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary-500" />
          SÓCIO NEXIALISTA
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && (
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                <Bot className="h-3 w-3 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            <div className={`max-w-xs p-2.5 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-[var(--bg-input)] text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-100 dark:border-[var(--border-color)] bg-gray-50 dark:bg-[var(--bg-input)] shrink-0">
        <form className="flex items-center gap-2 mb-2">
            <input type="text" placeholder="Sua mensagem..." className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[var(--bg-card)] border border-gray-200 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
            <button type="submit" className="p-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm shrink-0">
                <Send className="h-4 w-4" />
            </button>
        </form>
        <button onClick={() => { onNavigate(); onClose(); }} className="w-full text-center text-xs text-primary-600 dark:text-primary-400 hover:underline">
          Ver chat completo
        </button>
      </div>
    </div>
  );
};

const ExampleContent: React.FC<ExampleContentProps & {
    banks: Bank[];
    cards: CreditCardItem[];
    loans: LoanItem[];
    transactions: Transaction[];
    categories: { id: number; name: string }[];
    handleSaveCard: (card: CreditCardItem) => void;
    handleDeleteCard: (id: number) => void;
    handleSaveInstallment: (cardId: number, installment: CardInstallment) => void;
    handlePayInstallment: (cardId: number, installmentId: number) => void;
    handleSaveLoan: (loan: LoanItem) => void;
    handleDeleteLoan: (id: number) => void;
    handlePayLoanInstallment: (loanId: number) => void;
    handleSaveBank: (bank: Bank) => void;
    handleDeleteBank: (id: number) => void;
    handleSaveTransaction: (transaction: Transaction) => void;
    handleDeleteTransaction: (id: number) => void;
    handleDeleteAllTransactions: () => void;
    handleSaveCategory: (category: { id: number; name: string }) => void;
    handleDeleteCategory: (id: number) => void;
    onLogout: () => void;
    extraContext?: any;
    metas?: Meta[];
    onUpdateMetas?: (metas: Meta[]) => void;
    deals: Deal[];
    setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
    contracts: Contract[];
    setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
}> = ({ 
    colorMode, setColorMode, isDark, accentColor, setAccentColor, currentTheme, setCurrentTheme, open, setOpen, selected, setSelected,
    banks, cards, loans, transactions, categories,
    handleSaveCard, handleDeleteCard, handleSaveInstallment, handlePayInstallment,
    handleSaveLoan, handleDeleteLoan, handlePayLoanInstallment,
    handleSaveBank, handleDeleteBank,
    handleSaveTransaction, handleDeleteTransaction, handleDeleteAllTransactions,
    handleSaveCategory, handleDeleteCategory,
    accountType, setAccountType,
    userName, setUserName,
    companyName, setCompanyName,
    currency, setCurrency,
    onLogout,
    extraContext,
    metas = [],
    onUpdateMetas,
    deals,
    setDeals,
    contracts,
    setContracts
}) => {
  const [isCompromissosOpen, setIsCompromissosOpen] = useState(false);
  const [isAgentChatOpen, setIsAgentChatOpen] = useState(false);
  const compromissosDropdownRef = useRef<HTMLDivElement>(null);
  const agentChatDropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (compromissosDropdownRef.current && !compromissosDropdownRef.current.contains(event.target as Node)) {
            setIsCompromissosOpen(false);
        }
        if (agentChatDropdownRef.current && !agentChatDropdownRef.current.contains(event.target as Node)) {
            setIsAgentChatOpen(false);
        }
    };
    if (isCompromissosOpen || isAgentChatOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    } else {
        document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [isCompromissosOpen, isAgentChatOpen]);

  const renderContent = () => {
    switch (selected) {
      case 'Dashboard': return <DashboardContent transactions={transactions} cards={cards} loans={loans} currency={currency} okrs={metas} />;
      case 'Agentes': return <AgentsContent />;
      case 'Metas Estratégicas': return <WorkspaceContent metas={metas} onUpdateMetas={onUpdateMetas} />;
      case 'Planejamento': return <PlanningContent metas={metas} onUpdateMetas={onUpdateMetas} />;
      case 'Oportunidades': return <OpportunitiesContent currency={currency} okrs={metas} deals={deals} setDeals={setDeals} />;
      case 'Transações': return <TransactionsContent transactions={transactions} availableBanks={banks} categories={categories} cards={cards} onSaveTransaction={handleSaveTransaction} onDeleteTransaction={handleDeleteTransaction} onDeleteAllTransactions={handleDeleteAllTransactions} currency={currency} okrs={metas} />;
      case 'Categorias': return <CategoriesContent categories={categories} transactions={transactions} onSaveCategory={handleSaveCategory} onDeleteCategory={handleDeleteCategory} currency={currency} />;
      
      case 'Carteiras': 
        return (
          <WalletsContent 
            banks={banks} 
            cards={cards} 
            loans={loans} 
            transactions={transactions}
            onSaveBank={handleSaveBank}
            onDeleteBank={handleDeleteBank}
            onSaveCard={handleSaveCard}
            onDeleteCard={handleDeleteCard}
            onSaveInstallment={handleSaveInstallment}
            onPayInstallment={handlePayInstallment}
            onSaveLoan={handleSaveLoan}
            onDeleteLoan={handleDeleteLoan}
            onPayLoanInstallment={handlePayLoanInstallment}
            currency={currency}
            accountType={accountType}
          />
        );
      
      case 'Clientes': return <ContractsContent currency={currency} okrs={metas} contracts={contracts} setContracts={setContracts} />;
      case 'Métricas': return <MetricsContent currency={currency} />;
      case 'Relatórios': return <ReportsContent currency={currency} transactions={transactions} cards={cards} loans={loans} banks={banks} />;
      case 'Agenda': return <AppointmentsContent 
          metas={metas} 
          deals={deals} 
          contracts={contracts} 
          loans={loans}
          transactions={transactions}
      />;
      case 'Configurações': 
        return (
            <SettingsContent 
                colorMode={colorMode} 
                setColorMode={setColorMode} 
                isDark={isDark} 
                accentColor={accentColor} 
                setAccentColor={setAccentColor} 
                currentTheme={currentTheme} 
                setCurrentTheme={setCurrentTheme}
                accountType={accountType}
                setAccountType={setAccountType}
                userName={userName}
                setUserName={setUserName}
                companyName={companyName}
                setCompanyName={setCompanyName}
                currency={currency}
                setCurrency={setCurrency}
                onLogout={onLogout}
                extraContext={extraContext}
            />
        );
      case 'Ajuda e Suporte': return <HelpContent />;
      case 'Sair': return <LogoutSettings onLogout={onLogout} />;
      default: return <DashboardContent transactions={transactions} cards={cards} loans={loans} currency={currency} okrs={metas} />;
    }
  };
  
  const headerTitle = accountType === 'personal' 
    ? `SISTEMA DE CONTROLE - ${userName.toUpperCase()}`
    : `SISTEMA DE CONTROLE - ${companyName.toUpperCase()}`;

  return (
    <main 
        className="flex-1 p-6 overflow-hidden transition-all duration-300 flex flex-col h-screen bg-[var(--bg-right)]"
        onClick={() => { if (open) setOpen(false); }}
    >
      <div className="flex items-center justify-between mb-6 shrink-0 relative">
        <div className="flex items-center gap-2">
           <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} className={`p-2 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition-opacity duration-200 ${!open ? 'opacity-100' : 'opacity-0 pointer-events-none w-0 overflow-hidden'}`}>
            <PanelLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{headerTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative" ref={compromissosDropdownRef}>
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsCompromissosOpen(!isCompromissosOpen); }}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 ${isCompromissosOpen ? 'bg-primary-100 border-primary-200 text-primary-600 dark:bg-primary-900/50 dark:border-primary-800 dark:text-primary-300 ring-2 ring-primary-500/20' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-[var(--bg-card)] dark:border-[var(--border-color)] dark:text-gray-400 dark:hover:bg-[var(--bg-input)]'}`}
                    title="Próximos Compromissos"
                >
                    <Bell className={`h-4 w-4 transition-transform duration-500 ${isCompromissosOpen ? 'rotate-12 scale-110' : ''}`} />
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-[var(--bg-card)] animate-pulse"></span>
                </button>
                <NotificationsDropdown isOpen={isCompromissosOpen} onClose={() => setIsCompromissosOpen(false)} onNavigate={() => setSelected('Agenda')} />
            </div>
            <div className="relative" ref={agentChatDropdownRef}>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsAgentChatOpen(!isAgentChatOpen); }}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 ${isAgentChatOpen ? 'bg-primary-100 border-primary-200 text-primary-600 dark:bg-primary-900/50 dark:border-primary-800 dark:text-primary-300 ring-2 ring-primary-500/20' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-[var(--bg-card)] dark:border-[var(--border-color)] dark:text-gray-400 dark:hover:bg-[var(--bg-input)]'}`}
                title="Agente IA"
              >
                  <User className="h-4 w-4" />
              </button>
              <AgentChatDropdown isOpen={isAgentChatOpen} onClose={() => setIsAgentChatOpen(false)} onNavigate={() => setSelected('Agentes')} />
            </div>
        </div>
      </div>
      {renderContent()}
    </main>
  );
};

export default DashboardPage;
