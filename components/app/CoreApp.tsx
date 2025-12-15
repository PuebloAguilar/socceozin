
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardPage } from "../app/core-components/ui/dashboard-with-collapsible-sidebar";
import { LoginPage } from "../app/core-components/pages/LoginPage";
import { OnboardingPage } from "../app/core-components/pages/OnboardingPage";
import { PersonalizingLoader } from '../app/core-components/pages/PersonalizingLoader';
import { Meta, MetaStatus, AreaType, KeyResult } from './types';

type AppView = 'login' | 'onboarding' | 'personalizing' | 'dashboard';

// Initial Data with Dates for Gantt Integration
const INITIAL_METAS: Meta[] = [
  {
    id: 'meta-1',
    area: 'sales',
    objective: 'Expandir base de clientes enterprise',
    cycle: 'Q4 2025',
    owner: { name: 'João Silva', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    keyResults: [
      { id: 'kr-1-1', description: 'Mapear 50 empresas alvo', current: 50, target: 50, unit: '', weight: 20, startDate: '2025-10-01', endDate: '2025-10-15' },
      { id: 'kr-1-2', description: 'Fechar 10 novos contratos enterprise', current: 4, target: 10, unit: '', weight: 40, startDate: '2025-10-16', endDate: '2025-11-30', dependencyId: 'kr-1-1' },
      { id: 'kr-1-3', description: 'Atingir R$ 500k em pipeline ponderado', current: 280000, target: 500000, unit: 'R$', weight: 40, startDate: '2025-11-01', endDate: '2025-12-20', dependencyId: 'kr-1-2' }
    ]
  },
  {
    id: 'meta-2',
    area: 'management',
    objective: 'Garantir sustentabilidade financeira',
    cycle: 'Q4 2025',
    owner: { name: 'Maria Souza', avatar: 'https://i.pravatar.cc/150?u=5' },
    keyResults: [
      { id: 'kr-2-1', description: 'Manter runway de 6 meses', current: 4.5, target: 6, unit: 'meses', weight: 50, startDate: '2025-10-01', endDate: '2025-12-31' },
      { id: 'kr-2-2', description: 'Manter despesas abaixo de R$ 45k', current: 52000, target: 45000, unit: 'R$', weight: 50, startDate: '2025-10-01', endDate: '2025-12-31' }
    ]
  },
  {
    id: 'meta-3',
    area: 'product',
    objective: 'Consolidar receita recorrente',
    cycle: 'Q4 2025',
    owner: { name: 'Carlos Tech', avatar: 'https://i.pravatar.cc/150?u=8' },
    keyResults: [
      { id: 'kr-3-1', description: 'Lançar Funcionalidade Pro', current: 80, target: 100, unit: '%', weight: 30, startDate: '2025-10-01', endDate: '2025-10-30' },
      { id: 'kr-3-2', description: 'Atingir R$ 80k em MRR', current: 65000, target: 80000, unit: 'R$', weight: 70, startDate: '2025-11-01', endDate: '2025-12-15', dependencyId: 'kr-3-1' }
    ]
  }
];

const DEFAULT_KPIS = {
  management: [],
  marketing: [],
  sales: [],
  product: [],
  tech: []
};

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('login');
  
  // Global User State
  const [userConfig, setUserConfig] = useState({
      userName: "Pueblo Juan",
      companyName: "Pueblo Inc.",
      accountType: "empresa" as 'personal' | 'business',
      colorMode: "dark" as 'light' | 'dark' | 'system',
      accentColor: "green",
      currentTheme: "default",
      currency: "BRL",
      kpis: DEFAULT_KPIS,
      metas: INITIAL_METAS, // Renamed from okrs
      // Extra context fields
      nicho: "",
      area_maior_incomodo: "",
      nome_preferido: "",
      usage_context: "",
      work_mode: "",
      team_size: "",
      pitch_10s: "",
      business_model: "",
      acquisition_channel: "",
      routine_bottleneck: "",
      main_bother: "",
      financial_pain: "",
      numbers_feeling: "",
      objective_90d: "",
      knowledge_level: "",
      education_history: "",
      references: "",
      communication_style: ""
  });

  const handleLogin = () => {
    setCurrentView('dashboard');
  };

  const handleSignup = (partialUserData: any) => {
    setUserConfig(prev => ({
        ...prev,
        userName: partialUserData.name || prev.userName,
        accentColor: 'green',
        currentTheme: 'default'
    }));
    setCurrentView('onboarding');
  };

  const handleOnboardingFinish = (data: any) => {
      setUserConfig(prev => ({
          ...prev,
          userName: data.nome_preferido || prev.userName,
          nome_preferido: data.nome_preferido,
          accountType: data.usage_context === 'pessoal' ? 'personal' : 'business',
          companyName: data.nome_empresa || prev.companyName,
          colorMode: data.colorMode,
          accentColor: data.accentColor,
          currentTheme: data.currentTheme,
          ...data
      }));
      setCurrentView('personalizing');
  };
  
  const handlePersonalizationComplete = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  // Function to update Metas from Workspace or Planning
  const handleUpdateMetas = (newMetas: Meta[]) => {
      setUserConfig(prev => ({ ...prev, metas: newMetas }));
  };
  
  return (
    <AnimatePresence mode="wait">
      {currentView === 'login' && (
        <LoginPage onLogin={handleLogin} onSignup={handleSignup} />
      )}
      
      {currentView === 'onboarding' && (
        <OnboardingPage 
            initialName={userConfig.userName} 
            onFinish={handleOnboardingFinish} 
        />
      )}

      {currentView === 'personalizing' && (
        <PersonalizingLoader onComplete={handlePersonalizationComplete} />
      )}

      {currentView === 'dashboard' && (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <DashboardPage 
                initialConfig={userConfig}
                onLogout={handleLogout} 
                onUpdateMetas={handleUpdateMetas}
            />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
