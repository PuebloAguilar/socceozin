import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertCircle as AlertCircleIcon,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BarChart3,
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Columns,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Flame,
  Info,
  Landmark,
  List,
  Lock,
  Megaphone,
  MoreVertical,
  Percent,
  PieChart,
  Printer,
  Rocket,
  Search,
  ShieldCheck,
  Snowflake,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Zap
} from "lucide-react";
import { StatCard } from '../ui/StatCard';
import { Transaction } from './TransactionsContent';
import { CreditCardItem } from './CardsPage';
import { LoanItem } from './LoansPage';
import { Bank } from './BanksPage';
import { ContentWithSidebarLayout } from '../ui/ContentWithSidebarLayout';

// --- Interfaces ---
interface ReportsContentProps {
    currency: string;
    transactions: Transaction[];
    cards: CreditCardItem[];
    loans: LoanItem[];
    banks: Bank[];
}

type ReportType = 'finance' | 'wallets' | 'sales' | 'productivity' | 'executive' | 'saas';

interface ReportConfig {
    id: ReportType;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    locked?: boolean;
}

// --- CONFIGURAÇÃO DOS TIPOS DE RELATÓRIO ---
const REPORT_TYPES: ReportConfig[] = [
    { id: 'finance', title: 'Relatório Financeiro Completo', description: 'Visão 360º: Entradas, saídas, fluxo de caixa, saúde financeira e insights de IA.', icon: BarChart3, color: 'bg-blue-500' },
    { id: 'wallets', title: 'Relatório de Carteiras', description: 'Análise consolidada de ativos e passivos: Contas, cartões, dívidas e patrimônio líquido.', icon: Wallet, color: 'bg-purple-500' },
    { id: 'sales', title: 'Relatório Comercial (CRM)', description: 'Performance do funil, previsão de fechamento, taxas de conversão e saúde do pipeline.', icon: Target, color: 'bg-amber-500' },
    { id: 'productivity', title: 'Planejamento & Produtividade', description: 'Análise de horas, distribuição de atividades, aderência a metas e padrões de trabalho.', icon: Calendar, color: 'bg-emerald-500' },
    { id: 'executive', title: 'Relatório Supremo (Executivo)', description: 'Dashboard unificado com os KPIs de todas as áreas para tomada de decisão rápida.', icon: Briefcase, color: 'bg-slate-700' },
    { id: 'saas', title: 'Métricas SaaS & Digitais', description: 'Indicadores avançados: MRR, Churn, LTV, CAC e Unit Economics.', icon: Lock, color: 'bg-gray-400', locked: true }
];

// --- SUB-COMPONENTES VISUAIS GERAIS ---

const ReportCard: React.FC<{ config: ReportConfig, onClick: () => void }> = ({ config, onClick }) => (
    <div 
        onClick={!config.locked ? onClick : undefined}
        className={`relative group p-6 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between h-full
            ${config.locked 
                ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50 cursor-not-allowed opacity-70' 
                : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
            }`}
    >
        <div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white shadow-md ${config.color}`}>
                <config.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{config.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{config.description}</p>
        </div>
        <div className="mt-6 flex items-center justify-between">
            {config.locked ? (
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-md">
                    <Lock className="h-3 w-3" /> EM BREVE
                </span>
            ) : (
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Gerar Relatório <ArrowRight className="h-4 w-4" />
                </span>
            )}
        </div>
    </div>
);

const Sparkline: React.FC<{ data: number[], color: string }> = ({ data, color }) => {
    const width = 50;
    const height = 12;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    // FIX: Corrected potential division by zero when data.length is 1.
    const points = data.map((d, i) => `${(data.length > 1 ? (i / (data.length - 1)) : 0.5) * width},${height - ((d - min) / range) * height}`).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-16 h-4 overflow-visible">
            <polyline points={points} fill="none" stroke={color} strokeWidth="1" />
        </svg>
    );
};

// --- RELATÓRIO FINANCEIRO COMPLETO ---
const FinanceReportView: React.FC<{ transactions: Transaction[], currency: string }> = ({ transactions, currency }) => {
    // Mocking and calculations
    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(val);
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
    const expensesByCategory = useMemo(() => {
        const byCat = transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);
        // FIX: Explicitly cast sort values to Number to prevent potential arithmetic errors.
        return Object.entries(byCat).sort(([, a], [, b]) => Number(b) - Number(a)).slice(0, 10);
    }, [transactions]);
    const healthScore = Math.min(95, 20 + savingsRate * 2 + (6 - (expense / (income || 1) * 10)) * 5); // Mock score logic

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* SEÇÃO 1: VISÃO GERAL EXPANDIDA */}
            <section>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Visão Geral Expandida</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard title="Receita Total" amount={formatCurrency(income)} Icon={TrendingUp} iconColor="text-green-500" borderColor="border-green-500" period="+5% vs. Mês Anterior" />
                    <StatCard title="Despesa Total" amount={formatCurrency(expense)} Icon={TrendingDown} iconColor="text-red-500" borderColor="border-red-500" period="-2% vs. Mês Anterior" />
                    <StatCard title="Saldo Líquido" amount={formatCurrency(income - expense)} Icon={DollarSign} iconColor="text-blue-500" borderColor="border-blue-500" period="Projeção: +8%" />
                    <StatCard title="Taxa de Poupança" amount={`${savingsRate.toFixed(1)}%`} Icon={PieChart} iconColor="text-purple-500" borderColor="border-purple-500" period="Meta: 20%" />
                    <StatCard title="Índice de Liquidez" amount="2.8 meses" Icon={Clock} iconColor="text-cyan-500" borderColor="border-cyan-500" period="Reserva de Emergência" />
                    <StatCard title="Burn Rate" amount={formatCurrency(expense/22)} Icon={Flame} iconColor="text-orange-500" borderColor="border-orange-500" period="Gasto / Dia Útil" />
                </div>
            </section>

            {/* SEÇÃO 2: ANÁLISE DE DESPESAS */}
            <section className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Análise de Despesas (Deep Dive)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-[var(--bg-input)]">
                            <tr>
                                <th className="px-4 py-2 text-left">Top 10 Categorias</th>
                                <th className="px-4 py-2 text-right">Valor</th>
                                <th className="px-4 py-2 text-right">% do Total</th>
                                <th className="px-4 py-2 text-center">vs Mês Anterior</th>
                                <th className="px-4 py-2 text-center">Tendência (3M)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {expensesByCategory.map(([cat, amount]) => (
                                <tr key={cat}>
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{cat}</td>
                                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(amount)}</td>
                                    <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">{(amount/expense * 100).toFixed(1)}%</td>
                                    {/* FIX: Replaced ArrowUp with ArrowUp and added import */}
                                    <td className="px-4 py-3 text-center text-red-500 flex items-center justify-center gap-1"><ArrowUp className="h-3 w-3"/> +{Math.floor(Math.random()*15)}%</td>
                                    <td className="px-4 py-3 flex justify-center"><Sparkline data={[amount * 0.8, amount * 1.1, amount]} color="#ef4444" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            
            {/* SEÇÃO 4 & 5: SAÚDE FINANCEIRA & ALERTAS */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Saúde Financeira</h3>
                    <div className="flex items-center gap-6">
                        <div className="relative w-32 h-32">
                             <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90"><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200 dark:text-gray-700"/><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray={`${healthScore}, 100`} className="text-green-500"/></svg>
                             <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-bold text-green-600 dark:text-green-400">{healthScore.toFixed(0)}</span><span className="text-xs text-gray-500">/ 100</span></div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500"/>Taxa de Poupança: <span className="font-bold">{savingsRate.toFixed(1)}%</span></p>
                            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500"/>Runway: <span className="font-bold">2.8 meses</span></p>
                            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500"/>Comprometimento: <span className="font-bold">35%</span></p>
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Alertas Inteligentes</h3>
                    <div className="space-y-3">
                        {/* FIX: Replaced AlertTriangleIcon with AlertTriangle */}
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-amber-500"/> <p className="text-sm text-amber-800 dark:text-amber-200">Categoria "Alimentação" está <strong>25%</strong> acima da média.</p></div>
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 flex items-center gap-3"><AlertCircleIcon className="h-5 w-5 text-red-500"/> <p className="text-sm text-red-800 dark:text-red-200"><strong>Gasto atípico</strong> de {formatCurrency(350)} em Lazer.</p></div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 flex items-center gap-3"><Zap className="h-5 w-5 text-blue-500"/> <p className="text-sm text-blue-800 dark:text-blue-200"><strong>Ritmo atual:</strong> projeção de fechar o mês com saldo de {formatCurrency(income - expense * 1.1)}.</p></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// --- RELATÓRIO DE CARTEIRAS ---
const WalletsReportView: React.FC<{ cards: CreditCardItem[], loans: LoanItem[], banks: Bank[], currency: string }> = ({ cards, loans, banks, currency }) => {
    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(val);
    const totalLimit = cards.reduce((acc, c) => acc + c.limit, 0);
    const totalUsed = cards.reduce((acc, c) => acc + c.usedLimit, 0);
    const totalDebt = loans.filter(l => l.status === 'active').reduce((acc, l) => acc + ((l.totalInstallments - l.paidInstallments) * l.installmentValue), 0);
    const patrimonioLiquido = 50000 - totalDebt; // Mock data

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
             <section>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Visão Consolidada</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                     {/* FIX: Replaced ShieldCheck with ShieldCheck and added import */}
                     <StatCard title="Patrimônio Líquido" amount={formatCurrency(patrimonioLiquido)} Icon={ShieldCheck} iconColor="text-green-500" borderColor="border-green-500" period="Ativos - Passivos"/>
                     <StatCard title="Limite de Crédito Total" amount={formatCurrency(totalLimit)} Icon={CreditCard} iconColor="text-blue-500" borderColor="border-blue-500" period={`Utilizado: ${(totalUsed/totalLimit*100).toFixed(0)}%`}/>
                     <StatCard title="Dívidas Ativas" amount={formatCurrency(totalDebt)} Icon={Briefcase} iconColor="text-red-500" borderColor="border-red-500" period={`${loans.filter(l=>l.status === 'active').length} contratos`}/>
                     <StatCard title="Alocação de Ativos" amount={"70 / 30"} Icon={PieChart} iconColor="text-purple-500" borderColor="border-purple-500" period="Renda Fixa / Variável"/>
                </div>
            </section>
            
            {/* SEÇÃO 3: CARTÕES DE CRÉDITO */}
            <section className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Análise de Cartões de Crédito</h3>
                <div className="space-y-4">
                    {cards.map(card => {
                        const usedPercent = card.limit > 0 ? (card.usedLimit / card.limit) * 100 : 0;
                        return (
                        <div key={card.id}>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="font-medium text-gray-800 dark:text-gray-200">{card.name}</span>
                                <span className="text-gray-500">{formatCurrency(card.usedLimit)} / {formatCurrency(card.limit)}</span>
                            </div>
                            <div className="h-2 bg-[var(--color-detail)] rounded-full w-full"><div className="h-2 bg-primary-500 rounded-full" style={{width: `${usedPercent}%`}}></div></div>
                        </div>
                    )})}
                </div>
            </section>

             {/* SEÇÃO 4: DÍVIDAS & EMPRÉSTIMOS */}
             <section className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Dívidas & Empréstimos</h3>
                <table className="w-full text-sm">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-[var(--bg-input)]">
                        <tr>
                            <th className="px-4 py-2 text-left">Contrato</th>
                            <th className="px-4 py-2 text-right">Saldo Devedor</th>
                            <th className="px-4 py-2 text-right">Parcela</th>
                            <th className="px-4 py-2 text-center">Progresso</th>
                        </tr>
                    </thead>
                    <tbody>
                    {loans.filter(l => l.status === 'active').map(loan => (
                        <tr key={loan.id} className="border-b border-[var(--border-color)] last:border-0">
                            <td className="px-4 py-3"><p className="font-medium">{loan.title}</p><p className="text-xs text-gray-500">{loan.bank}</p></td>
                            <td className="px-4 py-3 text-right font-semibold text-red-600 dark:text-red-400">{formatCurrency((loan.totalInstallments - loan.paidInstallments) * loan.installmentValue)}</td>
                            <td className="px-4 py-3 text-right">{formatCurrency(loan.installmentValue)}</td>
                            <td className="px-4 py-3 text-center text-xs">{loan.paidInstallments}/{loan.totalInstallments}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
             </section>
        </div>
    );
};

// Placeholder for other complex reports
const PlaceholderReportView: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center justify-center h-full bg-[var(--bg-card)] rounded-lg shadow-sm border border-[var(--border-color)]">
        <div className="text-center p-8">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">Este relatório avançado está em fase final de implementação e será liberado em breve com análises detalhadas e gráficos interativos.</p>
        </div>
    </div>
);


// --- MAIN COMPONENT ---
export const ReportsContent: React.FC<ReportsContentProps> = ({ transactions, currency, cards, loans, banks }) => {
    const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleReportSelect = (id: ReportType) => {
        setIsGenerating(true);
        setTimeout(() => { setSelectedReport(id); setIsGenerating(false); }, 500);
    };

    const activeConfig = REPORT_TYPES.find(r => r.id === selectedReport);

    const reportMenuItems = useMemo(() => ([
        {
            category: 'Relatórios',
            items: REPORT_TYPES.map(report => ({
                label: report.title,
                icon: report.locked ? Lock : report.icon,
            }))
        }
    ]), []);

    const handleMenuSelect = (title: string) => {
        const report = REPORT_TYPES.find(r => r.title === title);
        if (report && !report.locked) {
            handleReportSelect(report.id);
        }
    };

    const renderActiveReport = () => {
        switch (selectedReport) {
            case 'finance': return <FinanceReportView transactions={transactions} currency={currency} />;
            case 'wallets': return <WalletsReportView cards={cards} loans={loans} banks={banks} currency={currency} />;
            case 'sales': return <PlaceholderReportView title="Relatório Comercial (CRM)" />;
            case 'productivity': return <PlaceholderReportView title="Relatório de Produtividade" />;
            case 'executive': return <PlaceholderReportView title="Relatório Supremo (Executivo)" />;
            default: return null;
        }
    };

    return (
        <div className="h-[calc(100vh-9rem)] overflow-hidden flex flex-col">
            {/* Header Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 shrink-0 px-1">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Central de Relatórios</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {selectedReport ? `Analisando: ${activeConfig?.title}` : 'Selecione um pacote de inteligência para gerar.'}
                    </p>
                </div>
                {selectedReport && (
                    <div className="flex items-center gap-2">
                        <button onClick={() => alert("Exportando para PDF...")} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm"><Printer className="h-4 w-4" /> Exportar PDF</button>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
                {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-full"><div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div><p className="text-lg font-medium text-gray-600 dark:text-gray-300">Compilando dados...</p></div>
                ) : selectedReport ? (
                    <ContentWithSidebarLayout
                        title="Relatórios"
                        menuItems={reportMenuItems}
                        selectedItem={activeConfig?.title || ''}
                        setSelectedItem={handleMenuSelect}
                    >
                        {renderActiveReport()}
                    </ContentWithSidebarLayout>
                ) : (
                    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 pr-2 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in">
                            {REPORT_TYPES.map(config => <ReportCard key={config.id} config={config} onClick={() => handleReportSelect(config.id)} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};