
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardBackground, Spotlight } from './LoginPage';
import { ArrowRight, ArrowLeft, Check, Building2, User, Target, Palette, Monitor, Moon, Sun, LayoutGrid, Briefcase, Users, DollarSign, BarChart3, Zap, BookOpen, MessageCircle, Clock, TrendingUp, Scale, ShieldAlert, CalendarClock, Wallet, CreditCard, PieChart, FileText, MousePointerClick, Package, MonitorPlay, Layers, Info, TrendingDown, ShieldCheck, Sunrise, Sunset, Coffee, Utensils, BellOff, CalendarCheck } from 'lucide-react';

// Temas sincronizados com o SettingsContent
const PRESET_THEMES = [
  {
    id: "theme-01",
    name: "Theme 01 (Padrão)",
    // [light_bg_right, dark_bg_right] para preview
    colors: ['#f3f4f6', '#030712'] 
  },
  {
    id: "theme-02",
    name: "Theme 02 (Suave)",
    colors: ['#F5F5F5', '#4F5054']
  },
  {
    id: "theme-03",
    name: "Theme 03 (Minimalista)",
    colors: ['#FAF9F5', '#252523']
  }
];

interface OnboardingPageProps {
    initialName: string;
    onFinish: (data: any) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ initialName, onFinish }) => {
    // Começa no passo 0 (Boas-vindas)
    const [step, setStep] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [consentGiven, setConsentGiven] = useState(false);
    const totalSteps = 18; 
    
    // Extrai apenas o primeiro nome para a saudação
    const firstName = initialName.split(' ')[0];

    const [formData, setFormData] = useState({
        // 0. Basic
        nome_preferido: firstName || '',
        nome_empresa: '',
        
        // Contexto Geral
        usage_context: 'empresa' as 'pessoal' | 'empresa' | 'ambos',
        work_mode: 'solo' as 'solo' | 'equipe',
        team_size: '',
        team_roles: '',

        // Negócio
        pitch_10s: '',
        business_model: '' as 'produto' | 'servico' | 'infoproduto' | 'hibrido',
        niche: '',
        legal_format: '',
        operation_time: '',

        // Canais e Volume
        acquisition_channel: '',
        channel_percentage: '',
        active_customers: '',
        capacity_limit: '',
        seasonality: '' as 'sim' | 'nao',

        // Dores e Desafios
        routine_bottleneck: '' as 'planejar' | 'executar' | 'controlar',
        main_bother: '' as 'dinheiro' | 'vendas' | 'rotina' | 'clareza',
        operational_bottleneck_detail: '',

        // Financeiro
        financial_pain: '',
        numbers_feeling: '',
        cash_reality: '',
        average_revenue: '', 
        debts: '',
        average_ticket: '', 

        // Visão Futura
        objective_90d: '',
        vision_12m: '',
        vision_final: '',

        // Conhecimento & Vida
        knowledge_level: 'intermediario' as 'iniciante' | 'intermediario' | 'avancado',
        education_history: '',
        references: '',
        life_context: '',

        // Estilo de Comunicação
        communication_style: 'direto' as 'direto' | 'didatico' | 'motivador',
        interaction_frequency: 'diario' as 'diario' | 'semanal' | 'demanda',

        // Rotina & Follow-up (Valores Padrão Ajustados para UX melhor)
        wake_up_time: '07:00',
        morning_followup_pref: '' as 'acordar' | 'manha' | 'nao',
        
        work_start_time: '09:00',
        work_end_time: '18:00',
        lunch_schedule_type: '' as 'fixo' | 'varia' | 'trabalhando',
        lunch_time: '12:00',

        daily_review_pref: '' as 'tarde' | 'noite' | 'manha' | 'nao',
        weekly_review_pref: '' as 'sexta' | 'segunda' | 'fim_semana' | 'outro',
        weekly_review_custom: '',

        dnd_prefs: [] as string[], // Multi-select para "Não Perturbe"
        dnd_start_time: '22:00',
        dnd_end_time: '07:00',

        // Carteiras
        selected_banks: [] as string[],
        uses_credit_card: '' as 'sim' | 'nao' | 'debito',

        // Categorias
        selected_categories: [] as string[],

        // Contratos
        revenue_model: '' as 'recorrencia' | 'projetos' | 'transacional',
        average_contract_value: '',

        // Vendas (CRM)
        acquisition_channels_crm: [] as string[],

        // Visual
        colorMode: 'dark' as 'light' | 'dark' | 'system',
        accentColor: 'green',
        currentTheme: 'default'
    });

    const nextStep = () => {
        if (step >= totalSteps) return;
        setAnimating(true);
        setTimeout(() => {
            setStep(prev => prev + 1);
            setAnimating(false);
        }, 300);
    };

    const prevStep = () => {
        if (step === 0) return;
        setAnimating(true);
        setTimeout(() => {
            setStep(prev => prev - 1);
            setAnimating(false);
        }, 300);
    };

    const handleFinish = () => {
        if (!consentGiven) return;
        setAnimating(true);
        setTimeout(() => {
            onFinish(formData);
        }, 500);
    };

    const updateData = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    // Helper para arrays (Multi-select)
    const toggleSelection = (key: string, item: string, max?: number) => {
        setFormData(prev => {
            const list = prev[key as keyof typeof prev] as string[];
            if (list.includes(item)) {
                return { ...prev, [key]: list.filter(i => i !== item) };
            } else {
                if (max && list.length >= max) return prev;
                return { ...prev, [key]: [...list, item] };
            }
        });
    };

    const colorOptions = [
        { id: 'green', name: 'Sócio (Verde)', class: 'bg-[#00C853]', hex: '#00C853' },
        { id: 'gold', name: 'Gold', class: 'bg-[#F0A442]', hex: '#F0A442' },
        { id: 'blue', name: 'Azul', class: 'bg-blue-500', hex: '#3b82f6' },
        { id: 'violet', name: 'Violeta', class: 'bg-violet-500', hex: '#8b5cf6' },
        { id: 'tango', name: 'Vermelho', class: 'bg-red-600', hex: '#dc2626' },
    ];

    const bankOptions = ['Nubank', 'Itaú', 'Bradesco', 'Santander', 'Inter', 'XP', 'BTG', 'Binance', 'Caixa', 'Banco do Brasil', 'Outro'];
    
    // Lista expandida e balanceada (14 itens)
    const mainExpenseCategories = [
        "Custo Fixo (Aluguel/Equipe)",
        "Estoque & Fornecedores",
        "Marketing & Tráfego",
        "Impostos & Taxas",
        "Ferramentas & Software",
        "Comissões & Vendas", 
        "Manutenção & Reparos", 
        "Logística & Entrega",
        "Pessoal/Híbrido",
        "Empréstimos & Dívidas",
        "Outros / Imprevistos",
        "Educação & Treinamento", 
        "Jurídico & Contábil", 
        "Infraestrutura & Obras" 
    ];
    
    const channelOptions = ['Indicação', 'Instagram', 'Google/Ads', 'Linkedin', 'Prospecção Ativa', 'Parcerias', 'Feiras/Eventos'];

    const legalFormats = [
        'MEI', 
        'ME (Simples)', 
        'Lucro Presumido/Real', 
        'Autônomo (CPF)', 
        'CLT / Renda Extra'
    ];

    // Helper para renderizar inputs de seleção visual
    const SelectionCard = ({ selected, onClick, icon: Icon, title, desc }: any) => (
        <button 
            onClick={onClick}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${selected ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30 bg-transparent'}`}
        >
            <div className={`p-2 rounded-lg ${selected ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <span className="block font-bold text-white text-sm">{title}</span>
                {desc && <span className="text-xs text-neutral-400 leading-tight">{desc}</span>}
            </div>
            {selected && <Check className="h-5 w-5 text-white ml-auto mt-1" />}
        </button>
    );

    // Helper para input de tempo estilizado (Estilo iOS / Minimalista)
    const TimeInput = ({ value, onChange, label }: { value: string, onChange: (e: any) => void, label?: string }) => (
        <div className="flex flex-col items-center justify-center w-full">
            {label && <label className="text-neutral-400 mb-2 text-xs font-medium uppercase tracking-wide">{label}</label>}
            <div className="relative group">
                <input 
                    type="time" 
                    value={value}
                    onChange={onChange}
                    className="bg-white/10 border border-white/10 text-white text-xl font-bold rounded-xl px-6 py-3 text-center focus:bg-white/20 focus:border-white/30 focus:outline-none transition-all w-40 appearance-none shadow-lg [&::-webkit-calendar-picker-indicator]:invert"
                />
            </div>
        </div>
    );

    // Visual Preview Component
    const ThemePreview = () => {
        const selectedTheme = PRESET_THEMES.find(t => t.id === (formData.currentTheme === 'default' ? 'theme-01' : formData.currentTheme)) || PRESET_THEMES[0];
        const selectedColor = colorOptions.find(c => c.id === formData.accentColor) || colorOptions[0];
        
        const isDarkPreview = formData.colorMode === 'dark' || formData.colorMode === 'system'; 
        const bgColor = isDarkPreview ? selectedTheme.colors[1] : selectedTheme.colors[0];
        const cardBg = isDarkPreview ? 'rgba(255,255,255,0.05)' : '#ffffff';
        const textColor = isDarkPreview ? '#ffffff' : '#111827';
        const subTextColor = isDarkPreview ? '#9ca3af' : '#6b7280';
        const borderColor = isDarkPreview ? 'rgba(255,255,255,0.1)' : '#e5e7eb';

        return (
            <div className="w-full p-4 rounded-xl border border-white/20 mb-6 relative overflow-hidden transition-all duration-500" style={{ backgroundColor: bgColor }}>
                <div className="absolute top-2 right-2 opacity-50 pointer-events-none">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/50">Exemplo</span>
                </div>
                <div className="flex gap-3">
                    {/* Fake Sidebar */}
                    <div className="w-12 h-20 rounded-lg border hidden sm:flex flex-col items-center py-2 gap-2" style={{ borderColor: borderColor, backgroundColor: cardBg }}>
                        <div className="w-6 h-6 rounded-md" style={{ backgroundColor: selectedColor.hex }}></div>
                        <div className="w-6 h-6 rounded-md bg-gray-500/20"></div>
                    </div>
                    
                    {/* Fake Card */}
                    <div className="flex-1 rounded-lg border p-3" style={{ borderColor: borderColor, backgroundColor: cardBg }}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="h-2 w-16 rounded-full mb-1" style={{ backgroundColor: subTextColor, opacity: 0.5 }}></div>
                                <div className="h-4 w-24 rounded-full" style={{ backgroundColor: textColor }}></div>
                            </div>
                            <div className="p-1.5 rounded-md" style={{ backgroundColor: `${selectedColor.hex}20` }}>
                                <TrendingUp className="h-4 w-4" style={{ color: selectedColor.hex }} />
                            </div>
                        </div>
                        <div className="h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: isDarkPreview ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                            <div className="h-full w-2/3 rounded-full" style={{ backgroundColor: selectedColor.hex }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black font-sans overflow-hidden"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none fixed">
                <Spotlight />
            </div>

            <div 
                className="pointer-events-none absolute inset-0 z-1 fixed"
                style={{
                maskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)',
                }}
            />

            <div className="relative z-10 w-full max-w-2xl p-6 h-full flex flex-col justify-center">
                
                {/* Progress Bar (Esconde no passo 0) */}
                {step > 0 && (
                    <div className="mb-8">
                        <div className="flex justify-between items-end text-white mb-2">
                            <span className="text-lg font-bold">
                                {step === 1 ? "Tipo de Conta" : 
                                step === 2 ? "Contexto" :
                                step === 3 ? "Seu Negócio" :
                                step === 4 ? "Realidade Financeira" :
                                step === 5 ? "Carteiras" :
                                step === 6 ? "Categorias" :
                                step === 7 ? "Contratos" :
                                step === 8 ? "Vendas & Mercado" :
                                step === 9 ? "Operação" :
                                step === 10 ? "Visão Futura" :
                                step === 11 ? "Perfil" :
                                step === 12 ? "Estilo" :
                                step === 13 ? "Rotina Matinal" :
                                step === 14 ? "Jornada de Trabalho" :
                                step === 15 ? "Revisão" :
                                step === 16 ? "Não Perturbe" :
                                step === 17 ? "Visual" :
                                "Consentimento"}
                            </span>
                            <span className="text-xs text-neutral-500 font-mono">Passo {step}/{totalSteps}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white transition-all duration-500 ease-out" 
                                style={{ width: `${(step / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                <div className={`flex-1 overflow-y-auto overflow-x-hidden pr-2 transition-all duration-300 ease-in-out transform ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'} scrollbar-none`}>
                    
                    {/* Passo 0: Boas Vindas (Redesenhado Monocromático) */}
                    {step === 0 && (
                        <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto animate-in fade-in zoom-in duration-500">
                             <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80 p-10 shadow-2xl backdrop-blur-2xl text-center">
                                {/* No blobs, pure monochrome */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/10">
                                        <Wallet className="h-10 w-10 text-white" />
                                    </div>

                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                                        Olá, {firstName}.
                                    </h1>

                                    <p className="text-neutral-400 text-lg mb-10 leading-relaxed max-w-sm mx-auto">
                                        Seja bem-vindo ao Sócio.<br/>
                                        Conte-me sobre sua empresa. Quanto mais eu souber, melhores serão minhas ações
                                    </p>

                                    <button 
                                        onClick={nextStep}
                                        className="group relative w-full bg-white text-black font-bold text-lg py-4 rounded-full hover:bg-neutral-200 transition-all active:scale-[0.98] shadow-lg shadow-white/5 overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Começar Agora <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Passo 1: Tipo de Conta */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Tipo de Conta</h2>
                            <p className="text-neutral-400">Você quer usar o Sócio mais pra gestão da sua vida pessoal, empresa/negócio ou os dois ao mesmo tempo?</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {['pessoal', 'empresa', 'ambos'].map(opt => (
                                    <SelectionCard 
                                        key={opt}
                                        selected={formData.usage_context === opt}
                                        onClick={() => updateData('usage_context', opt)}
                                        icon={opt === 'pessoal' ? User : opt === 'empresa' ? Building2 : LayoutGrid}
                                        title={opt.charAt(0).toUpperCase() + opt.slice(1)}
                                    />
                                ))}
                            </div>

                            {/* Campos Condicionais para Passo 1 */}
                            <div className="animate-in fade-in slide-in-from-top-4 space-y-4 pt-2">
                                {(formData.usage_context === 'pessoal' || formData.usage_context === 'ambos') && (
                                    <div>
                                        <label className="text-neutral-300 mb-2 block text-sm">Como o Sócio deve te chamar?</label>
                                        <input 
                                            type="text"
                                            value={formData.nome_preferido}
                                            onChange={(e) => updateData('nome_preferido', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none"
                                            placeholder="Seu nome ou apelido"
                                        />
                                    </div>
                                )}

                                {(formData.usage_context === 'empresa' || formData.usage_context === 'ambos') && (
                                    <div>
                                        <label className="text-neutral-300 mb-2 block text-sm">Qual o nome da sua empresa?</label>
                                        <input 
                                            type="text"
                                            value={formData.nome_empresa}
                                            onChange={(e) => updateData('nome_empresa', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none"
                                            placeholder="Nome do Negócio"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Passo 2: Contexto */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Contexto de Uso</h2>
                            <p className="text-neutral-400">E trabalhando sozinho(a) ou com equipe?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <SelectionCard 
                                    selected={formData.work_mode === 'solo'}
                                    onClick={() => updateData('work_mode', 'solo')}
                                    icon={User}
                                    title="Trabalho Sozinho(a)"
                                    desc="Eu sou a operação inteira."
                                />
                                <SelectionCard 
                                    selected={formData.work_mode === 'equipe'}
                                    onClick={() => updateData('work_mode', 'equipe')}
                                    icon={Users}
                                    title="Com Equipe"
                                    desc="Tenho sócios ou funcionários."
                                />
                            </div>

                            {formData.work_mode === 'equipe' && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="text-xs text-neutral-400 uppercase font-bold mb-2 block">Quantas pessoas e quais as funções principais?</label>
                                    <textarea 
                                        rows={2}
                                        value={formData.team_roles}
                                        onChange={(e) => updateData('team_roles', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none resize-none"
                                        placeholder="Ex: 5 pessoas. 2 no vendas, 1 financeiro e 2 na operação..."
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Passo 3: Seu Negócio */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Modelo de Negócio</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-neutral-300 mb-2 block text-sm">Em qual nicho você se encaixa?</label>
                                    <input 
                                        type="text" 
                                        value={formData.niche}
                                        onChange={(e) => updateData('niche', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none"
                                        placeholder="Ex: Estética, Marketing..."
                                    />
                                </div>
                                <div>
                                    <label className="text-neutral-300 mb-2 block text-sm">Tempo de Operação</label>
                                    <input 
                                        type="text" 
                                        value={formData.operation_time}
                                        onChange={(e) => updateData('operation_time', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none"
                                        placeholder="Ex: 2 anos neste negócio."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-neutral-300 mb-2 block text-sm">Se você tivesse 30 segundos pra explicar o que você faz e como entra dinheiro pra você hoje, o que você diria?</label>
                                <textarea 
                                    rows={2}
                                    value={formData.pitch_10s}
                                    onChange={(e) => updateData('pitch_10s', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none resize-none"
                                    placeholder="Ex: Vendo roupas femininas pelo Instagram e envio por correio..."
                                />
                            </div>

                            <div>
                                <label className="text-neutral-300 mb-3 block text-sm">O que você vende principalmente?</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <SelectionCard 
                                        selected={formData.business_model === 'produto'}
                                        onClick={() => updateData('business_model', 'produto')}
                                        icon={Package}
                                        title="Produto Físico"
                                        desc="E-commerce, Varejo, Loja."
                                    />
                                    <SelectionCard 
                                        selected={formData.business_model === 'servico'}
                                        onClick={() => updateData('business_model', 'servico')}
                                        icon={User}
                                        title="Serviço"
                                        desc="Consultoria, Agência, Freelancer."
                                    />
                                    <SelectionCard 
                                        selected={formData.business_model === 'infoproduto'}
                                        onClick={() => updateData('business_model', 'infoproduto')}
                                        icon={MonitorPlay}
                                        title="Infoproduto"
                                        desc="Cursos, E-books, Mentoria Online."
                                    />
                                    <SelectionCard 
                                        selected={formData.business_model === 'hibrido'}
                                        onClick={() => updateData('business_model', 'hibrido')}
                                        icon={Layers}
                                        title="Híbrido / Mistura"
                                        desc="Vendo de tudo um pouco."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Passo 4: Realidade Financeira */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Realidade Financeira</h2>
                            <p className="text-neutral-400 text-sm">Sem romantizar. Pode ser sincero(a), aqui é um espaço seguro.</p>

                            <div>
                                <label className="text-neutral-300 mb-2 block text-sm">Diagnóstico do Caixa (Sinceridade total)</label>
                                <textarea 
                                    rows={2}
                                    value={formData.cash_reality}
                                    onChange={(e) => updateData('cash_reality', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none resize-none"
                                    placeholder="Ex: No vermelho, vendendo o almoço pra pagar a janta... ou Sobrando um pouco mas sem controle..."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-neutral-300 mb-2 block text-sm">Faturamento Médio Mensal</label>
                                    <input 
                                        type="text"
                                        value={formData.average_revenue}
                                        onChange={(e) => updateData('average_revenue', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none"
                                        placeholder="Ex: R$ 15.000,00"
                                    />
                                </div>
                                <div>
                                    <label className="text-neutral-300 mb-2 block text-sm">Ticket Médio Aproximado</label>
                                    <input 
                                        type="text"
                                        value={formData.average_ticket}
                                        onChange={(e) => updateData('average_ticket', e.target.value)}
                                        placeholder="Ex: R$ 150,00"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-neutral-300 mb-2 block text-sm">Formato Legal e Tributário</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {legalFormats.map(fmt => (
                                        <button
                                            key={fmt}
                                            onClick={() => updateData('legal_format', fmt)}
                                            className={`p-3 rounded-lg border text-xs font-bold text-center transition-all ${formData.legal_format === fmt ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'}`}
                                        >
                                            {fmt}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="flex items-start gap-2 mt-3 text-yellow-500/90 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                    <p className="text-xs leading-relaxed">
                                        <strong>Atenção:</strong> Essa informação é crucial. Ela será usada para calcular seus impostos, margens e projeções financeiras automaticamente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Passo 5: Carteiras */}
                    {step === 5 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Wallet className="h-6 w-6"/> Carteiras & Bancos</h2>
                            <p className="text-neutral-400">Onde seu dinheiro está hoje? Selecione as instituições que você usa.</p>
                            
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {bankOptions.map(bank => (
                                    <button
                                        key={bank}
                                        onClick={() => toggleSelection('selected_banks', bank)}
                                        className={`p-3 rounded-lg border text-xs font-bold text-center transition-all ${formData.selected_banks.includes(bank) ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'}`}
                                    >
                                        {bank}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-4">
                                <label className="text-neutral-300 mb-2 block text-sm">Você utiliza cartão de crédito com frequência?</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button 
                                        onClick={() => updateData('uses_credit_card', 'sim')}
                                        className={`p-3 rounded-lg border text-sm transition-all ${formData.uses_credit_card === 'sim' ? 'bg-white text-black border-white' : 'border-white/10 text-neutral-400 hover:text-white'}`}
                                    >
                                        Sim
                                    </button>
                                    <button 
                                        onClick={() => updateData('uses_credit_card', 'nao')}
                                        className={`p-3 rounded-lg border text-sm transition-all ${formData.uses_credit_card === 'nao' ? 'bg-white text-black border-white' : 'border-white/10 text-neutral-400 hover:text-white'}`}
                                    >
                                        Não
                                    </button>
                                    <button 
                                        onClick={() => updateData('uses_credit_card', 'debito')}
                                        className={`p-3 rounded-lg border text-sm transition-all ${formData.uses_credit_card === 'debito' ? 'bg-white text-black border-white' : 'border-white/10 text-neutral-400 hover:text-white'}`}
                                    >
                                        Apenas Débito
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <label className="text-neutral-300 mb-2 block text-sm">Dívidas e Compromissos Ativos</label>
                                <textarea 
                                    rows={2}
                                    value={formData.debts}
                                    onChange={(e) => updateData('debts', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none resize-none"
                                    placeholder="Ex: Tenho empréstimo no banco e parcelamento de cartão..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Passo 6: Categorias */}
                    {step === 6 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><PieChart className="h-6 w-6"/> Gestão de Gastos</h2>
                            <p className="text-neutral-400 text-sm">Para organizarmos suas contas, onde você sente que o dinheiro mais "some" ou é investido hoje? (Selecione até 5 principais)</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {mainExpenseCategories.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => toggleSelection('selected_categories', item, 5)}
                                        className={`p-4 rounded-xl border text-sm font-bold text-left transition-all flex items-center justify-between ${formData.selected_categories.includes(item) ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'}`}
                                    >
                                        {item}
                                        {formData.selected_categories.includes(item) && <Check className="h-4 w-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Passo 7: Contratos */}
                    {step === 7 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><FileText className="h-6 w-6"/> Modelo de Receita</h2>
                            
                            <div>
                                <label className="text-neutral-300 mb-3 block text-sm">Como você cobra seus clientes?</label>
                                <div className="space-y-3">
                                    <SelectionCard 
                                        selected={formData.revenue_model === 'recorrencia'}
                                        onClick={() => updateData('revenue_model', 'recorrencia')}
                                        icon={CalendarClock}
                                        title="Recorrência / Mensalidade"
                                        desc="Tenho contratos fixos (SaaS, Retenção)."
                                    />
                                    <SelectionCard 
                                        selected={formData.revenue_model === 'projetos'}
                                        onClick={() => updateData('revenue_model', 'projetos')}
                                        icon={Briefcase}
                                        title="Projetos / Pontual"
                                        desc="Tem começo, meio e fim."
                                    />
                                    <SelectionCard 
                                        selected={formData.revenue_model === 'transacional'}
                                        onClick={() => updateData('revenue_model', 'transacional')}
                                        icon={DollarSign}
                                        title="Venda Direta / E-commerce"
                                        desc="Transacional (Varejo, Produto Único)."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Passo 8: Vendas & Mercado */}
                    {step === 8 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Target className="h-6 w-6"/> Vendas & Mercado</h2>
                            
                            <div>
                                <label className="text-neutral-300 mb-2 block text-sm">Por onde os clientes chegam até você? (Selecione)</label>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {channelOptions.map(channel => (
                                        <button
                                            key={channel}
                                            onClick={() => toggleSelection('acquisition_channels_crm', channel)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${formData.acquisition_channels_crm.includes(channel) ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/20 hover:border-white/50'}`}
                                        >
                                            <MousePointerClick className="h-4 w-4" />
                                            {channel}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-neutral-300 mb-2 block text-sm">Qual é o canal que mais traz cliente ou venda pra você hoje?</label>
                                <input 
                                    type="text"
                                    value={formData.acquisition_channel}
                                    onChange={(e) => updateData('acquisition_channel', e.target.value)}
                                    placeholder="Ex: Instagram (Orgânico)"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none mb-3"
                                />
                                <label className="text-neutral-300 mb-2 block text-sm">E quanto % mais ou menos vem de cada canal principal?</label>
                                <input 
                                    type="text"
                                    value={formData.channel_percentage}
                                    onChange={(e) => updateData('channel_percentage', e.target.value)}
                                    placeholder="Ex: 80% Instagram, 20% Indicação"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-neutral-300 mb-2 block text-sm">Clientes Ativos Hoje</label>
                                    <input 
                                        type="text"
                                        value={formData.active_customers}
                                        onChange={(e) => updateData('active_customers', e.target.value)}
                                        placeholder="Ex: 15 recorrentes"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-neutral-300 mb-2 block text-sm">Capacidade Máxima/Mês</label>
                                    <input 
                                        type="text"
                                        value={formData.capacity_limit}
                                        onChange={(e) => updateData('capacity_limit', e.target.value)}
                                        placeholder="Ex: Atendo até 20"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-neutral-300 mb-2 block text-sm">Seu negócio tem sazonalidade?</label>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => updateData('seasonality', 'sim')}
                                        className={`flex-1 p-3 rounded-lg border text-sm transition-all ${formData.seasonality === 'sim' ? 'bg-white text-black border-white' : 'border-white/10 text-neutral-400 hover:text-white'}`}
                                    >
                                        Sim, oscila muito
                                    </button>
                                    <button 
                                        onClick={() => updateData('seasonality', 'nao')}
                                        className={`flex-1 p-3 rounded-lg border text-sm transition-all ${formData.seasonality === 'nao' ? 'bg-white text-black border-white' : 'border-white/10 text-neutral-400 hover:text-white'}`}
                                    >
                                        Não, é estável
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Passo 9: Operação */}
                    {step === 9 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Dores e Gargalos</h2>
                            
                            <div>
                                <p className="text-neutral-300 mb-3 text-sm">Onde a rotina mais trava?</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <SelectionCard 
                                        selected={formData.routine_bottleneck === 'planejar'}
                                        onClick={() => updateData('routine_bottleneck', 'planejar')}
                                        icon={Target}
                                        title="Planejar"
                                    />
                                    <SelectionCard 
                                        selected={formData.routine_bottleneck === 'executar'}
                                        onClick={() => updateData('routine_bottleneck', 'executar')}
                                        icon={Zap}
                                        title="Executar"
                                    />
                                    <SelectionCard 
                                        selected={formData.routine_bottleneck === 'controlar'}
                                        onClick={() => updateData('routine_bottleneck', 'controlar')}
                                        icon={BarChart3}
                                        title="Controlar"
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-neutral-300 mb-3 text-sm">Qual dessas áreas te incomoda MAIS hoje?</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <SelectionCard 
                                        selected={formData.main_bother === 'dinheiro'}
                                        onClick={() => updateData('main_bother', 'dinheiro')}
                                        icon={DollarSign}
                                        title="Dinheiro"
                                    />
                                    <SelectionCard 
                                        selected={formData.main_bother === 'vendas'}
                                        onClick={() => updateData('main_bother', 'vendas')}
                                        icon={Target}
                                        title="Vendas"
                                    />
                                    <SelectionCard 
                                        selected={formData.main_bother === 'rotina'}
                                        onClick={() => updateData('main_bother', 'rotina')}
                                        icon={LayoutGrid}
                                        title="Rotina"
                                    />
                                    <SelectionCard 
                                        selected={formData.main_bother === 'clareza'}
                                        onClick={() => updateData('main_bother', 'clareza')}
                                        icon={Monitor}
                                        title="Clareza"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-neutral-300 mb-2 block text-sm">Qual parte específica da operação gera mais retrabalho?</label>
                                <input 
                                    type="text"
                                    value={formData.operational_bottleneck_detail}
                                    onChange={(e) => updateData('operational_bottleneck_detail', e.target.value)}
                                    placeholder="Ex: Entrega, pós-venda, cobrança, produção..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Passo 10: Visão Futura */}
                    {step === 10 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Visão de Futuro</h2>
                            
                            <div>
                                <label className="text-neutral-300 mb-2 block text-sm">Meta de 90 Dias (Específica)</label>
                                <textarea 
                                    rows={2}
                                    value={formData.objective_90d}
                                    onChange={(e) => updateData('objective_90d', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none resize-none"
                                    placeholder="Ex: Quitar o cartão e faturar R$ 15k/mês..."
                                />
                            </div>

                            <div>
                                <label className="text-neutral-300 mb-2 block text-sm">Visão de 12 Meses</label>
                                <textarea 
                                    rows={2}
                                    value={formData.vision_12m}
                                    onChange={(e) => updateData('vision_12m', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none resize-none"
                                    placeholder="Ex: Estar com 50 clientes recorrentes e equipe de 3 pessoas..."
                                />
                            </div>

                            <div>
                                <label className="text-neutral-300 mb-2 block text-sm">Objetivo Final (Longo Prazo)</label>
                                <input 
                                    type="text"
                                    value={formData.vision_final}
                                    onChange={(e) => updateData('vision_final', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none"
                                    placeholder="Ex: Vender a empresa, Viver de renda, Ser referência nacional..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Passo 11: Perfil */}
                    {step === 11 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Você e o Contexto</h2>
                            
                            <div>
                                <p className="text-neutral-300 mb-3 text-sm">Nível de conhecimento em gestão:</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {['iniciante', 'intermediario', 'avancado'].map(level => (
                                        <button 
                                            key={level}
                                            onClick={() => updateData('knowledge_level', level)}
                                            className={`p-3 rounded-lg border text-xs font-bold uppercase transition-all ${formData.knowledge_level === level ? 'bg-white text-black border-white' : 'border-white/10 text-neutral-400 hover:text-white'}`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-neutral-300 mb-2 block text-sm">Contexto de Vida (Impacta o negócio?)</label>
                                <textarea 
                                    rows={3}
                                    value={formData.life_context}
                                    onChange={(e) => updateData('life_context', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-white/30 focus:outline-none resize-none"
                                    placeholder="Ex: Tive filho recentemente, estou de mudança, transição de carreira..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Passo 12: Estilo */}
                    {step === 12 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Nossa Interação</h2>
                            <p className="text-neutral-400">Como prefere que o Sócio fale com você?</p>
                            
                            <div className="space-y-2">
                                <SelectionCard 
                                    selected={formData.communication_style === 'direto'}
                                    onClick={() => updateData('communication_style', 'direto')}
                                    icon={Zap}
                                    title="Direto e Executivo"
                                    desc="Poucas palavras, foco na ação. Sem rodeios."
                                />
                                <SelectionCard 
                                    selected={formData.communication_style === 'didatico'}
                                    onClick={() => updateData('communication_style', 'didatico')}
                                    icon={BookOpen}
                                    title="Didático e Explicativo"
                                    desc="Gosto de entender o 'porquê' e o passo a passo."
                                />
                                <SelectionCard 
                                    selected={formData.communication_style === 'motivador'}
                                    onClick={() => updateData('communication_style', 'motivador')}
                                    icon={MessageCircle}
                                    title="Motivador e Parceiro"
                                    desc="Preciso de incentivo e alguém que jogue junto."
                                />
                            </div>

                            <div>
                                <label className="text-neutral-300 mb-2 block text-sm mt-4">Frequência de Interação Preferida</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button 
                                        onClick={() => updateData('interaction_frequency', 'diario')}
                                        className={`p-3 rounded-lg border text-xs font-medium transition-all ${formData.interaction_frequency === 'diario' ? 'bg-white text-black border-white' : 'border-white/10 text-neutral-400 hover:text-white'}`}
                                    >
                                        Diária
                                    </button>
                                    <button 
                                        onClick={() => updateData('interaction_frequency', 'semanal')}
                                        className={`p-3 rounded-lg border text-xs font-medium transition-all ${formData.interaction_frequency === 'semanal' ? 'bg-white text-black border-white' : 'border-white/10 text-neutral-400 hover:text-white'}`}
                                    >
                                        Semanal
                                    </button>
                                    <button 
                                        onClick={() => updateData('interaction_frequency', 'demanda')}
                                        className={`p-3 rounded-lg border text-xs font-medium transition-all ${formData.interaction_frequency === 'demanda' ? 'bg-white text-black border-white' : 'border-white/10 text-neutral-400 hover:text-white'}`}
                                    >
                                        Sob Demanda
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Passo 13: Rotina Matinal */}
                    {step === 13 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Sunrise className="h-6 w-6"/> Sua Rotina Matinal</h2>
                            <p className="text-neutral-400">Pra te dar follow-up no momento certo, preciso entender como seu dia começa.</p>
                            
                            <div className="flex justify-center py-4">
                                <TimeInput 
                                    label="Que horas você normalmente acorda?"
                                    value={formData.wake_up_time}
                                    onChange={(e) => updateData('wake_up_time', e.target.value)}
                                />
                            </div>

                            <div>
                                <p className="text-neutral-300 mb-3 text-sm">Você prefere receber follow-ups logo cedo ou depois que já entrou no ritmo?</p>
                                <div className="space-y-2">
                                    <SelectionCard 
                                        selected={formData.morning_followup_pref === 'acordar'}
                                        onClick={() => updateData('morning_followup_pref', 'acordar')}
                                        icon={Zap}
                                        title="Logo ao acordar"
                                        desc="Gosto de começar o dia alinhado."
                                    />
                                    <SelectionCard 
                                        selected={formData.morning_followup_pref === 'manha'}
                                        onClick={() => updateData('morning_followup_pref', 'manha')}
                                        icon={Coffee}
                                        title="Meio da manhã"
                                        desc="Deixa eu tomar um café primeiro."
                                    />
                                    <SelectionCard 
                                        selected={formData.morning_followup_pref === 'nao'}
                                        onClick={() => updateData('morning_followup_pref', 'nao')}
                                        icon={BellOff}
                                        title="Não quero follow-ups de manhã"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Passo 14: Horário de Trabalho */}
                    {step === 14 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Briefcase className="h-6 w-6"/> Sua Jornada de Trabalho</h2>
                            <p className="text-neutral-400">Quando você tá operando de verdade?</p>
                            
                            <div className="grid grid-cols-2 gap-4 py-2">
                                <TimeInput 
                                    label="Início"
                                    value={formData.work_start_time}
                                    onChange={(e) => updateData('work_start_time', e.target.value)}
                                />
                                <TimeInput 
                                    label="Fim"
                                    value={formData.work_end_time}
                                    onChange={(e) => updateData('work_end_time', e.target.value)}
                                />
                            </div>

                            <div>
                                <p className="text-neutral-300 mb-3 text-sm">Tem horário de almoço fixo?</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <SelectionCard 
                                        selected={formData.lunch_schedule_type === 'fixo'}
                                        onClick={() => updateData('lunch_schedule_type', 'fixo')}
                                        icon={Clock}
                                        title="Sim, fixo"
                                    />
                                    <SelectionCard 
                                        selected={formData.lunch_schedule_type === 'varia'}
                                        onClick={() => updateData('lunch_schedule_type', 'varia')}
                                        icon={TrendingUp}
                                        title="Varia"
                                    />
                                    <SelectionCard 
                                        selected={formData.lunch_schedule_type === 'trabalhando'}
                                        onClick={() => updateData('lunch_schedule_type', 'trabalhando')}
                                        icon={Utensils}
                                        title="Como trabalhando"
                                    />
                                </div>
                            </div>

                            {formData.lunch_schedule_type === 'fixo' && (
                                <div className="animate-in fade-in slide-in-from-top-2 flex justify-center py-2">
                                    <TimeInput 
                                        label="Que horas você almoça?"
                                        value={formData.lunch_time}
                                        onChange={(e) => updateData('lunch_time', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Passo 15: Momento de Revisar */}
                    {step === 15 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><CalendarClock className="h-6 w-6"/> Hora de Olhar os Números</h2>
                            <p className="text-neutral-400">Quando você quer que eu te faça follow-up sobre o dia, semana ou mês?</p>
                            
                            <div>
                                <label className="text-neutral-300 mb-3 block text-sm">Qual o melhor momento pra eu te dar follow-up sobre o que aconteceu no dia?</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <SelectionCard 
                                        selected={formData.daily_review_pref === 'tarde'}
                                        onClick={() => updateData('daily_review_pref', 'tarde')}
                                        icon={Sunset}
                                        title="Final da tarde"
                                        desc="Antes de encerrar o expediente."
                                    />
                                    <SelectionCard 
                                        selected={formData.daily_review_pref === 'noite'}
                                        onClick={() => updateData('daily_review_pref', 'noite')}
                                        icon={Moon}
                                        title="Noite"
                                        desc="Quando o dia já acabou."
                                    />
                                    <SelectionCard 
                                        selected={formData.daily_review_pref === 'manha'}
                                        onClick={() => updateData('daily_review_pref', 'manha')}
                                        icon={Sunrise}
                                        title="Manhã seguinte"
                                        desc="Prefiro olhar com cabeça fresca."
                                    />
                                    <SelectionCard 
                                        selected={formData.daily_review_pref === 'nao'}
                                        onClick={() => updateData('daily_review_pref', 'nao')}
                                        icon={BellOff}
                                        title="Não quero follow-ups diários"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <label className="text-neutral-300 mb-3 block text-sm">E follow-ups semanais/mensais?</label>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <button 
                                        onClick={() => updateData('weekly_review_pref', 'sexta')}
                                        className={`p-3 rounded-lg border text-xs font-medium transition-all ${formData.weekly_review_pref === 'sexta' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'}`}
                                    >
                                        Sexta à tarde
                                    </button>
                                    <button 
                                        onClick={() => updateData('weekly_review_pref', 'segunda')}
                                        className={`p-3 rounded-lg border text-xs font-medium transition-all ${formData.weekly_review_pref === 'segunda' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'}`}
                                    >
                                        Segunda de manhã
                                    </button>
                                    <button 
                                        onClick={() => updateData('weekly_review_pref', 'fim_semana')}
                                        className={`p-3 rounded-lg border text-xs font-medium transition-all ${formData.weekly_review_pref === 'fim_semana' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'}`}
                                    >
                                        Fim de semana
                                    </button>
                                    <button 
                                        onClick={() => updateData('weekly_review_pref', 'outro')}
                                        className={`p-3 rounded-lg border text-xs font-medium transition-all ${formData.weekly_review_pref === 'outro' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'}`}
                                    >
                                        Outro
                                    </button>
                                </div>
                                {formData.weekly_review_pref === 'outro' && (
                                    <div className="flex justify-center mt-2">
                                        <input 
                                            type="text"
                                            value={formData.weekly_review_custom}
                                            onChange={(e) => updateData('weekly_review_custom', e.target.value)}
                                            placeholder="Ex: Quarta às 14h"
                                            className="bg-white/10 border border-white/10 text-white text-base font-bold rounded-lg px-4 py-2 text-center focus:bg-white/20 focus:border-white/30 focus:outline-none transition-all w-48"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Passo 16: Não Perturbe */}
                    {step === 16 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><BellOff className="h-6 w-6"/> Quando NÃO te Incomodar</h2>
                            <p className="text-neutral-400">Todo mundo precisa de paz. Quando você quer silêncio total?</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {['Finais de semana', 'Após horário comercial', 'Horário de almoço', 'Nenhum'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => toggleSelection('dnd_prefs', opt)}
                                        className={`p-4 rounded-xl border text-sm font-bold text-left transition-all flex items-center justify-between ${formData.dnd_prefs.includes(opt) ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'}`}
                                    >
                                        {opt}
                                        {formData.dnd_prefs.includes(opt) && <Check className="h-4 w-4" />}
                                    </button>
                                ))}
                            </div>

                            {(formData.dnd_prefs.includes('Após horário comercial') || formData.dnd_prefs.includes('Horário de almoço')) && (
                                <div className="animate-in fade-in slide-in-from-top-2 pt-2">
                                    <p className="text-neutral-300 mb-3 text-sm text-center">Defina o intervalo de silêncio:</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <TimeInput 
                                            label="De"
                                            value={formData.dnd_start_time}
                                            onChange={(e) => updateData('dnd_start_time', e.target.value)}
                                        />
                                        <TimeInput 
                                            label="Até"
                                            value={formData.dnd_end_time}
                                            onChange={(e) => updateData('dnd_end_time', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Passo 17: Visual */}
                    {step === 17 && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Toque Final</h2>
                                <p className="text-neutral-400">Deixe o sistema com a sua cara.</p>
                            </div>

                            <ThemePreview />

                            {/* Mode Selection */}
                            <div>
                                <label className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-3 block flex items-center gap-2">
                                    <Monitor className="h-4 w-4" /> Modo de Visualização
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'dark', label: 'Escuro', icon: Moon },
                                        { id: 'light', label: 'Claro', icon: Sun },
                                        { id: 'system', label: 'Auto', icon: Monitor }
                                    ].map((mode) => (
                                        <button
                                            key={mode.id}
                                            onClick={() => updateData('colorMode', mode.id)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${formData.colorMode === mode.id ? 'border-white bg-white/10 text-white' : 'border-white/10 text-neutral-500 hover:text-neutral-300'}`}
                                        >
                                            <mode.icon className="h-5 w-5 mb-1" />
                                            <span className="text-xs font-bold">{mode.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Accent Color */}
                            <div>
                                <label className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-3 block flex items-center gap-2">
                                    <Palette className="h-4 w-4" /> Cor de Destaque
                                </label>
                                <div className="flex gap-4">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() => updateData('accentColor', color.id)}
                                            className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${color.class} ${formData.accentColor === color.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'hover:scale-110 opacity-80 hover:opacity-100'}`}
                                            title={color.name}
                                        >
                                            {formData.accentColor === color.id && <Check className="h-5 w-5 text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Theme Selection */}
                            <div>
                                <label className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-3 block flex items-center gap-2">
                                    <LayoutGrid className="h-4 w-4" /> Tema da Interface
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {PRESET_THEMES.map((theme) => (
                                        <button
                                            key={theme.id}
                                            onClick={() => updateData('currentTheme', theme.id === 'theme-01' ? 'default' : theme.id)}
                                            className={`p-2 rounded-lg border-2 text-left transition-all ${formData.currentTheme === (theme.id === 'theme-01' ? 'default' : theme.id) ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/20'}`}
                                        >
                                            <div className="h-8 w-full rounded mb-2 flex overflow-hidden border border-white/10">
                                                <div className="w-1/3 h-full" style={{ backgroundColor: theme.colors[0] }}></div>
                                                <div className="w-2/3 h-full" style={{ backgroundColor: theme.colors[1] }}></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-neutral-300 block">{theme.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Passo 18: Consentimento */}
                    {step === 18 && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                                <ShieldCheck className="h-8 w-8 text-white" />
                            </div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white">Último passo: seu consentimento</h2>
                                <p className="text-neutral-400 mt-2 max-w-md mx-auto">Para finalizarmos, precisamos do seu consentimento para processar seus dados.</p>
                            </div>

                            <div 
                                onClick={() => setConsentGiven(!consentGiven)}
                                className="w-full max-w-md p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4 cursor-pointer bg-white/5 hover:border-white/30"
                                style={{ borderColor: consentGiven ? 'white' : 'rgba(255, 255, 255, 0.1)' }}
                            >
                                <div className="relative flex items-center mt-1">
                                    <input
                                        id="consentCheck"
                                        type="checkbox"
                                        checked={consentGiven}
                                        readOnly
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/20 bg-transparent transition-all checked:border-white checked:bg-white"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100 h-3.5 w-3.5"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                                <label htmlFor="consentCheck" className="text-sm text-neutral-300 leading-snug cursor-pointer">
                                    Eu aceito o processamento dos meus dados pessoais conforme descrito na <span className="font-bold text-white hover:underline">Política de Privacidade</span> e concordo com os <span className="font-bold text-white hover:underline">Termos de Uso</span> da plataforma Sócio.
                                </label>
                            </div>
                        </div>
                    )}

                </div>

                {/* Navigation Footer */}
                {step > 0 && (
                    <div className="pt-6 flex justify-between items-center border-t border-white/10 mt-auto shrink-0">
                        <button onClick={prevStep} className="text-neutral-400 hover:text-white font-medium text-sm">
                            ← Voltar
                        </button>
                        {step < totalSteps ? (
                            <button onClick={nextStep} className="group flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-neutral-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                Próximo
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <button 
                                onClick={handleFinish}
                                disabled={!consentGiven}
                                className="group flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-neutral-200"
                            >
                                Finalizar Configuração
                                <Check className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
