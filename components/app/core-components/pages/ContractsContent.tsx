
import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  DollarSign,
  Users,
  Target,
  FileCheck,
  Filter,
  Download,
  Mail,
  Calendar,
  Building2,
  User,
  Briefcase
} from "lucide-react";
import { SmartForecastWidget } from '../ui/SmartForecastWidget';
import { Meta } from '../../types';

// --- Interfaces & Types ---

export type ContractStatus = 'active' | 'pending' | 'canceled' | 'expiring';

export interface Contract {
    id: string;
    clientName: string;
    service: string;
    value: number;
    status: ContractStatus;
    startDate: string;
    renovationDate: string;
    contactPerson: string;
    email: string;
}

interface ContractsContentProps {
    currency: string;
    okrs?: Meta[];
    // Lifted State
    contracts?: Contract[];
    setContracts?: React.Dispatch<React.SetStateAction<Contract[]>>;
}

// --- Mock Data ---

export const initialContracts: Contract[] = [
    { id: 'c1', clientName: 'Agill Transportes', service: 'Licença Enterprise', value: 12000, status: 'active', startDate: '2024-01-15', renovationDate: '2025-01-15', contactPerson: 'Carlos Diretor', email: 'carlos@agill.com.br' },
    { id: 'c2', clientName: 'TechSolutions LTDA', service: 'Manutenção Mensal', value: 3500, status: 'active', startDate: '2023-06-10', renovationDate: '2024-06-10', contactPerson: 'Mariana Silva', email: 'mariana@tech.com' },
    { id: 'c3', clientName: 'Grupo Varejo S.A.', service: 'Consultoria Estratégica', value: 8000, status: 'expiring', startDate: '2023-11-01', renovationDate: '2024-11-01', contactPerson: 'Roberto Costa', email: 'beto@grupovarejo.com' },
    { id: 'c4', clientName: 'StartUp Inovação', service: 'Mentoria Growth', value: 2500, status: 'pending', startDate: '2024-03-01', renovationDate: '2025-03-01', contactPerson: 'Julia Founder', email: 'julia@startup.io' },
    { id: 'c5', clientName: 'Antiga Logística', service: 'Sistema Legacy', value: 1500, status: 'canceled', startDate: '2022-01-01', renovationDate: '2023-01-01', contactPerson: 'Pedro Santos', email: 'pedro@antiga.com' },
];

// --- Helper Functions ---

const getContractStatusBadge = (status: ContractStatus) => {
    switch (status) {
        case 'active': return <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Ativo</span>;
        case 'pending': return <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold flex items-center gap-1"><Clock className="h-3 w-3"/> Pendente</span>;
        case 'expiring': return <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3"/> A Vencer</span>;
        case 'canceled': return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 text-xs font-bold flex items-center gap-1"><X className="h-3 w-3"/> Cancelado</span>;
    }
};

const ClientFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: Contract) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [clientName, setClientName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [email, setEmail] = useState('');
    const [service, setService] = useState('');
    const [value, setValue] = useState('');
    const [startDate, setStartDate] = useState('');
    const [status, setStatus] = useState<ContractStatus>('active');

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setClientName('');
            setContactPerson('');
            setEmail('');
            setService('');
            setValue('');
            setStartDate(new Date().toISOString().split('T')[0]);
            setStatus('active');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Calculate a dummy renovation date (1 year later)
        const start = new Date(startDate);
        const renovation = new Date(start);
        renovation.setFullYear(renovation.getFullYear() + 1);

        const newClient: Contract = {
            id: `new_${Date.now()}`,
            clientName,
            contactPerson,
            email,
            service,
            value: parseFloat(value) || 0,
            status,
            startDate,
            renovationDate: renovation.toISOString().split('T')[0]
        };

        onSave(newClient);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] transition-opacity duration-300 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--bg-card)] rounded-2xl shadow-xl w-full max-w-lg relative animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden border border-[var(--border-color)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-card)]">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Novo Cliente</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                    <form id="client-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Cliente / Empresa</label>
                            <div className="relative">
                                <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    required
                                    value={clientName}
                                    onChange={e => setClientName(e.target.value)}
                                    placeholder="Ex: Empresa X Ltda"
                                    className="w-full p-2.5 pl-9 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contato Principal</label>
                                <div className="relative">
                                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={contactPerson}
                                        onChange={e => setContactPerson(e.target.value)}
                                        placeholder="Nome"
                                        className="w-full p-2.5 pl-9 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="email@empresa.com"
                                        className="w-full p-2.5 pl-9 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serviço Contratado</label>
                            <div className="relative">
                                <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    required
                                    value={service}
                                    onChange={e => setService(e.target.value)}
                                    placeholder="Ex: Consultoria Mensal"
                                    className="w-full p-2.5 pl-9 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor Recorrente (Mensal)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <input 
                                        type="number" 
                                        required
                                        value={value}
                                        onChange={e => setValue(e.target.value)}
                                        placeholder="0.00"
                                        step="0.01"
                                        className="w-full p-2.5 pl-9 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Início do Contrato</label>
                                <div className="relative">
                                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <input 
                                        type="date" 
                                        required
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="w-full p-2.5 pl-9 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm dark:[color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Inicial</label>
                            <select 
                                value={status}
                                onChange={e => setStatus(e.target.value as ContractStatus)}
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                            >
                                <option value="active">Ativo</option>
                                <option value="pending">Pendente</option>
                                <option value="expiring">A Vencer</option>
                                <option value="canceled">Cancelado</option>
                            </select>
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
                        form="client-form"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Adicionar Cliente
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ContractsContent: React.FC<ContractsContentProps> = ({ currency, okrs = [], contracts: propContracts, setContracts: propSetContracts }) => {
    // If props are provided, use them (lifted state). If not, fallback to local (standalone dev).
    const [localContracts, setLocalContracts] = useState<Contract[]>(initialContracts);
    const contracts = propContracts || localContracts;
    const setContracts = propSetContracts || setLocalContracts;

    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);

    const filteredContracts = contracts.filter(c => 
        c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeContracts = contracts.filter(c => c.status === 'active');
    const mrr = activeContracts.reduce((acc, c) => acc + c.value, 0);
    const expiringCount = contracts.filter(c => c.status === 'expiring').length;
    const ticketMedio = activeContracts.length > 0 ? mrr / activeContracts.length : 0;
    const previousMrr = mrr * 0.95; 
    const mrrGrowth = previousMrr > 0 ? ((mrr - previousMrr) / previousMrr) * 100 : 0;

    // --- OKR Integration: Product/Revenue ---
    const productOkr = okrs.find(o => o.area === 'product');
    const mrrKR = productOkr?.keyResults.find(kr => kr.unit === 'R$' || kr.description.toLowerCase().includes('mrr'));
    const churnKR = productOkr?.keyResults.find(kr => kr.description.toLowerCase().includes('churn'));
    
    // Default targets if OKR not set
    const mrrTarget = mrrKR ? mrrKR.target : 100000;
    const churnTarget = churnKR ? churnKR.target : 3; // 3%

    const getContractsForecast = () => {
        const churnRate = 1.8; // Hardcoded simulation for now

        // Check Churn OKR First (Critical)
        if (churnRate > churnTarget) {
             return {
                forceColor: 'red' as 'red',
                customTitle: "Alerta de Retenção (OKR)",
                customText: `Sua taxa de churn está acima da meta de ${churnTarget}%. A prioridade do OKR é retenção. Foque nos contratos a vencer.`,
                nextStep: "Agendar call de Customer Success com todos os clientes 'A Vencer'."
            };
        }

        // Check MRR OKR
        const gapMrr = mrrTarget - mrr;
        if (gapMrr > 0) {
             return {
                forceColor: 'neutral' as 'neutral',
                customTitle: "Foco no MRR",
                customText: `Faltam ${formatCurrency(gapMrr)} para bater a meta do OKR de Produto. Busque upsell na base atual.`,
                nextStep: "Ofertar upgrade de plano para clientes com NPS alto."
            };
        }

        return {
            forceColor: 'green' as 'green',
            customTitle: "Meta de MRR Atingida",
            customText: "Parabéns! Você superou o objetivo de receita recorrente definido no OKR. Foque em manter a qualidade.",
            nextStep: "Validar satisfação dos clientes recentes para garantir retenção de longo prazo."
        };
    };

    const handleSaveClient = (newClient: Contract) => {
        setContracts(prev => [newClient, ...prev]);
    };

    return (
        <div className="h-[calc(100vh-9rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 pr-2 pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestão de Clientes</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie seus clientes recorrentes e assinaturas.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-[var(--bg-card)] border border-[var(--border-color)] text-gray-700 dark:text-gray-300 hover:bg-[var(--bg-input)] px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
                        <Download className="h-4 w-4" />
                        Exportar
                    </button>
                    <button 
                        onClick={() => setIsFormModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Novo Cliente
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">MRR (Recorrência)</p>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <DollarSign className="h-4 w-4 text-green-500" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(mrr)}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <span className="text-green-500 font-bold">+{mrrGrowth.toFixed(1)}%</span> vs mês anterior
                    </p>
                </div>
                <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Clientes Ativos</p>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Users className="h-4 w-4 text-blue-500" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeContracts.length}</p>
                    <p className="text-xs text-gray-400 mt-1">{contracts.length} contratos totais</p>
                </div>
                <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ticket Médio</p>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <Target className="h-4 w-4 text-purple-500" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(ticketMedio)}</p>
                    <p className="text-xs text-gray-400 mt-1">Por cliente ativo</p>
                </div>
                <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">A Vencer (30d)</p>
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{expiringCount}</p>
                    <p className="text-xs text-gray-400 mt-1">Ação necessária</p>
                </div>
            </div>
            
            <div className="mb-6">
                <SmartForecastWidget {...getContractsForecast()} />
            </div>

            {/* Filters Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-color)] shadow-sm">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar cliente, contato..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] text-sm outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-input)] text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        <Filter className="h-3.5 w-3.5" />
                        Status
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-input)] text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        <DollarSign className="h-3.5 w-3.5" />
                        Valor
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-input)] text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        <Clock className="h-3.5 w-3.5" />
                        Data de Renovação
                    </button>
                </div>
            </div>

            {/* Contracts Table */}
            <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-[var(--bg-input)] border-b border-[var(--border-color)]">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Cliente / Contato</th>
                                <th className="px-6 py-3 font-semibold">Serviço</th>
                                <th className="px-6 py-3 font-semibold">Status</th>
                                <th className="px-6 py-3 font-semibold">Valor Recorrente</th>
                                <th className="px-6 py-3 font-semibold">Vigência</th>
                                <th className="px-6 py-3 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {filteredContracts.length > 0 ? (
                                filteredContracts.map(contract => (
                                    <tr key={contract.id} className="hover:bg-[var(--bg-input)] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xs">
                                                    {contract.clientName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{contract.clientName}</p>
                                                    <p className="text-xs text-gray-500">{contract.contactPerson}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700 dark:text-gray-300">{contract.service}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getContractStatusBadge(contract.status)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                            {formatCurrency(contract.value)}
                                            <span className="text-gray-400 text-xs font-normal ml-1">/mês</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-gray-400"/> Início: {new Date(contract.startDate).toLocaleDateString('pt-BR')}</span>
                                                <span className={`flex items-center gap-1 ${contract.status === 'expiring' ? 'text-orange-600 dark:text-orange-400 font-bold' : ''}`}>
                                                    <Clock className="h-3 w-3 text-gray-400"/> Renova: {new Date(contract.renovationDate).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-all">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileCheck className="h-10 w-10 mb-2 opacity-20" />
                                            <p>Nenhum cliente encontrado.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ClientFormModal 
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSaveClient}
            />
        </div>
    );
};
