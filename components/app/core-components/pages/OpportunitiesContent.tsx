
import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  User,
  DollarSign,
  ChevronDown,
  Briefcase,
  Mail,
  MessageCircle,
  CheckCircle2,
  TrendingUp,
  Target,
  PieChart,
  MoreVertical,
  Columns,
  List,
  X,
  Save,
  Building2,
  Layout,
  Flame,
  Zap,
  Snowflake,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { SmartForecastWidget } from '../ui/SmartForecastWidget';
import { Meta } from '../../types';

// --- Interfaces & Types (CRM) ---

export type DealStatus = 'open' | 'won' | 'lost';
export type Temperature = 'hot' | 'warm' | 'cold';
export type Priority = 'high' | 'medium' | 'low';

export interface Deal {
    id: string;
    title: string;
    company: string;
    contactName: string;
    value: number;
    probability: number; // 0-100%
    score: number; // 0-100 (Lead Scoring)
    status: DealStatus;
    temperature: Temperature;
    priority: Priority;
    origin: 'Google' | 'Indicação' | 'Linkedin' | 'Outbound' | 'Instagram';
    owner: { name: string; avatar: string };
    lastActivity: string;
    nextTask: string;
    columnId: string;
    tags: string[];
}

interface Column {
    id: string;
    title: string;
    color: string; // Header accent color
    stageIndex: number;
}

interface OpportunitiesContentProps {
    currency: string;
    okrs?: Meta[];
    // New Props for lifted state
    deals?: Deal[];
    setDeals?: React.Dispatch<React.SetStateAction<Deal[]>>;
}

// --- Mock Data (CRM) ---

export const initialColumns: Column[] = [
    { id: 'lead', title: 'Possível Cliente', color: 'border-indigo-500', stageIndex: 0 },
    { id: 'contact', title: 'Primeiro Contato', color: 'border-blue-500', stageIndex: 1 },
    { id: 'pending', title: 'Pendente', color: 'border-amber-500', stageIndex: 2 },
    { id: 'negotiation', title: 'Negociação', color: 'border-purple-500', stageIndex: 3 },
    { id: 'won', title: 'Fechamento', color: 'border-green-500', stageIndex: 4 },
];

export const initialDeals: Deal[] = [
    { 
        id: 'd1', title: 'Implantação ERP', company: 'Oral Sin Implantes', contactName: 'Dr. Roberto',
        value: 12500, probability: 10, score: 45, status: 'open', temperature: 'cold', priority: 'low',
        origin: 'Google', owner: { name: 'Marcus', avatar: 'https://i.pravatar.cc/150?u=1' },
        lastActivity: 'Email enviado há 2d', nextTask: 'Ligar para agendar demo', columnId: 'lead', tags: ['Varejo']
    },
    { 
        id: 'd2', title: 'Consultoria Financeira', company: 'Top Estética', contactName: 'Ana Silva',
        value: 4500, probability: 20, score: 65, status: 'open', temperature: 'warm', priority: 'medium',
        origin: 'Instagram', owner: { name: 'Julia', avatar: 'https://i.pravatar.cc/150?u=2' },
        lastActivity: 'Whatsapp ontem', nextTask: 'Enviar apresentação', columnId: 'contact', tags: ['PME']
    },
    { 
        id: 'd3', title: 'App Delivery', company: 'Turma da Bagunça', contactName: 'Carlos',
        value: 28000, probability: 40, score: 85, status: 'open', temperature: 'hot', priority: 'high',
        origin: 'Indicação', owner: { name: 'Marcus', avatar: 'https://i.pravatar.cc/150?u=1' },
        lastActivity: 'Reunião realizada', nextTask: 'Montar escopo técnico', columnId: 'pending', tags: ['App', 'Urgente']
    },
    { 
        id: 'd4', title: 'Renovação Anual', company: 'Centro Médico Sul', contactName: 'Dra. Fernanda',
        value: 15000, probability: 40, score: 70, status: 'open', temperature: 'warm', priority: 'medium',
        origin: 'Outbound', owner: { name: 'Ricardo', avatar: 'https://i.pravatar.cc/150?u=3' },
        lastActivity: 'Call agendada', nextTask: 'Qualificar decisores', columnId: 'pending', tags: ['Recorrente']
    },
    { 
        id: 'd6', title: 'Expansão Franquia', company: 'Ana Turismo', contactName: 'Ana',
        value: 85000, probability: 70, score: 95, status: 'open', temperature: 'hot', priority: 'high',
        origin: 'Linkedin', owner: { name: 'Marcus', avatar: 'https://i.pravatar.cc/150?u=1' },
        lastActivity: 'Proposta enviada ontem', nextTask: 'Follow-up proposta', columnId: 'negotiation', tags: ['Enterprise']
    },
    { 
        id: 'd7', title: 'Campanha Black Friday', company: 'Central Turismo', contactName: 'Pedro',
        value: 12000, probability: 70, score: 88, status: 'open', temperature: 'hot', priority: 'high',
        origin: 'Indicação', owner: { name: 'Julia', avatar: 'https://i.pravatar.cc/150?u=2' },
        lastActivity: 'Negociação valores', nextTask: 'Aprovar orçamento', columnId: 'negotiation', tags: ['Marketing']
    },
    { 
        id: 'd8', title: 'Licença Enterprise', company: 'Agill Transportes', contactName: 'Diretoria',
        value: 120000, probability: 100, score: 100, status: 'won', temperature: 'hot', priority: 'high',
        origin: 'Google', owner: { name: 'Marcus', avatar: 'https://i.pravatar.cc/150?u=1' },
        lastActivity: 'Contrato assinado', nextTask: 'Iniciar Onboarding', columnId: 'won', tags: ['Fechado']
    },
];

// --- Helper Functions ---

const getTemperatureIcon = (temp: Temperature) => {
    switch (temp) {
        case 'hot': return <Flame className="h-4 w-4 text-red-500 fill-red-500" />;
        case 'warm': return <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />;
        case 'cold': return <Snowflake className="h-4 w-4 text-blue-400" />;
    }
};

const getPriorityColor = (priority: Priority) => {
    switch (priority) {
        case 'high': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
        case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
        case 'low': return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
};

const getOriginIcon = (origin: string) => {
    switch (origin) {
        case 'Google': return <Search className="h-3 w-3" />;
        case 'Linkedin': return <Briefcase className="h-3 w-3" />;
        case 'Instagram': return <Target className="h-3 w-3" />;
        default: return <User className="h-3 w-3" />;
    }
};

// --- Components ---

const DealFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    columns: Column[];
    onSave: (deal: Partial<Deal>) => void;
}> = ({ isOpen, onClose, columns, onSave }) => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [contactName, setContactName] = useState('');
    const [value, setValue] = useState('');
    const [columnId, setColumnId] = useState('lead');
    const [temperature, setTemperature] = useState<Temperature>('cold');
    const [priority, setPriority] = useState<Priority>('medium');
    const [origin, setOrigin] = useState('Google');
    const [nextTask, setNextTask] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const probMap: Record<string, number> = {
            'lead': 10,
            'contact': 20,
            'pending': 40,
            'negotiation': 70,
            'won': 100
        };

        onSave({
            title,
            company,
            contactName,
            value: parseFloat(value) || 0,
            columnId,
            temperature,
            priority,
            origin: origin as any,
            nextTask: nextTask || 'Sem tarefa definida',
            probability: probMap[columnId] || 10,
            score: 50, // Default
            status: columnId === 'won' ? 'won' : 'open',
            lastActivity: 'Criado agora',
            owner: { name: 'Você', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }, // Mock current user
            tags: ['Novo']
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] transition-opacity duration-300 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--bg-card)] rounded-2xl shadow-xl w-full max-w-lg relative animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden border border-[var(--border-color)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-card)]">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Nova Oportunidade</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                    <form id="deal-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título da Oportunidade</label>
                            <input 
                                type="text" 
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Ex: Implantação de Sistema"
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Empresa</label>
                                <div className="relative">
                                    <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        required
                                        value={company}
                                        onChange={e => setCompany(e.target.value)}
                                        className="w-full p-2.5 pl-9 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contato</label>
                                <div className="relative">
                                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        required
                                        value={contactName}
                                        onChange={e => setContactName(e.target.value)}
                                        className="w-full p-2.5 pl-9 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor Estimado</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <input 
                                        type="number" 
                                        required
                                        value={value}
                                        onChange={e => setValue(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full p-2.5 pl-9 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estágio Inicial</label>
                                <select 
                                    value={columnId}
                                    onChange={e => setColumnId(e.target.value)}
                                    className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                >
                                    {columns.map(col => (
                                        <option key={col.id} value={col.id}>{col.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Temperatura</label>
                                <select 
                                    value={temperature}
                                    onChange={e => setTemperature(e.target.value as Temperature)}
                                    className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-sm outline-none"
                                >
                                    <option value="hot">Quente 🔥</option>
                                    <option value="warm">Morno ⚡</option>
                                    <option value="cold">Frio ❄️</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Prioridade</label>
                                <select 
                                    value={priority}
                                    onChange={e => setPriority(e.target.value as Priority)}
                                    className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-sm outline-none"
                                >
                                    <option value="high">Alta</option>
                                    <option value="medium">Média</option>
                                    <option value="low">Baixa</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Origem</label>
                                <select 
                                    value={origin}
                                    onChange={e => setOrigin(e.target.value)}
                                    className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-sm outline-none"
                                >
                                    <option value="Google">Google</option>
                                    <option value="Linkedin">Linkedin</option>
                                    <option value="Indicação">Indicação</option>
                                    <option value="Outbound">Outbound</option>
                                    <option value="Instagram">Instagram</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Próxima Tarefa</label>
                            <input 
                                type="text" 
                                value={nextTask}
                                onChange={e => setNextTask(e.target.value)}
                                placeholder="Ex: Ligar para agendar reunião"
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                            />
                        </div>
                    </form>
                </div>

                <div className="p-5 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-gray-700 dark:text-gray-300 hover:bg-[var(--bg-input)] transition-colors text-sm font-medium"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        form="deal-form"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

const MetricsHeader: React.FC<{ deals: Deal[], formatCurrency: (v: number) => string, salesTarget: number }> = ({ deals, formatCurrency, salesTarget }) => {
    const totalForecast = deals.filter(d => d.status === 'open').reduce((acc, d) => acc + d.value, 0);
    const weightedForecast = deals.filter(d => d.status === 'open').reduce((acc, d) => acc + (d.value * (d.probability / 100)), 0);
    const wonDeals = deals.filter(d => d.columnId === 'won');
    const conversionRate = deals.length > 0 ? (wonDeals.length / deals.length) * 100 : 0;
    const newDealsCount = deals.filter(d => d.columnId === 'lead').length;
    
    // Percentage of Goal Reached (Weighted)
    const goalPercentage = salesTarget > 0 ? Math.min((weightedForecast / salesTarget) * 100, 100) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Forecast (Previsto)</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{formatCurrency(totalForecast)}</p>
                    <p className="text-xs text-gray-400 mt-1">Ponderado: {formatCurrency(weightedForecast)}</p>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                    <TrendingUp className="h-6 w-6" />
                </div>
            </div>
            
            <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Vendas Realizadas</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">{wonDeals.length}</p>
                    <p className="text-xs text-gray-400 mt-1">Total: {formatCurrency(wonDeals.reduce((a,b) => a + b.value, 0))}</p>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
            </div>

            <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Conversão Funil</p>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{conversionRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-400 mt-1">{newDealsCount} novas op.</p>
                </div>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                    <PieChart className="h-6 w-6" />
                </div>
            </div>

            <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Meta (Forecast)</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{goalPercentage.toFixed(0)}%</p>
                    <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-amber-500" style={{width: `${goalPercentage}%`}}></div>
                    </div>
                </div>
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                    <Target className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
};

const DealCard: React.FC<{ 
    deal: Deal, 
    formatCurrency: (v: number) => string, 
    onDragStart: (e: React.DragEvent, id: string) => void,
    isDragging: boolean
}> = ({ deal, formatCurrency, onDragStart, isDragging }) => {
    return (
        <div 
            draggable
            onDragStart={(e) => onDragStart(e, deal.id)}
            className={`
                bg-[var(--bg-card)] p-4 rounded-xl shadow-sm border border-[var(--border-color)] 
                hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 
                transition-all cursor-grab active:cursor-grabbing mb-3 group relative select-none 
                active:scale-[0.98] active:shadow-inner
                ${isDragging ? 'opacity-50' : 'opacity-100'}
            `}
        >
            {/* Top Row: Badges & Temp */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2 items-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wide ${getPriorityColor(deal.priority)}`}>
                        {deal.priority === 'high' ? 'Alta' : deal.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                    {deal.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--bg-input)] text-gray-600 dark:text-gray-400 border border-[var(--border-color)]">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-1" title={`Lead Score: ${deal.score}`}>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{deal.score}</span>
                    {getTemperatureIcon(deal.temperature)}
                </div>
            </div>

            {/* Main Content */}
            <div className="mb-3">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight mb-1 hover:text-primary-600 transition-colors">
                    {deal.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Briefcase className="h-3 w-3" />
                    <span className="truncate font-medium">{deal.company}</span>
                    <span className="mx-1">•</span>
                    <span className="truncate">{deal.contactName}</span>
                </div>
            </div>

            {/* Value & Probability */}
            <div className="mb-4">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(deal.value)}</span>
                    <span className="text-[10px] text-gray-500 font-medium">{deal.probability}% chance</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                            deal.probability > 75 ? 'bg-green-500' : 
                            deal.probability > 40 ? 'bg-blue-500' : 'bg-gray-400'
                        }`} 
                        style={{ width: `${deal.probability}%` }}
                    />
                </div>
            </div>

            {/* Footer & Quick Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-2">
                    <img src={deal.owner.avatar} alt={deal.owner.name} className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700" title={`Dono: ${deal.owner.name}`} />
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 bg-[var(--bg-input)] px-1.5 py-0.5 rounded">
                        {getOriginIcon(deal.origin)}
                        <span>{deal.origin}</span>
                    </div>
                </div>

                {/* Quick Actions (Hover Visible) */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-[var(--bg-input)] rounded text-gray-500 hover:text-blue-600" title="Enviar Email">
                        <Mail className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 hover:bg-[var(--bg-input)] rounded text-gray-500 hover:text-green-600" title="Whatsapp">
                        <MessageCircle className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 hover:bg-[var(--bg-input)] rounded text-gray-500 hover:text-primary-600" title="Editar">
                        <Layout className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Warning if stale */}
            {deal.lastActivity.includes('2d') && deal.columnId !== 'won' && (
                <div className="absolute -right-1 -top-1">
                    <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                </div>
            )}
        </div>
    );
};

const ColumnHeader: React.FC<{ column: Column, deals: Deal[], formatCurrency: (v: number) => string }> = ({ column, deals, formatCurrency }) => {
    const totalValue = deals.reduce((acc, deal) => acc + deal.value, 0);
    const avgTicket = deals.length > 0 ? totalValue / deals.length : 0;
    
    return (
        <div className="mb-3">
            <div className={`bg-[var(--bg-card)] border-t-4 ${column.color} p-3 rounded-lg shadow-sm border-x border-b border-[var(--border-color)]`}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm uppercase tracking-wide">{column.title}</h3>
                    <span className="bg-[var(--bg-input)] text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full">
                        {deals.length}
                    </span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Total</p>
                        <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{formatCurrency(totalValue)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Ticket Médio</p>
                        <p className="font-medium text-gray-600 dark:text-gray-300 text-xs">{formatCurrency(avgTicket)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const OpportunitiesContent: React.FC<OpportunitiesContentProps> = ({ 
    currency, 
    okrs = [], 
    deals: propDeals, 
    setDeals: propSetDeals 
}) => {
    // If props are provided, use them (lifted state). If not, fallback to local (standalone dev).
    const [localDeals, setLocalDeals] = useState<Deal[]>(initialDeals);
    const deals = propDeals || localDeals;
    const setDeals = propSetDeals || setLocalDeals;

    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [draggingDealId, setDraggingDealId] = useState<string | null>(null);

    const filteredDeals = deals.filter(deal => 
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.contactName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);

    // --- Drag & Drop Handlers ---
    const onDragStart = (e: React.DragEvent, id: string) => {
        setDraggingDealId(id);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Allow drop
    };

    const onDrop = (e: React.DragEvent, columnId: string) => {
        if (!draggingDealId) return;
        
        const dealToMove = deals.find(d => d.id === draggingDealId);
        if (dealToMove && dealToMove.columnId !== columnId) {
            setDeals(prev => prev.map(d => 
                d.id === draggingDealId ? { ...d, columnId: columnId } : d
            ));
        }
        setDraggingDealId(null);
    };

    const handleSaveDeal = (newDealData: Partial<Deal>) => {
        const newDeal = {
            id: `d-${Date.now()}`,
            ...newDealData
        } as Deal;
        setDeals(prev => [...prev, newDeal]);
    };

    // OKR Integration (Sales Target)
    const salesOkr = okrs.find(o => o.area === 'sales');
    // Simplified logic to find a KR related to revenue
    const revenueKR = salesOkr?.keyResults.find(kr => kr.unit === 'R$' || kr.description.toLowerCase().includes('receita') || kr.description.toLowerCase().includes('venda'));
    const salesTarget = revenueKR ? revenueKR.target : 200000; // Default target

    return (
        <div className="h-[calc(100vh-9rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 pr-2 pb-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Oportunidades</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Gestão de Pipeline & CRM</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-sm focus:ring-2 focus:ring-primary-500 outline-none w-48 sm:w-64"
                        />
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm transition-colors text-sm font-medium"
                    >
                        <Plus className="h-4 w-4" />
                        Novo Negócio
                    </button>
                </div>
            </div>

            <MetricsHeader deals={deals} formatCurrency={formatCurrency} salesTarget={salesTarget} />

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 h-[calc(100%-200px)] min-h-[500px]">
                {columns.map(col => {
                    const colDeals = filteredDeals.filter(d => d.columnId === col.id);
                    return (
                        <div 
                            key={col.id} 
                            className="flex-shrink-0 w-80 flex flex-col h-full rounded-xl bg-gray-50/50 dark:bg-gray-800/20 border border-[var(--border-color)]"
                            onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, col.id)}
                        >
                            <div className="p-3">
                                <ColumnHeader column={col} deals={colDeals} formatCurrency={formatCurrency} />
                            </div>
                            <div className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                                {colDeals.map(deal => (
                                    <DealCard 
                                        key={deal.id} 
                                        deal={deal} 
                                        formatCurrency={formatCurrency} 
                                        onDragStart={onDragStart}
                                        isDragging={draggingDealId === deal.id}
                                    />
                                ))}
                                {colDeals.length === 0 && (
                                    <div className="h-24 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-400 text-xs">
                                        Arraste aqui
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <DealFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                columns={columns}
                onSave={handleSaveDeal}
            />
        </div>
    );
};
