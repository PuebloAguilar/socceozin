
import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  Trash2,
  Plus,
  Calendar as CalendarIcon,
  Check,
  Timer,
  X,
  Save,
  Tag,
  AlignLeft,
  Palette,
  Briefcase,
  Target,
  DollarSign,
  AlertCircle,
  Zap,
  Bot
} from 'lucide-react';
import { Meta } from '../../types';
import { Deal } from './OpportunitiesContent';
import { Contract } from './ContractsContent';
import { LoanItem } from './LoansPage';
import { Transaction } from './TransactionsContent';

// --- Interfaces & Types ---

type EventType = 'revision' | 'study' | 'class' | 'other' | 'automated';
type EventColor = 'cyan' | 'blue' | 'green' | 'orange' | 'red' | 'yellow' | 'slate' | 'purple' | 'auto';

interface CalendarEvent {
  id: string | number;
  type: EventType;
  category: string;
  title: string;
  description?: string;
  duration: string;
  date: string; // YYYY-MM-DD
  color: EventColor;
  isAutomated?: boolean;
  sourceModule?: 'Financeiro' | 'Comercial' | 'Estratégico' | 'Clientes';
}

interface AppointmentsContentProps {
    metas?: Meta[];
    deals?: Deal[];
    contracts?: Contract[];
    loans?: LoanItem[];
    transactions?: Transaction[];
}

// --- Constants & Helpers ---

const COLORS: Record<EventColor, string> = {
  cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800',
  purple: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  blue: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
  slate: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  green: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  orange: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
  red: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
  auto: 'bg-primary-50 text-primary-800 border-primary-200 dark:bg-primary-900/40 dark:text-primary-300 dark:border-primary-700 dashed border-2', // Special style for automated events
};

const CATEGORIES = ['Reunião', 'Tarefa', 'Follow-up', 'Pagamento', 'Estratégia', 'Outros'];

// Helper to get today string YYYY-MM-DD
const getTodayString = () => new Date().toISOString().split('T')[0];

// Helper to add days to a date
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Helper to get the start of the week (Sunday)
const getStartOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day; // adjust when day is sunday
  return new Date(date.setDate(diff));
};

// Helper to format date display (e.g. "Setembro, 2025")
const formatMonthYear = (date: Date) => {
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

// Helper to format date range (e.g. "21/09 - 27/09")
const formatDateRange = (start: Date, end: Date) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };
  return `${start.toLocaleDateString('pt-BR', options)} - ${end.toLocaleDateString('pt-BR', options)}`;
};

// --- Mock Initial Data Generator (Manual Events Only) ---
const generateInitialManualEvents = (): CalendarEvent[] => {
  const today = new Date();
  const start = getStartOfWeek(new Date(today));
  
  const createDate = (offset: number) => addDays(start, offset).toISOString().split('T')[0];

  return [
    { id: 'manual-1', type: 'study', category: 'Reunião', title: 'Alinhamento Semanal', duration: '1h00min', date: createDate(1), color: 'purple', isAutomated: false },
    { id: 'manual-2', type: 'other', category: 'Outros', title: 'Dentista', duration: '1h00min', date: createDate(3), color: 'slate', isAutomated: false },
  ];
};

// --- Components ---

const EventCard: React.FC<{ event: CalendarEvent; onClick: () => void }> = ({ event, onClick }) => {
  const getSourceIcon = () => {
      switch(event.sourceModule) {
          case 'Comercial': return <Target className="h-3 w-3" />;
          case 'Financeiro': return <DollarSign className="h-3 w-3" />;
          case 'Estratégico': return <Zap className="h-3 w-3" />;
          case 'Clientes': return <Briefcase className="h-3 w-3" />;
          default: return null;
      }
  };

  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`relative p-3 rounded-xl border mb-3 shadow-sm cursor-pointer hover:brightness-95 dark:hover:brightness-110 transition-all ${COLORS[event.color]} ${event.isAutomated ? 'pl-4' : ''}`}
    >
      {event.isAutomated && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-l-xl"></div>
      )}
      
      <div className="flex justify-between items-start mb-1">
          {event.category && (
            <div className="text-[10px] font-bold uppercase tracking-wide opacity-70 flex items-center gap-1">
              {getSourceIcon()}
              {event.category}
            </div>
          )}
          {event.isAutomated && (
              <Bot className="h-3 w-3 opacity-50" title="Gerado Automaticamente" />
          )}
      </div>

      <h4 className="font-semibold text-sm leading-tight mb-1">{event.title}</h4>
      {event.description && (
         <p className="text-xs opacity-80 mb-2 line-clamp-2">{event.description}</p>
      )}
      <div className="flex items-center gap-1 mt-2">
        <Clock className="h-3 w-3 opacity-60" />
        <span className="text-xs font-medium opacity-80">{event.duration}</span>
      </div>
    </div>
  );
};

const EventFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialData?: CalendarEvent | null;
  selectedDate?: string;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string | number) => void;
}> = ({ isOpen, onClose, initialData, selectedDate, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tarefa');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<EventColor>('blue');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setCategory(initialData.category);
        setDuration(initialData.duration);
        setDate(initialData.date);
        setDescription(initialData.description || '');
        setColor(initialData.color);
      } else {
        setTitle('');
        setCategory('Tarefa');
        setDuration('1h00min');
        setDate(selectedDate || getTodayString());
        setDescription('');
        setColor('blue');
      }
    }
  }, [isOpen, initialData, selectedDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    onSave({
      id: initialData?.id || `manual-${Date.now()}`,
      type: 'other',
      title,
      category,
      duration,
      date,
      description,
      color,
      isAutomated: false
    });
    onClose();
  };

  const isAuto = initialData?.isAutomated;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md relative animate-in fade-in zoom-in-95 p-6 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {initialData ? (isAuto ? 'Evento Automático' : 'Editar Evento') : 'Novo Evento'}
              </h2>
              {isAuto && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold">Auto</span>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        {isAuto && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-lg flex gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>Este evento foi gerado automaticamente pelo Sócio com base em suas metas, oportunidades ou finanças. Edições manuais podem ser sobrescritas.</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Reunião com Cliente" 
              className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
              required 
              autoFocus
              disabled={isAuto}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
              <div className="relative">
                <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2.5 pl-9 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none text-sm appearance-none"
                  disabled={isAuto}
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duração</label>
              <div className="relative">
                 <Timer className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                 <input 
                  type="text" 
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="Ex: 1h00min" 
                  className="w-full p-2.5 pl-9 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                  disabled={isAuto}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data</label>
            <input 
              type="date" 
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none text-sm dark:[color-scheme:dark]" 
              required
              disabled={isAuto}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição / Contexto</label>
             <div className="relative">
                <AlignLeft className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Detalhes..."
                  className="w-full p-2.5 pl-9 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none text-sm resize-none"
                  disabled={isAuto}
                />
             </div>
          </div>

          {!isAuto && (
              <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cor do Card</label>
                 <div className="flex flex-wrap gap-2">
                   {(Object.keys(COLORS).filter(c => c !== 'auto') as EventColor[]).map((c) => (
                     <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${COLORS[c].split(' ')[0]} ${color === c ? 'ring-2 ring-offset-2 ring-primary-500 border-transparent dark:ring-offset-gray-900' : 'border-transparent'}`}
                     />
                   ))}
                 </div>
              </div>
          )}

          <div className="flex gap-3 mt-6 pt-2">
            {!isAuto && initialData && (
              <button 
                type="button"
                onClick={() => { onDelete(initialData.id); onClose(); }}
                className="px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            {!isAuto ? (
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Salvar
                </button>
            ) : (
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  Fechar
                </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Component ---

export const AppointmentsContent: React.FC<AppointmentsContentProps> = ({ 
    metas = [], 
    deals = [], 
    contracts = [], 
    loans = [],
    transactions = []
}) => {
  // State
  const [currentDate, setCurrentDate] = useState(getStartOfWeek(new Date()));
  const [manualEvents, setManualEvents] = useState<CalendarEvent[]>(generateInitialManualEvents());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [targetDateForNew, setTargetDateForNew] = useState<string | null>(null);
  
  // Filters State - Simplified categories for the view
  const [activeFilters, setActiveFilters] = useState<string[]>(['Reunião', 'Tarefa', 'Follow-up', 'Pagamento', 'Estratégia', 'Outros']);

  // --- AUTOMATIC EVENT GENERATION LOGIC ---
  const automatedEvents = useMemo(() => {
      const autoEvents: CalendarEvent[] = [];
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 2); // Look ahead

      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];

      // 1. Opportunities (CRM)
      deals.forEach(deal => {
          if (deal.status === 'open') {
              // Logic: If there is a next task, schedule it for tomorrow (Immediate Action)
              // Or parse a date if we had one. For now, prompt says "Mark in agenda for tomorrow"
              autoEvents.push({
                  id: `deal-${deal.id}`,
                  type: 'other',
                  category: 'Follow-up',
                  title: `CRM: ${deal.nextTask} (${deal.company})`,
                  description: `Oportunidade de ${deal.title}. Valor: ${deal.value}`,
                  date: tomorrowString, // Schedule for tomorrow as per instructions
                  duration: '0h30min',
                  color: 'auto',
                  isAutomated: true,
                  sourceModule: 'Comercial'
              });
          }
      });

      // 2. Loans (Finance)
      loans.forEach(loan => {
          if (loan.status === 'active') {
              // Generate due date event for current month and next
              // Simplified: just find the next due date relative to today
              const dueDay = loan.dueDateDay;
              let targetDate = new Date(today.getFullYear(), today.getMonth(), dueDay);
              if (targetDate < today) {
                  targetDate.setMonth(targetDate.getMonth() + 1);
              }
              
              autoEvents.push({
                  id: `loan-${loan.id}`,
                  type: 'other',
                  category: 'Pagamento',
                  title: `Pagar Parcela: ${loan.title}`,
                  description: `Instituição: ${loan.bank}. Valor: ${loan.installmentValue}`,
                  date: targetDate.toISOString().split('T')[0],
                  duration: '0h15min',
                  color: 'auto',
                  isAutomated: true,
                  sourceModule: 'Financeiro'
              });
          }
      });

      // 3. Contracts (Clients)
      contracts.forEach(contract => {
          if (contract.status === 'active' || contract.status === 'expiring') {
              // Parse renovation date
              // Format usually YYYY-MM-DD in mock data
              const renovation = new Date(contract.renovationDate);
              // Add alert 1 week before? Or just on the day. Let's do on the day.
              autoEvents.push({
                  id: `contract-${contract.id}`,
                  type: 'other',
                  category: 'Reunião',
                  title: `Renovação: ${contract.clientName}`,
                  description: `Contrato vence em ${contract.renovationDate}. Valor: ${contract.value}`,
                  date: contract.renovationDate,
                  duration: '1h00min',
                  color: 'auto',
                  isAutomated: true,
                  sourceModule: 'Clientes'
              });
          }
      });

      // 4. Metas (Strategy)
      metas.forEach(meta => {
          meta.keyResults.forEach(kr => {
              // Add a "Focus Checkpoint" for KR halfway through or at end
              // Let's add the End Date as a Deadline
              autoEvents.push({
                  id: `kr-${kr.id}`,
                  type: 'revision',
                  category: 'Estratégia',
                  title: `Deadline KR: ${kr.description}`,
                  description: `Meta: ${meta.objective}. Alvo: ${kr.target}`,
                  date: kr.endDate,
                  duration: '0h00min', // All day logic effectively
                  color: 'auto',
                  isAutomated: true,
                  sourceModule: 'Estratégico'
              });
          });
      });

      return autoEvents;
  }, [metas, deals, contracts, loans, transactions]);

  const allEvents = useMemo(() => [...manualEvents, ...automatedEvents], [manualEvents, automatedEvents]);

  // Calculated Dates
  const weekDays = useMemo(() => {
    const days = [];
    const start = new Date(currentDate);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push({
        date: d,
        dateString: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
        dayNumber: d.getDate(),
        isToday: d.toISOString().split('T')[0] === getTodayString()
      });
    }
    return days;
  }, [currentDate]);

  const startDate = weekDays[0].date;
  const endDate = weekDays[6].date;

  // Handlers
  const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const handleResetToToday = () => setCurrentDate(getStartOfWeek(new Date()));

  const handleNewEvent = (date?: string) => {
    setEditingEvent(null);
    setTargetDateForNew(date || null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setTargetDateForNew(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    setManualEvents(prev => {
      const exists = prev.find(e => e.id === event.id);
      if (exists) {
        return prev.map(e => e.id === event.id ? event : e);
      }
      return [...prev, event];
    });
  };

  const handleDeleteEvent = (id: string | number) => {
    if (window.confirm("Deseja realmente remover este item do planejamento?")) {
      setManualEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleClearWeekManual = () => {
    if (window.confirm("Deseja limpar os eventos MANUAIS desta semana? (Eventos automáticos permanecerão)")) {
       const weekStrings = weekDays.map(wd => wd.dateString);
       setManualEvents(prev => prev.filter(e => !weekStrings.includes(e.date)));
    }
  };

  const toggleFilter = (cat: string) => {
      setActiveFilters(prev => 
        prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
      );
  };

  return (
    <div className="h-[calc(100vh-9rem)] flex flex-col bg-white dark:bg-[var(--bg-right)] rounded-xl overflow-hidden animate-in fade-in duration-300">
      
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-[var(--border-color)] bg-white dark:bg-[var(--bg-card)] shrink-0 gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 self-start sm:self-center">Agenda Integrada</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Seu cérebro operacional. Eventos sincronizados automaticamente.</p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-center">
             <button 
                onClick={handleResetToToday}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors text-sm font-medium shadow-sm"
            >
                <RefreshCw className="h-4 w-4" />
                Hoje
            </button>
            <button 
                onClick={handleClearWeekManual}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium shadow-sm"
            >
                <Trash2 className="h-4 w-4" />
                Limpar Manual
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Main Calendar Grid */}
         <div className="flex-1 flex flex-col overflow-hidden border-r border-[var(--border-color)]">
             {/* Calendar Nav Bar */}
             <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-white dark:bg-[var(--bg-card)]">
                <div className="flex items-center gap-4">
                    <button onClick={handlePrevWeek} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                    <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 capitalize min-w-[150px] text-center">
                        {formatMonthYear(currentDate)}
                    </h3>
                    <button onClick={handleNextWeek} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"><ChevronRight className="h-5 w-5" /></button>
                </div>
                
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:block">
                    Semana de {formatDateRange(startDate, endDate)}
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Mensal</button>
                    <button className="px-3 py-1 rounded-md text-sm font-medium bg-white dark:bg-[var(--bg-right)] shadow-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">Semanal</button>
                    <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Diário</button>
                </div>
             </div>

             {/* Weekly Grid */}
             <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 bg-gray-50 dark:bg-[var(--bg-right)] p-4">
                 <div className="grid grid-cols-7 gap-4 min-w-[1000px]">
                     {weekDays.map((day) => (
                         <div key={day.dateString} className="flex flex-col gap-3">
                             {/* Column Header */}
                             <div className={`text-center p-2 rounded-t-lg border-b-4 transition-colors ${day.isToday ? 'bg-primary-500 text-white border-primary-600 shadow-md' : 'bg-white dark:bg-[var(--bg-card)] text-gray-500 border-gray-200 dark:border-gray-700'}`}>
                                 <span className="block text-xs font-medium uppercase opacity-80">{day.dayName}</span>
                                 <span className="block text-xl font-bold">{day.dayNumber}</span>
                             </div>
                             
                             {/* Events Container */}
                             <div className="flex flex-col h-full min-h-[500px] rounded-b-lg">
                                {allEvents
                                    .filter(e => e.date === day.dateString && activeFilters.includes(e.category))
                                    .map(event => (
                                    <EventCard key={event.id} event={event} onClick={() => handleEditEvent(event)} />
                                ))}
                                <button 
                                    onClick={() => handleNewEvent(day.dateString)}
                                    className="mt-2 w-full py-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-primary-500 hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all flex items-center justify-center group"
                                >
                                    <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                </button>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
         </div>

         {/* Right Sidebar */}
         <div className="w-80 bg-white dark:bg-[var(--bg-card)] flex flex-col shrink-0 border-l border-[var(--border-color)]">
             {/* Mini Calendar (Visual Only) */}
             <div className="p-4 border-b border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase">{formatMonthYear(currentDate)}</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => <span key={d} className="text-xs font-bold text-gray-400">{d}</span>)}
                </div>
                {/* Simplified Grid Visualization */}
                <div className="grid grid-cols-7 gap-1 text-center">
                    {Array.from({length: 35}).map((_, i) => {
                         // Rough visual approx
                         const dayNum = i - 2; 
                         const isCurrentMonth = dayNum > 0 && dayNum <= 30;
                         const isSelected = isCurrentMonth && dayNum === weekDays[2].dayNumber; // Highlight approx "current" day
                         
                         return (
                            <div key={i} className={`
                                text-xs h-7 w-7 flex items-center justify-center rounded-full
                                ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-700' : 'text-gray-700 dark:text-gray-300'}
                                ${isSelected ? 'bg-primary-500 text-white font-bold' : ''}
                            `}>
                                {isCurrentMonth ? dayNum : ''}
                            </div>
                         )
                    })}
                </div>
             </div>
             
             <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Filtros de Origem</h4>
                    <button 
                        onClick={() => handleNewEvent()}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Adicionar Item"
                    >
                        <Plus className="h-4 w-4 text-primary-500" />
                    </button>
                </div>
                
                <div className="space-y-3">
                    {CATEGORIES.map((cat) => {
                        const isActive = activeFilters.includes(cat);
                        return (
                            <label key={cat} className="flex items-center gap-3 cursor-pointer group select-none">
                                <div 
                                    onClick={() => toggleFilter(cat)}
                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-primary-500 border-primary-500' : 'bg-transparent border-gray-300 dark:border-gray-600'}`}
                                >
                                    {isActive && <Check className="h-3.5 w-3.5 text-white" />}
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{cat}</span>
                            </label>
                        )
                    })}
                </div>

                <div className="mt-8 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
                    <h5 className="font-semibold text-primary-800 dark:text-primary-200 mb-2 flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        Automação Ativa
                    </h5>
                    <p className="text-xs text-primary-600 dark:text-primary-400 leading-relaxed">
                        Sua agenda está conectada aos módulos de Estratégia, CRM e Financeiro. Ações críticas aparecerão aqui automaticamente.
                    </p>
                </div>
             </div>

             {/* Floating Action Button */}
             <div className="p-6 flex justify-end">
                <button 
                    onClick={() => handleNewEvent()}
                    className="w-14 h-14 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center transform hover:scale-105 active:scale-95"
                    title="Adicionar Novo Item"
                >
                    <Plus className="h-7 w-7" />
                </button>
             </div>
         </div>
      </div>

      <EventFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingEvent}
        selectedDate={targetDateForNew}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};
