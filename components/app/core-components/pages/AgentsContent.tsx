
import React, { useState } from 'react';
import { Send, Bot, Lock, FileText, X, CheckCircle2, BookOpen, Zap, ShieldCheck } from 'lucide-react';
import { ContentWithSidebarLayout } from '../ui/ContentWithSidebarLayout';

// Helper component for locked features (Adaptado para aplicar apenas ao corpo do chat)
const LockedFeatureOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="relative h-full w-full flex flex-col">
      <div className="blur-sm select-none pointer-events-none opacity-60 h-full w-full transition-all duration-500 flex flex-col">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-auto">
        <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 text-center max-w-sm backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Em Breve</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Este agente especialista está em treinamento e estará disponível na próxima atualização do sistema.
          </p>
        </div>
      </div>
    </div>
);

// --- Componente Modal de Documentação ---
const AgentDocumentationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    agentName: string;
    category?: string;
}> = ({ isOpen, onClose, agentName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] transition-opacity duration-300 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--bg-card)] rounded-2xl shadow-2xl w-full max-w-3xl relative animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden border border-[var(--border-color)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-start shrink-0 bg-[var(--bg-card)]">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400">
                            <Bot className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{agentName}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Documentação Técnica & Guia de Uso</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 space-y-8">
                    
                    {/* Visão Geral */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary-500" />
                            Visão Geral
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            O agente <strong>{agentName}</strong> é uma inteligência artificial especializada, projetada para auxiliar nas tomadas de decisão e na execução de tarefas complexas relacionadas à sua área. Ele utiliza modelos de linguagem avançados treinados com dados corporativos e melhores práticas de mercado para fornecer insights precisos e acionáveis.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Capacidades */}
                        <section className="bg-[var(--bg-input)] p-5 rounded-xl border border-[var(--border-color)]">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-500" />
                                Principais Capacidades
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span>Análise preditiva de dados e tendências do setor.</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span>Automação de relatórios e diagnósticos operacionais.</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span>Sugestão de estratégias baseadas em contexto histórico.</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span>Auditoria e verificação de conformidade em tempo real.</span>
                                </li>
                            </ul>
                        </section>

                        {/* Segurança e Privacidade */}
                        <section className="bg-[var(--bg-input)] p-5 rounded-xl border border-[var(--border-color)]">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-blue-500" />
                                Segurança & Protocolos
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>
                                    <span>Os dados compartilhados são criptografados ponta a ponta.</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>
                                    <span>O agente não retém dados sensíveis para treinamento público.</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>
                                    <span>Histórico de conversas auditável e exportável.</span>
                                </li>
                            </ul>
                        </section>
                    </div>

                    {/* Exemplo de Prompt */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Como interagir</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Tente enviar comandos diretos e forneça contexto para obter melhores resultados.</p>
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-sm text-gray-700 dark:text-gray-300">
                            "Atue como {agentName} e analise os seguintes dados anexados para identificar oportunidades de otimização de custos..."
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border-color)] bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    );
};

const menuItemsRaw = [
    {
        category: 'GESTÃO & ESTRATÉGIA',
        items: [
            'Chief Operating Officer (COO)',
            'Chief Strategy Officer (CSO)',
            'Gerente de Projetos',
            'Coordenador de Operações',
            'Analista de Processos',
            'Analista de Business Intelligence',
            'PMO',
            'Scrum Master',
            'Agile Coach'
        ]
    },
    {
        category: 'FINANCEIRO',
        items: [
            'Chief Financial Officer (CFO)',
            'Analista Financeiro',
            'Controller',
            'Tesouraria',
            'Contas a Pagar',
            'Contas a Receber',
            'FP&A',
            'Analista de Custos',
            'Auditor Interno',
            'Analista de Crédito e Cobrança',
            'Tax Manager'
        ]
    },
    {
        category: 'COMERCIAL',
        items: [
            'Chief Revenue Officer (CRO)',
            'SDR',
            'BDR (Business Development Representative)',
            'Closer',
            'Executivo de Contas',
            'Account Manager',
            'Key Account Manager',
            'Coordenador Comercial',
            'Customer Success',
            'Pós-Vendas',
            'Inside Sales',
            'Analista de Inteligência Comercial',
            'Renewals Specialist',
            'Chief Customer Officer (CCO)',
            'Coordenador de Atendimento',
            'Analista de Suporte/SAC',
            'Especialista em CX (Customer Experience)',
            'Quality Assurance (QA de Atendimento)'
        ]
    },
    {
        category: 'MARKETING',
        items: [
            'Chief Marketing Officer (CMO)',
            'Analista de Marketing',
            'Coordenador de Marketing',
            'Designer',
            'Social Media',
            'Especialista em Conteúdo',
            'Copywriter',
            'Especialista em Tráfego',
            'Growth Hacker',
            'Analista de SEO/SEM',
            'Brand Manager',
            'CRM Manager',
            'Especialista em Email Marketing',
            'Analista de Performance'
        ]
    },
    {
        category: 'RECURSOS HUMANOS',
        items: [
            'Chief People Officer (CPO)',
            'Analista de RH',
            'Business Partner',
            'Recrutamento e Seleção',
            'Treinamento e Desenvolvimento',
            'Cultura e Clima',
            'Departamento Pessoal (DP)',
            'Employer Branding',
            'People Analytics',
            'Remuneração e Benefícios',
            'Diversidade e Inclusão'
        ]
    },
    {
        category: 'OPERAÇÕES',
        items: [
            'Supervisor Operacional',
            'Analista de Qualidade',
            'Logística',
            'Melhoria Contínua',
            'Estoque e Suprimentos',
            'Procurement/Compras',
            'Facilities Manager',
            'Analista de Cadeia de Suprimentos (Supply Chain)'
        ]
    },
    {
        category: 'TECNOLOGIA',
        items: [
            'Chief Technology Officer (CTO)',
            'Chief Information Officer (CIO)',
            'Engenheiro de Software',
            'Product Owner',
            'Product Manager',
            'Engenheiro de Dados',
            'Cientista de Dados',
            'Analista de Machine Learning',
            'DevOps',
            'Analista de Suporte Técnico',
            'Especialista em Automação',
            'Tech Lead',
            'Arquiteto de Soluções',
            'Security Engineer/Analista de Segurança da Informação',
            'SRE (Site Reliability Engineer)',
            'QA/Tester',
            'Chief Data Officer (CDO)',
            'Analista de Dados',
            'Engenheiro de Analytics',
            'Data Governance'
        ]
    },
    {
        category: 'JURÍDICO & COMPLIANCE',
        items: [
            'Chief Legal Officer (CLO)',
            'Advogado',
            'Analista Jurídico',
            'Compliance Officer',
            'Analista de Contratos',
            'Data Protection Officer (DPO/LGPD)',
            'Paralegal'
        ]
    },
    {
        category: 'PRODUTO',
        items: [
            'Chief Product Officer (CPO)',
            'Product Designer',
            'UX Research',
            'UX Writer',
            'UI Designer',
            'Roadmap Manager',
            'Analista de Métricas de Produto',
            'Product Marketing Manager'
        ]
    }
];

// Transform raw items to add badges and icons
const menuItems = menuItemsRaw.map(cat => ({
    ...cat,
    badge: "EM BREVE",
    items: cat.items.map(label => ({ label, icon: Lock }))
}));

// Inner Chat component to reuse the logic
const ChatInterface: React.FC<{ agentName: string }> = ({ agentName }) => {
    const [isDocOpen, setIsDocOpen] = useState(false);

    // Mock messages
    const messages = [
        { id: 1, text: `Olá! Sou seu ${agentName}. Estou sendo configurado para te ajudar com excelência em breve.`, sender: 'bot' },
        { id: 2, text: 'Como funcionará sua assistência?', sender: 'user' },
        { id: 3, text: 'Utilizarei inteligência artificial avançada para analisar dados, sugerir estratégias e otimizar processos específicos da minha área de atuação.', sender: 'bot' },
    ];

    return (
        <div className="flex flex-col h-full bg-[var(--bg-card)] rounded-lg shadow-sm border border-[var(--border-color)] overflow-hidden relative">
            <LockedFeatureOverlay>
                {/* Header - Now inside the overlay to be blurred */}
                <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0 bg-[var(--bg-card)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-full">
                            <Bot className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{agentName}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                                Em Treinamento
                            </p>
                        </div>
                    </div>
                    
                    {/* Documentation Button - Updated Style: Orange-500, Unclickable via overlay */}
                    <button 
                        onClick={() => setIsDocOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all text-sm font-medium shadow-sm border-transparent cursor-default"
                        disabled
                    >
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">Documentação</span>
                    </button>
                </div>

                {/* Chat Body */}
                <div className="flex-1 flex flex-col h-full">
                    {/* Messages */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-[var(--bg-input)] flex-shrink-0 flex items-center justify-center border border-[var(--border-color)]">
                                        <Bot className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                )}
                                <div className={`max-w-xl p-3 rounded-2xl ${
                                    msg.sender === 'user'
                                        ? 'bg-primary-600 text-white rounded-br-none'
                                        : 'bg-[var(--bg-input)] border border-[var(--border-color)] text-gray-800 dark:text-gray-200 rounded-bl-none'
                                }`}>
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] shrink-0">
                        <form className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Converse com seu agente..."
                                className="w-full p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] focus:ring-2 focus:ring-primary-500 outline-none text-sm transition-all"
                                disabled
                            />
                            <button type="submit" disabled className="p-3 bg-gray-300 dark:bg-gray-700 text-white rounded-lg cursor-not-allowed shrink-0">
                                <Send className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </LockedFeatureOverlay>

            <AgentDocumentationModal 
                isOpen={isDocOpen} 
                onClose={() => setIsDocOpen(false)} 
                agentName={agentName} 
            />
        </div>
    );
};


export const AgentsContent: React.FC = () => {
    const [selectedAgent, setSelectedAgent] = useState(menuItems[0].items[0].label);
    
    return (
        <ContentWithSidebarLayout 
            title="Agentes IA" 
            menuItems={menuItems}
            selectedItem={selectedAgent}
            setSelectedItem={setSelectedAgent}
        >
            <div className="animate-in fade-in duration-300 h-full">
                <ChatInterface key={selectedAgent} agentName={selectedAgent} />
            </div>
        </ContentWithSidebarLayout>
    );
};
