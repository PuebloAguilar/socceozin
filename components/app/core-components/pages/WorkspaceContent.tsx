
import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Layers, 
  Megaphone, 
  Code2, 
  DollarSign, 
  Edit2, 
  X, 
  Save, 
  AlertTriangle, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  Trash2,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  Link
} from 'lucide-react';
import { Meta, KeyResult, AreaType, MetaStatus } from '../../types';

interface WorkspaceContentProps {
    metas?: Meta[];
    onUpdateMetas?: (metas: Meta[]) => void;
}

const AREAS_CONFIG = [
  { id: 'all', label: 'Visão Geral', icon: Layers },
  { id: 'management', label: 'Gestão', icon: Briefcase },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'sales', label: 'Vendas', icon: DollarSign },
  { id: 'product', label: 'Produto', icon: Target },
  { id: 'tech', label: 'Tecnologia', icon: Code2 },
];

// --- Helper Functions ---

const calculateMetaProgress = (meta: Meta): number => {
  const totalWeight = meta.keyResults.reduce((acc, kr) => acc + kr.weight, 0);
  const weightedProgress = meta.keyResults.reduce((acc, kr) => {
    const progress = Math.min((kr.current / kr.target) * 100, 100);
    return acc + (progress * kr.weight);
  }, 0);
  
  return totalWeight > 0 ? weightedProgress / totalWeight : 0;
};

const getStatus = (progress: number): MetaStatus => {
  if (progress >= 70) return 'on_track';
  if (progress >= 40) return 'at_risk';
  return 'off_track';
};

const getStatusColor = (status: MetaStatus) => {
  switch (status) {
    case 'on_track': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'at_risk': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
    case 'off_track': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
  }
};

const getProgressBarColor = (status: MetaStatus) => {
  switch (status) {
    case 'on_track': return 'bg-emerald-500';
    case 'at_risk': return 'bg-amber-500';
    case 'off_track': return 'bg-red-500';
  }
};

const getStatusLabel = (status: MetaStatus) => {
  switch (status) {
    case 'on_track': return 'No Prazo';
    case 'at_risk': return 'Atenção';
    case 'off_track': return 'Crítico';
  }
};

const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

// --- Components ---

const StrategicOverview: React.FC<{ metas: Meta[] }> = ({ metas }) => {
    const totalProgress = metas.reduce((acc, m) => acc + calculateMetaProgress(m), 0) / (metas.length || 1);
    const globalStatus = getStatus(totalProgress);
    
    const alerts = metas.filter(o => getStatus(calculateMetaProgress(o)) === 'off_track').length;
    const warnings = metas.filter(o => getStatus(calculateMetaProgress(o)) === 'at_risk').length;

    return (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 mb-8 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Visão Geral Estratégica</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
                {/* Score Global */}
                <div className="flex items-center gap-4 px-2">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-gray-800" />
                            <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="8" 
                                className={`${globalStatus === 'on_track' ? 'text-emerald-500' : globalStatus === 'at_risk' ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000`}
                                strokeDasharray={`${(totalProgress / 100) * 226} 226`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute text-xl font-bold text-gray-900 dark:text-gray-100">{Math.round(totalProgress)}%</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Score Global</p>
                        <p className={`text-lg font-bold ${globalStatus === 'on_track' ? 'text-emerald-600' : globalStatus === 'at_risk' ? 'text-amber-500' : 'text-red-600'}`}>
                            {getStatusLabel(globalStatus)}
                        </p>
                    </div>
                </div>

                {/* Ciclo */}
                <div className="flex flex-col justify-center px-6 pt-4 md:pt-0">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Ciclo Atual</span>
                        <span className="text-xs font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded dark:bg-primary-900/30 dark:text-primary-400">Q4 2025</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden mb-1">
                        <div className="bg-primary-500 h-full w-[50%]"></div>
                    </div>
                    <p className="text-xs text-gray-400 text-right">Metas ativas para o trimestre.</p>
                </div>

                {/* Alertas */}
                <div className="flex flex-col justify-center px-6 pt-4 md:pt-0 gap-3">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            Críticos (Off Track)
                        </span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{alerts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            Atenção (At Risk)
                        </span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{warnings}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetaCard: React.FC<{ meta: Meta, onEdit: (meta: Meta) => void }> = ({ meta, onEdit }) => {
    const progress = calculateMetaProgress(meta);
    const status = getStatus(progress);
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden hover:shadow-md transition-shadow mb-4">
            <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                        <button onClick={() => setExpanded(!expanded)} className="mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getStatusColor(status)}`}>
                                    {getStatusLabel(status)}
                                </span>
                                <span className="text-xs text-gray-400">• {meta.cycle}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                {meta.objective}
                            </h3>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Math.round(progress)}%</span>
                        </div>
                        <button 
                            onClick={() => onEdit(meta)}
                            className="p-2 hover:bg-[var(--bg-input)] rounded-lg text-gray-400 hover:text-primary-600 transition-colors"
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Objective Progress Bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden mb-4">
                    <div 
                        className={`h-full ${getProgressBarColor(status)} transition-all duration-1000`} 
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Key Results */}
                {expanded && (
                    <div className="space-y-4 pt-2 border-t border-[var(--border-color)]">
                        {meta.keyResults.map(kr => {
                            const krProgress = Math.min((kr.current / kr.target) * 100, 100);
                            const krStatus = getStatus(krProgress);
                            
                            // Encontrar dependência (se houver) para exibir tooltip ou ícone
                            const dependency = meta.keyResults.find(k => k.id === kr.dependencyId);

                            return (
                                <div key={kr.id} className="group">
                                    <div className="flex justify-between items-center mb-1 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                                                {krStatus === 'on_track' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : 
                                                krStatus === 'at_risk' ? <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> :
                                                <AlertCircle className="h-3.5 w-3.5 text-red-500" />}
                                                {kr.description}
                                                {dependency && (
                                                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 flex items-center gap-1" title={`Depende de: ${dependency.description}`}>
                                                        <Link className="h-3 w-3" /> Dep
                                                    </span>
                                                )}
                                            </span>
                                            <span className="text-[10px] text-gray-400 ml-5">
                                                {new Date(kr.startDate).toLocaleDateString()} - {new Date(kr.endDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">
                                            {kr.unit === 'R$' ? formatCurrency(kr.current) : kr.current} 
                                            <span className="text-[10px] mx-1">/</span> 
                                            {kr.unit === 'R$' ? formatCurrency(kr.target) : `${kr.target}${kr.unit}`}
                                        </span>
                                    </div>
                                    <div className="w-full bg-[var(--bg-input)] h-1.5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${getProgressBarColor(krStatus)} opacity-80`} 
                                            style={{ width: `${krProgress}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-4 pt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <img src={meta.owner.avatar} alt={meta.owner.name} className="w-5 h-5 rounded-full border border-[var(--border-color)]" />
                        <span>Responsável: {meta.owner.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RecommendationsPanel: React.FC<{ metas: Meta[] }> = ({ metas }) => {
    const criticalKRs = metas.flatMap(o => o.keyResults.map(kr => ({...kr, parentArea: o.area}))).filter(kr => {
        const p = (kr.current / kr.target) * 100;
        return p < 40;
    });

    return (
        <div className="bg-gradient-to-br from-primary-900/5 to-primary-900/10 dark:from-primary-900/20 dark:to-primary-900/5 rounded-xl border border-primary-200 dark:border-primary-800 p-5">
            <h3 className="text-primary-800 dark:text-primary-200 font-bold flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5" />
                Próximos Passos Recomendados
            </h3>
            
            <div className="space-y-3">
                {criticalKRs.slice(0, 3).map((kr, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white dark:bg-[var(--bg-card)] p-3 rounded-lg shadow-sm border border-[var(--border-color)]">
                        <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-md text-red-600 dark:text-red-400 mt-0.5">
                            <AlertCircle className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Atenção em "{kr.description}"
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Este resultado chave está crítico. Verifique o cronograma de execução.
                            </p>
                        </div>
                    </div>
                ))}
                
                {criticalKRs.length === 0 && (
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Tudo parece estar nos trilhos! Suas Metas estão avançando bem.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const MetaFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    initialData?: Meta | null;
    onSave: (meta: Meta) => void;
}> = ({ isOpen, onClose, initialData, onSave }) => {
    const [area, setArea] = useState<AreaType>('sales');
    const [objective, setObjective] = useState('');
    const [cycle, setCycle] = useState('Q4 2025');
    
    // Default dates for new KRs
    const defaultStart = new Date().toISOString().split('T')[0];
    const defaultEnd = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];

    const [krs, setKrs] = useState<KeyResult[]>([
        { id: 'new-kr-1', description: '', current: 0, target: 100, unit: '#', weight: 50, startDate: defaultStart, endDate: defaultEnd }
    ]);

    React.useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setArea(initialData.area);
                setObjective(initialData.objective);
                setCycle(initialData.cycle);
                setKrs(initialData.keyResults);
            } else {
                setArea('sales');
                setObjective('');
                setCycle('Q4 2025');
                setKrs([{ id: `new-kr-${Date.now()}`, description: '', current: 0, target: 100, unit: '#', weight: 100, startDate: defaultStart, endDate: defaultEnd }]);
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleAddKr = () => {
        setKrs([...krs, { id: `new-kr-${Date.now()}`, description: '', current: 0, target: 100, unit: '#', weight: 0, startDate: defaultStart, endDate: defaultEnd }]);
    };

    const handleRemoveKr = (id: string) => {
        setKrs(krs.filter(k => k.id !== id));
    };

    const updateKr = (id: string, field: keyof KeyResult, value: any) => {
        setKrs(krs.map(k => k.id === id ? { ...k, [field]: value } : k));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialData?.id || `meta-${Date.now()}`,
            area,
            objective,
            cycle,
            owner: initialData?.owner || { name: 'Eu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
            keyResults: krs
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[70] transition-opacity duration-300 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--bg-card)] rounded-xl shadow-2xl w-full max-w-3xl relative animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden border border-[var(--border-color)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-card)]">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{initialData ? 'Editar Meta' : 'Nova Meta'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                    <form id="meta-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Área</label>
                                <select 
                                    value={area}
                                    onChange={e => setArea(e.target.value as AreaType)}
                                    className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                >
                                    <option value="management">Gestão</option>
                                    <option value="sales">Vendas</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="product">Produto</option>
                                    <option value="tech">Tecnologia</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ciclo</label>
                                <select 
                                    value={cycle}
                                    onChange={e => setCycle(e.target.value)}
                                    className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                >
                                    <option value="Q4 2025">Q4 2025 (Out-Dez)</option>
                                    <option value="Q1 2026">Q1 2026 (Jan-Mar)</option>
                                    <option value="Anual 2025">Anual 2025</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Objetivo (Onde queremos chegar?)</label>
                            <input 
                                type="text"
                                required
                                value={objective}
                                onChange={e => setObjective(e.target.value)}
                                placeholder="Ex: Tornar-se referência regional em..."
                                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm font-semibold"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Key Results (Execução & Métricas)</label>
                                <button type="button" onClick={handleAddKr} className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                                    <Plus className="h-3 w-3" /> Adicionar KR
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {krs.map((kr, index) => (
                                    <div key={kr.id} className="p-4 bg-[var(--bg-input)] rounded-lg border border-[var(--border-color)] relative group">
                                        <div className="flex gap-3 mb-3">
                                            <div className="flex-1">
                                                <input 
                                                    type="text"
                                                    value={kr.description}
                                                    onChange={e => updateKr(kr.id, 'description', e.target.value)}
                                                    placeholder="O que será feito/medido?"
                                                    className="w-full bg-transparent border-b border-[var(--border-color)] pb-1 outline-none text-sm font-medium placeholder-gray-400 focus:border-primary-500 transition-colors"
                                                    required
                                                />
                                            </div>
                                            {krs.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveKr(kr.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                            <div>
                                                <label className="text-[10px] text-gray-500 uppercase font-bold">Data Início</label>
                                                <input 
                                                    type="date"
                                                    value={kr.startDate}
                                                    onChange={e => updateKr(kr.id, 'startDate', e.target.value)}
                                                    className="w-full p-1.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-xs dark:[color-scheme:dark]"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-gray-500 uppercase font-bold">Data Fim</label>
                                                <input 
                                                    type="date"
                                                    value={kr.endDate}
                                                    onChange={e => updateKr(kr.id, 'endDate', e.target.value)}
                                                    className="w-full p-1.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-xs dark:[color-scheme:dark]"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4 items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">Atual:</span>
                                                <input 
                                                    type="number"
                                                    value={kr.current}
                                                    onChange={e => updateKr(kr.id, 'current', parseFloat(e.target.value))}
                                                    className="w-20 p-1.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-sm"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">Meta:</span>
                                                <input 
                                                    type="number"
                                                    value={kr.target}
                                                    onChange={e => updateKr(kr.id, 'target', parseFloat(e.target.value))}
                                                    className="w-20 p-1.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-sm"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">Unid:</span>
                                                <input 
                                                    type="text"
                                                    value={kr.unit}
                                                    onChange={e => updateKr(kr.id, 'unit', e.target.value)}
                                                    placeholder="#"
                                                    className="w-16 p-1.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Dependency Selector */}
                                        <div className="flex items-center gap-2">
                                            <Link className="h-3 w-3 text-gray-400" />
                                            <span className="text-xs text-gray-500">Dependência (Gantt):</span>
                                            <select 
                                                value={kr.dependencyId || ''}
                                                onChange={(e) => updateKr(kr.id, 'dependencyId', e.target.value === '' ? undefined : e.target.value)}
                                                className="flex-1 p-1.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-xs outline-none"
                                            >
                                                <option value="">Nenhuma (Inicia livre)</option>
                                                {krs.filter(k => k.id !== kr.id).map(otherKr => (
                                                    <option key={otherKr.id} value={otherKr.id}>
                                                        {otherKr.description ? otherKr.description : 'Novo KR...'}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-5 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-gray-700 dark:text-gray-300 hover:bg-[var(--bg-input)] transition-colors text-sm font-medium">Cancelar</button>
                    <button type="submit" form="meta-form" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2">
                        <Save className="h-4 w-4" /> Salvar Meta
                    </button>
                </div>
            </div>
        </div>
    );
};

export const WorkspaceContent: React.FC<WorkspaceContentProps> = ({ metas = [], onUpdateMetas }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null);

  const filteredMetas = selectedFilter === 'all' 
    ? metas 
    : metas.filter(o => o.area === selectedFilter);

  const handleSaveMeta = (newMeta: Meta) => {
    if (!onUpdateMetas) return;
    
    const exists = metas.find(o => o.id === newMeta.id);
    let updatedMetas;
    if (exists) {
        updatedMetas = metas.map(o => o.id === newMeta.id ? newMeta : o);
    } else {
        updatedMetas = [...metas, newMeta];
    }
    onUpdateMetas(updatedMetas);
  };

  const handleEdit = (meta: Meta) => {
      setEditingMeta(meta);
      setIsModalOpen(true);
  };

  const handleNew = () => {
      setEditingMeta(null);
      setIsModalOpen(true);
  };

  return (
    <div className="h-[calc(100vh-9rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 pr-2 pb-4 flex flex-col gap-8">
      
      <section className="animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Target className="h-6 w-6 text-primary-500" />
              Metas Estratégicas
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                O Core do seu negócio. Defina aqui onde quer chegar e o Plano de Ação (Planejamento) será gerado automaticamente.
            </p>
          </div>
          <button 
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" /> Nova Meta
          </button>
        </div>

        <StrategicOverview metas={metas} />

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none border-b border-[var(--border-color)]">
          {AREAS_CONFIG.map(area => {
            const Icon = area.icon;
            const isSelected = selectedFilter === area.id;
            return (
              <button
                key={area.id}
                onClick={() => setSelectedFilter(area.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-t border-x border-b-0 text-sm font-medium transition-all whitespace-nowrap mb-[-1px]
                  ${isSelected 
                    ? 'bg-[var(--bg-right)] border-[var(--border-color)] text-primary-600 dark:text-primary-400 border-b-[var(--bg-right)]' 
                    : 'bg-transparent border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                <Icon className="h-4 w-4" />
                {area.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
                {filteredMetas.length > 0 ? (
                    filteredMetas.map(meta => (
                        <MetaCard key={meta.id} meta={meta} onEdit={handleEdit} />
                    ))
                ) : (
                    <div className="py-12 text-center border-2 border-dashed border-[var(--border-color)] rounded-xl">
                        <Target className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Nenhuma Meta definida para esta área.</p>
                        <button onClick={handleNew} className="text-primary-600 font-medium text-sm mt-2 hover:underline">Criar Primeira Meta</button>
                    </div>
                )}
            </div>

            <div className="w-full lg:w-80 shrink-0">
                <div className="sticky top-4">
                    <RecommendationsPanel metas={metas} />
                </div>
            </div>
        </div>
      </section>

      <MetaFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingMeta}
        onSave={handleSaveMeta}
      />

    </div>
  );
};
