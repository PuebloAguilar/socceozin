
import React, { useState, useEffect } from 'react';
import { PlaceholderContent } from '../ui/PlaceholderContent';
import { ContentWithSidebarLayout } from '../ui/ContentWithSidebarLayout';
import { Moon, Sun, Monitor, ShieldCheck, KeyRound, Bell, Mail, CreditCard, DollarSign, Save, Camera, LogOut, Palette, User, Building2, ChevronsUpDown, AlertCircle, UserCog, Target, BrainCircuit, MessageSquare, Zap, Briefcase } from "lucide-react";
import { HelpCenterContent, ContactSupportContent, FeedbackContent } from './HelpContent';

// Moved from dashboard to avoid circular dependency
export const PRESET_THEMES = [
  {
    id: "theme-01",
    name: "Theme 01", // Antigo Default (Tailwind colors)
    dark: {
      bg_left: "#111827", // gray-900
      bg_right: "#030712", // gray-950
      border: "#1f2937", // gray-800
      bg_input: "#1f2937", // gray-800
      detail: "#334155" // CINZA ESPECIAL DARK (Slate-700)
    },
    light: {
      bg_left: "#ffffff",
      bg_right: "#f3f4f6", // gray-100
      border: "#e5e7eb", // gray-200
      bg_input: "#f9fafb", // gray-50
      detail: "#E2E8F0" // CINZA ESPECIAL LIGHT (Slate-200)
    }
  },
  {
    id: "theme-02",
    name: "Theme 02",
    dark: {
      bg_left: "#29282D",
      bg_right: "#4F5054",
      border: "rgba(255, 255, 255, 0.08)",
      bg_input: "rgba(0, 0, 0, 0.2)",
      detail: "#475569" // Slate-600
    },
    light: {
      bg_left: "#EDEDED", 
      bg_right: "#F5F5F5", 
      border: "#D4D4D4", 
      bg_input: "#FFFFFF", 
      detail: "#CBD5E1" // Slate-300
    }
  },
  {
    id: "theme-03",
    name: "Theme 03",
    dark: {
      bg_left: "#1E1E1C",
      bg_right: "#252523",
      border: "rgba(255, 255, 255, 0.08)",
      bg_input: "rgba(0, 0, 0, 0.2)",
      detail: "#334155" // CINZA ESPECIAL DARK
    },
    light: {
      bg_left: "#F4F3EF",
      bg_right: "#FAF9F5",
      border: "#E5E7EB",
      bg_input: "rgba(0, 0, 0, 0.05)",
      detail: "#E2E8F0" // CINZA ESPECIAL LIGHT
    }
  }
];

interface SettingsContentProps {
    colorMode: 'light' | 'dark' | 'system';
    setColorMode: (mode: 'light' | 'dark' | 'system') => void;
    isDark: boolean;
    accentColor: string;
    setAccentColor: (color: string) => void;
    currentTheme: string;
    setCurrentTheme: (themeId: string) => void;
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
}

const ProfileSettings: React.FC<SettingsContentProps> = ({ 
    colorMode, setColorMode, isDark, accentColor, setAccentColor, currentTheme, setCurrentTheme,
    accountType, setAccountType, userName, setUserName, companyName, setCompanyName, currency, setCurrency
}) => {
    const [lastName, setLastName] = useState('Doe');
    
    const colorOptions = [
        { id: 'gold', name: 'Gold', class: 'bg-[#F0A442]' },
        { id: 'blue', name: 'Azul', class: 'bg-blue-500' },
        { id: 'tango', name: 'Vermelho', class: 'bg-red-600' },
        { id: 'emerald', name: 'Esmeralda', class: 'bg-emerald-500' },
        { id: 'violet', name: 'Violeta', class: 'bg-violet-500' },
        { id: 'green', name: 'Verde', class: 'bg-[#00C853]' },
    ];

    const currencyOptions = [
        { value: "BRL", label: "BRL (Real Brasileiro)" },
        { value: "USD", label: "USD (Dólar Americano)" },
        { value: "EUR", label: "EUR (Euro)" },
        { value: "GBP", label: "GBP (Libra Esterlina)" },
        { value: "JPY", label: "JPY (Iene Japonês)" },
        { value: "CNY", label: "CNY (Yuan Chinês)" },
        { value: "CAD", label: "CAD (Dólar Canadense)" },
        { value: "AUD", label: "AUD (Dólar Australiano)" },
    ];

    return (
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-300 p-1 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Perfil</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie suas informações pessoais, preferências e aparência.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm">
                    <Save className="h-4 w-4" />
                    Salvar Alterações
                </button>
            </div>

            {/* --- Seção de Tipo de Conta --- */}
            <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary-500" />
                    Tipo de Conta
                </h3>
                
                <div className="flex flex-col gap-3">
                    <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-[var(--border-color)] w-full sm:w-96">
                        <button
                            onClick={() => setAccountType('personal')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${accountType === 'personal' ? 'bg-white dark:bg-[var(--bg-card)] shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        >
                            <User className="h-4 w-4" />
                            Pessoal
                        </button>
                        <button
                            onClick={() => setAccountType('business')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${accountType === 'business' ? 'bg-white dark:bg-[var(--bg-card)] shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        >
                            <Building2 className="h-4 w-4" />
                            Empresa
                        </button>
                    </div>
                    
                    <div className="flex items-start gap-2 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg border border-amber-100 dark:border-amber-900/50 max-w-fit">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span className="text-xs font-medium">(adicionar esse menu ao menu lateral principal mais tarde.)</span>
                    </div>
                </div>
            </div>

            {/* --- Seção de Informações Pessoais --- */}
            <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Informações Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {/* Profile Picture */}
                    <div className="md:col-span-1 flex flex-col items-center text-center">
                        <div className="relative mb-3">
                            <img 
                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                                alt="Foto do Perfil" 
                                className="w-28 h-28 rounded-full object-cover ring-4 ring-gray-100 dark:ring-gray-800"
                            />
                            <button className="absolute bottom-0 right-0 h-9 w-9 bg-primary-600 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-gray-900 hover:bg-primary-700 transition-colors">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>
                         <p className="text-xs text-gray-500 dark:text-gray-400">JPG, GIF ou PNG. Tamanho máx. de 5MB.</p>
                    </div>

                    {/* Form Fields */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                            <input 
                                type="text"
                                id="firstName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                            />
                        </div>
                        <div>
                             <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sobrenome</label>
                            <input 
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                            />
                        </div>
                        <div className="sm:col-span-2">
                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                             <input 
                                type="email" 
                                id="email"
                                value="pueblo@example.com" 
                                disabled 
                                className="w-full p-2.5 rounded-lg bg-gray-100 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] outline-none text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Seção de Dados da Empresa --- */}
            <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary-500" />
                    Dados da Empresa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Empresa</label>
                        <input 
                            type="text"
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Ex: Minha Empresa Ltda"
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Este nome será exibido no cabeçalho quando o modo "Empresa" estiver ativo.
                        </p>
                    </div>
                    <div>
                         <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNPJ (Opcional)</label>
                         <input 
                            type="text" 
                            id="cnpj"
                            placeholder="00.000.000/0001-00"
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        />
                    </div>

                    {/* Moeda Padrão */}
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Moeda Padrão</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            <select 
                                id="currency"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full p-2.5 pl-9 pr-10 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm appearance-none cursor-pointer"
                            >
                                {currencyOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            A moeda selecionada será aplicada em todos os gráficos e valores do sistema.
                        </p>
                    </div>
                </div>
            </div>


            {/* --- Seção de Temas Visuais (Presets) --- */}
            <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary-500" />
                    Temas Visuais
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {/* Default */}
                     <button 
                        onClick={() => setCurrentTheme('default')}
                        className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${currentTheme === 'default' ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-200 dark:border-[var(--border-color)] hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                        <div className="h-16 w-full rounded flex overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm">
                            {/* Preview dinâmica baseada no modo atual */}
                            {isDark ? (
                                <>
                                    <div className="w-1/3 h-full bg-[#181818]"></div>
                                    <div className="w-2/3 h-full bg-[#212121]"></div>
                                </>
                            ) : (
                                <>
                                    <div className="w-1/3 h-full bg-[#F4F3EF]"></div>
                                    <div className="w-2/3 h-full bg-[#FAF9F5]"></div>
                                </>
                            )}
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Padrão</span>
                    </button>

                    {PRESET_THEMES.map(theme => (
                         <button 
                            key={theme.id}
                            onClick={() => setCurrentTheme(theme.id)}
                            className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${currentTheme === theme.id ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-200 dark:border-[var(--border-color)] hover:border-gray-300 dark:hover:border-gray-600'}`}
                        >
                            <div className="h-16 w-full rounded flex overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm">
                                {/* Renderiza a preview usando as cores do modo atual (isDark) */}
                                <div className="w-1/3 h-full" style={{ backgroundColor: isDark ? theme.dark.bg_left : theme.light.bg_left }}></div>
                                <div className="w-2/3 h-full" style={{ backgroundColor: isDark ? theme.dark.bg_right : theme.light.bg_right }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{theme.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Seção de Modo de Cor --- */}
            <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Modo de Cor</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button 
                        onClick={() => setColorMode('light')}
                        className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${colorMode === 'light' ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-[var(--border-color)] hover:border-gray-300 dark:hover:border-gray-700'}`}
                    >
                         <div className="flex items-center gap-2">
                            <Sun className={`h-4 w-4 ${colorMode === 'light' ? 'text-primary-600' : 'text-gray-500'}`} />
                            <span className={`text-sm font-medium ${colorMode === 'light' ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>Claro</span>
                        </div>
                    </button>

                    <button 
                        onClick={() => setColorMode('dark')}
                        className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${colorMode === 'dark' ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-[var(--border-color)] hover:border-gray-300 dark:hover:border-gray-700'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Moon className={`h-4 w-4 ${colorMode === 'dark' ? 'text-primary-400' : 'text-gray-500'}`} />
                            <span className={`text-sm font-medium ${colorMode === 'dark' ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>Escuro</span>
                        </div>
                    </button>
                    
                    <button 
                        onClick={() => setColorMode('system')}
                        className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${colorMode === 'system' ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-[var(--border-color)] hover:border-gray-300 dark:hover:border-gray-700'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Monitor className={`h-4 w-4 ${colorMode === 'system' ? 'text-primary-400' : 'text-gray-500'}`} />
                            <span className={`text-sm font-medium ${colorMode === 'system' ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>Sistema</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* --- Seção de Cor de Destaque --- */}
            <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Cor de Destaque</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {colorOptions.map(color => (
                         <button 
                            key={color.id}
                            onClick={() => setAccentColor(color.id)}
                            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${accentColor === color.id ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-[var(--border-color)] hover:border-gray-300 dark:hover:border-gray-700'}`}
                        >
                            <div className={`w-8 h-8 rounded-full ${color.class}`}></div>
                            <span className={`text-xs font-medium ${accentColor === color.id ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>{color.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PersonalizationSettings: React.FC<{ extraContext?: any }> = ({ extraContext }) => {
    // Estado para armazenar os campos do perfil estratégico, mapeado do onboarding
    const [formData, setFormData] = useState({
        nome_preferido: "Pueblo",
        usage_context: "empresa",
        work_mode: "solo",
        team_size: "",
        pitch_10s: "Vendo serviços de consultoria...",
        business_model: "servico",
        niche: "Tecnologia",
        acquisition_channel: "Instagram",
        routine_bottleneck: "planejar",
        main_bother: "dinheiro",
        financial_pain: "",
        numbers_feeling: "",
        objective_90d: "",
        knowledge_level: "intermediario",
        education_history: "",
        references: "",
        communication_style: "direto"
    });

    // Update state when extraContext changes (from Onboarding)
    useEffect(() => {
        if (extraContext) {
            setFormData(prev => ({
                ...prev,
                ...extraContext // Assuming extraContext has exact matching keys from OnboardingPage
            }));
        }
    }, [extraContext]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        alert("Perfil estratégico salvo com sucesso! A IA agora utilizará este contexto.");
    };

    const handleRetakeOnboarding = () => {
        if(confirm("Deseja reiniciar o processo de onboarding guiado pela IA? Isso abrirá o chat com o Agente de Onboarding.")) {
            console.log("Reiniciando onboarding...");
        }
    };

    return (
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-300 p-1 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Personalização Estratégica</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Defina como a IA deve entender seu negócio e interagir com você.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleRetakeOnboarding}
                        className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-gray-700 dark:text-gray-300 hover:bg-[var(--bg-input)] transition-colors text-sm font-medium"
                    >
                        Refazer Onboarding
                    </button>
                    <button 
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm"
                    >
                        <Save className="h-4 w-4" />
                        Salvar Perfil
                    </button>
                </div>
            </div>

            {/* 1. Contexto Geral */}
            <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-primary-500" />
                    Contexto Geral
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Preferido</label>
                        <input 
                            type="text" 
                            value={formData.nome_preferido}
                            onChange={(e) => handleInputChange('nome_preferido', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contexto de Uso</label>
                        <select 
                            value={formData.usage_context}
                            onChange={(e) => handleInputChange('usage_context', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        >
                            <option value="pessoal">Pessoal</option>
                            <option value="empresa">Empresa</option>
                            <option value="ambos">Ambos</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modo de Trabalho</label>
                        <select 
                            value={formData.work_mode}
                            onChange={(e) => handleInputChange('work_mode', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        >
                            <option value="solo">Trabalho Sozinho(a)</option>
                            <option value="equipe">Tenho Equipe</option>
                        </select>
                    </div>
                    {formData.work_mode === 'equipe' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tamanho da Equipe</label>
                            <input 
                                type="text"
                                value={formData.team_size}
                                onChange={(e) => handleInputChange('team_size', e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                placeholder="Ex: 5"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Negócio Hoje */}
            <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-amber-500" />
                    Seu Negócio Hoje
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pitch de 10s</label>
                        <textarea 
                            rows={2}
                            value={formData.pitch_10s}
                            onChange={(e) => handleInputChange('pitch_10s', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modelo de Negócio</label>
                        <select 
                            value={formData.business_model}
                            onChange={(e) => handleInputChange('business_model', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        >
                            <option value="produto">Produto Físico</option>
                            <option value="servico">Serviço</option>
                            <option value="infoproduto">Infoproduto</option>
                            <option value="hibrido">Híbrido</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nicho</label>
                        <input 
                            type="text" 
                            value={formData.niche}
                            onChange={(e) => handleInputChange('niche', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Principal Canal de Aquisição</label>
                        <input 
                            type="text" 
                            value={formData.acquisition_channel}
                            onChange={(e) => handleInputChange('acquisition_channel', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Dores & Realidade */}
            <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-500" />
                    Dores e Realidade
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gargalo na Rotina</label>
                        <select 
                            value={formData.routine_bottleneck}
                            onChange={(e) => handleInputChange('routine_bottleneck', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        >
                            <option value="planejar">Planejar</option>
                            <option value="executar">Executar</option>
                            <option value="controlar">Controlar</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maior Incômodo</label>
                        <select 
                            value={formData.main_bother}
                            onChange={(e) => handleInputChange('main_bother', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        >
                            <option value="dinheiro">Dinheiro</option>
                            <option value="vendas">Vendas</option>
                            <option value="rotina">Rotina</option>
                            <option value="clareza">Clareza</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dor Financeira (O que tira o sono)</label>
                        <textarea 
                            rows={2}
                            value={formData.financial_pain}
                            onChange={(e) => handleInputChange('financial_pain', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm resize-none"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sentimento sobre os Números</label>
                        <input 
                            type="text" 
                            value={formData.numbers_feeling}
                            onChange={(e) => handleInputChange('numbers_feeling', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* 4. Objetivo & Conhecimento */}
            <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-purple-500" />
                    Objetivo & Perfil
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Objetivo (90 dias)</label>
                        <textarea 
                            rows={2}
                            value={formData.objective_90d}
                            onChange={(e) => handleInputChange('objective_90d', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nível de Conhecimento</label>
                        <select 
                            value={formData.knowledge_level}
                            onChange={(e) => handleInputChange('knowledge_level', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        >
                            <option value="iniciante">Iniciante</option>
                            <option value="intermediario">Intermediário</option>
                            <option value="avancado">Avançado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estilo de Comunicação</label>
                        <select 
                            value={formData.communication_style}
                            onChange={(e) => handleInputChange('communication_style', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        >
                            <option value="direto">Direto</option>
                            <option value="didatico">Didático</option>
                            <option value="motivador">Motivador</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Formação / Cursos</label>
                        <input 
                            type="text" 
                            value={formData.education_history}
                            onChange={(e) => handleInputChange('education_history', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referências (Livros/Autores)</label>
                        <input 
                            type="text" 
                            value={formData.references}
                            onChange={(e) => handleInputChange('references', e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[var(--bg-input)] border border-gray-300 dark:border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SecuritySettings = () => (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-300 p-1 space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Segurança</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie a segurança e o acesso da sua conta.</p>
        </div>
        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[var(--border-color)]">
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2"><KeyRound className="h-4 w-4 text-gray-500"/>Senha de Acesso</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Recomenda-se usar uma senha forte e única.</p>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-[var(--bg-input)] border border-gray-200 dark:border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5">Alterar</button>
            </div>
             <div className="flex items-center justify-between pt-4">
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gray-500"/>Autenticação de Dois Fatores (2FA)</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Adicione uma camada extra de segurança à sua conta.</p>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">Ativar</button>
            </div>
        </div>
    </div>
);

const NotificationSettings = () => (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-300 p-1 space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notificações</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Escolha como e quando você quer ser notificado.</p>
        </div>
        <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] p-6 shadow-sm divide-y divide-gray-100 dark:divide-[var(--border-color)]">
            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-500 mt-1"/>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notificações por E-mail</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receba resumos e alertas importantes no seu e-mail.</p>
                    </div>
                </div>
                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 flex items-center cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform translate-x-6 dark:translate-x-0"></div>
                </div>
            </div>
             <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-gray-500 mt-1"/>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notificações Push</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receba notificações em tempo real no seu dispositivo.</p>
                    </div>
                </div>
                 <div className="w-12 h-6 bg-primary-600 rounded-full p-0.5 flex items-center cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform translate-x-6"></div>
                </div>
            </div>
        </div>
    </div>
);

export const LogoutSettings: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
    <div className="h-[calc(100vh-9rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 pr-2 pb-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-300 p-1 space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-500">Encerrar Sessão</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Você está prestes a sair da sua conta.</p>
            </div>
            <div className="bg-white dark:bg-[var(--bg-card)] rounded-xl border border-gray-200 dark:border-[var(--border-color)] p-8 shadow-lg flex flex-col items-center text-center space-y-6">
                 <div className="h-20 w-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                    <LogOut className="h-10 w-10" />
                 </div>
                 <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Tem certeza que deseja sair?</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Você precisará fazer login novamente para acessar seus dados financeiros e configurações.
                    </p>
                 </div>
                 <div className="w-full space-y-3">
                     <button 
                        onClick={onLogout}
                        className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                     >
                        Sim, sair agora
                     </button>
                 </div>
            </div>
        </div>
    </div>
);


export const SettingsContent: React.FC<SettingsContentProps> = (props) => {
    const menuItems = [
        { category: 'CONTA', items: ['Perfil', 'Personalização', 'Segurança', 'Notificações'] },
        { category: 'SUPORTE', items: ['Central de Ajuda', 'Falar com Suporte', 'Feedback'] }
    ];
    const [selected, setSelected] = useState('Perfil');

    const renderContent = () => {
        switch (selected) {
            case 'Perfil':
                return <ProfileSettings {...props} />;
            case 'Personalização':
                return <PersonalizationSettings extraContext={props.extraContext} />;
            case 'Segurança':
                return <SecuritySettings />;
            case 'Notificações':
                return <NotificationSettings />;
            case 'Central de Ajuda':
                return <HelpCenterContent />;
            case 'Falar com Suporte':
                return <ContactSupportContent />;
            case 'Enviar Feedback':
                return <FeedbackContent />;
            default:
                return <PlaceholderContent title={selected} />;
        }
    };

    return (
        <ContentWithSidebarLayout 
            title="Configurações" 
            menuItems={menuItems}
            selectedItem={selected}
            setSelectedItem={setSelected}
        >
            {renderContent()}
        </ContentWithSidebarLayout>
    );
}
