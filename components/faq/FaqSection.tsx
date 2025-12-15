
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '../header/utils';

const categories = {
    geral: "Geral",
    agentes: "Agentes",
    funcionalidades: "Funcionalidades",
    seguranca: "Segurança e Dados",
    planos: "Planos e Assinatura"
};

const faqData = {
    geral: [
        {
            question: "O que é o Socceo?",
            answer: "É um sistema de gestão inteligente que opera no seu WhatsApp. Ele centraliza finanças, vendas, agenda e operações, transformando suas mensagens de texto, áudio ou fotos em dados estruturados e insights para o seu negócio."
        },
        {
            question: "Para quem o Socceo é ideal?",
            answer: "É ideal para empreendedores, gestores e pequenos empresários que buscam clareza e controle sobre sua operação sem a complexidade de múltiplos softwares. Se você vive com planilhas, CRMs e anotações espalhadas, o Socceo foi feito para você."
        },
        {
            question: "Preciso instalar algum aplicativo?",
            answer: "Não. O Socceo funciona diretamente no seu WhatsApp, seja no celular ou no computador. Você também terá acesso a um dashboard web para visualizações mais detalhadas e relatórios."
        }
    ],
    agentes: [
        {
            question: "O que são os Agentes do Socceo?",
            answer: "São inteligências artificiais especializadas que atuam como departamentos inteiros da sua empresa. Eles funcionam como um CFO (Financeiro), CMO (Marketing) e COO (Operações) digitais, trabalhando 24/7 para analisar seus dados."
        },
        {
            question: "Eles tomam decisões sozinhos?",
            answer: "Eles analisam, sugerem e preparam o terreno. Os agentes identificam padrões e recomendam ações (ex: 'Corte este custo', 'Aumente verba neste anúncio'), mas a decisão final estratégica é sempre sua, com apenas um clique de aprovação."
        },
        {
            question: "Os agentes aprendem com meu negócio?",
            answer: "Sim. Quanto mais você interage, mais eles entendem seu contexto, suas margens, seus fornecedores e seu estilo de gestão, tornando as recomendações cada vez mais precisas e personalizadas."
        }
    ],
    funcionalidades: [
        {
            question: "Como o Socceo entende o que eu envio?",
            answer: "Utilizamos inteligência artificial avançada para interpretar linguagem natural. Você pode dizer \"paguei R$500 de almoço com cliente X\" ou enviar a foto de uma nota fiscal, e o sistema entende, categoriza e registra a despesa automaticamente."
        },
        {
            question: "O Socceo se integra com meu banco ou calendário?",
            answer: "Sim. Uma das funcionalidades principais é a integração com sua agenda (Google Agenda, por exemplo) para nunca mais perder um compromisso. Integrações bancárias estão em nosso roadmap para automatizar ainda mais o controle financeiro."
        },
        {
            question: "Que tipo de relatórios ele gera?",
            answer: "Você pode solicitar relatórios de fluxo de caixa (DRE), performance de vendas, status de projetos e muito mais, diretamente pelo WhatsApp. Ele entrega um resumo claro em segundos ou um PDF detalhado se preferir."
        }
    ],
    seguranca: [
        {
            question: "Meus dados comerciais estão seguros?",
            answer: "Absolutamente. A segurança é nossa prioridade máxima. Utilizamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança de dados. Suas informações de negócio são confidenciais e protegidas."
        },
        {
            question: "Quem tem acesso às minhas informações?",
            answer: "Apenas você e os usuários que você autorizar. Nossos sistemas processam os dados de forma automatizada, sem intervenção humana, para gerar seus relatórios e insights."
        }
    ],
    planos: [
        {
            question: "Existe um período de teste gratuito?",
            answer: "Sim, oferecemos um período de teste gratuito de 7 dias para você experimentar o poder do Socceo na sua operação sem compromisso."
        },
        {
            question: "Posso cancelar minha assinatura a qualquer momento?",
            answer: "Sim. Você pode cancelar sua assinatura a qualquer momento, sem burocracia. Se estiver no plano anual, o cancelamento valerá para a não-renovação no ciclo seguinte."
        },
        {
            question: "Como funciona o plano Enterprise?",
            answer: "O plano Enterprise é para operações mais complexas, com múltiplos times e necessidade de personalização. Ele inclui dashboards ilimitados, workflows customizados e um gerente de sucesso dedicado. Agende uma conversa para entendermos suas necessidades."
        }
    ]
};


const FAQHeader = ({ title, subtitle }: { title: string; subtitle: string; }) => (
    <motion.div 
        className="relative z-10 flex flex-col items-center justify-center text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
    >
        <span className="mb-6 text-sm md:text-base font-bold text-neutral-400 uppercase tracking-[0.2em]">
            {subtitle}
        </span>
        <h2 className="mb-8 text-3xl md:text-5xl font-bold text-white leading-tight">{title}</h2>
    </motion.div>
);

const FAQTabs = ({ categories, selected, setSelected }: { categories: Record<string, string>; selected: string; setSelected: (category: string) => void; }) => (
    <motion.div 
        className="relative z-10 flex flex-wrap items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
    >
        {Object.entries(categories).map(([key, label]) => (
            <button
                key={key}
                onClick={() => setSelected(key)}
                className={cn(
                    "relative overflow-hidden whitespace-nowrap rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-500",
                    selected === key
                        ? "border-transparent text-black"
                        : "border-white/20 bg-transparent text-neutral-400 hover:text-white"
                )}
            >
                <span className="relative z-10">{label}</span>
                <AnimatePresence>
                    {selected === key && (
                        <motion.span
                            initial={{ y: "100%" }}
                            animate={{ y: "0%" }}
                            exit={{ y: "100%" }}
                            transition={{ duration: 0.5, ease: "backIn" }}
                            className="absolute inset-0 z-0 bg-white"
                        />
                    )}
                </AnimatePresence>
            </button>
        ))}
    </motion.div>
);

const FAQList = ({ faqData, selected }: { faqData: Record<string, { question: string; answer: string; }[]>; selected: string; }) => (
    <motion.div 
        className="mx-auto mt-12 max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
        <AnimatePresence mode="wait">
            {Object.entries(faqData).map(([category, questions]) => {
                if (selected === category) {
                    return (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, ease: "backIn" }}
                            className="space-y-4"
                        >
                            {questions.map((faq, index) => (
                                <FAQItem key={index} {...faq} />
                            ))}
                        </motion.div>
                    );
                }
                return null;
            })}
        </AnimatePresence>
    </motion.div>
);

const MeetingCTA = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="mx-auto mt-16 max-w-4xl px-4"
    >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#080808] p-8 md:p-10 shadow-2xl">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#FFA11D]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-[#FFA11D] uppercase tracking-widest mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFA11D] animate-pulse" />
                        Diagnóstico Gratuito
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        Agende uma Demonstração Personalizada
                    </h3>
                    <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                        Tem dúvidas específicas sobre a sua operação ou quer uma demo personalizada? Nossos especialistas podem montar um plano de implementação para você.
                    </p>
                </div>
                
                <button className="flex-shrink-0 group relative inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-black transition-all duration-200 bg-[#FFA11D] rounded-xl hover:bg-[#FFB24D] hover:shadow-[0_0_20px_-5px_rgba(255,161,29,0.3)] active:scale-95">
                    Agendar Reunião
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    </motion.div>
);

// FIX: Explicitly typed the FAQItem component with React.FC.
const FAQItem: React.FC<{ question: string; answer: string; }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            animate={isOpen ? "open" : "closed"}
            className={cn(
                "rounded-xl border border-white/20 transition-colors",
                isOpen ? "bg-neutral-900/50" : "bg-neutral-950"
            )}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
            >
                <span
                    className={cn(
                        "text-lg font-medium transition-colors",
                        isOpen ? "text-white" : "text-neutral-400"
                    )}
                >
                    {question}
                </span>
                <motion.span
                    variants={{
                        open: { rotate: "45deg" },
                        closed: { rotate: "0deg" },
                    }}
                    transition={{ duration: 0.2 }}
                >
                    <Plus
                        className={cn(
                            "h-5 w-5 transition-colors",
                            isOpen ? "text-white" : "text-neutral-400"
                        )}
                    />
                </motion.span>
            </button>
            <motion.div
                initial={false}
                animate={{
                    height: isOpen ? "auto" : "0px",
                    marginBottom: isOpen ? "16px" : "0px"
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden px-4"
            >
                <p className="text-neutral-400">{answer}</p>
            </motion.div>
        </motion.div>
    );
};

export default function FaqSection() {
    const categoryKeys = Object.keys(categories);
    const [selectedCategory, setSelectedCategory] = useState(categoryKeys[0]);

    return (
        <section
            className={cn(
                "relative overflow-hidden bg-transparent px-4 pt-0 pb-12 text-white"
            )}
        >
            <FAQHeader title="Ainda tem dúvidas?" subtitle="PERGUNTAS FREQUENTES" />
            <FAQTabs
                categories={categories}
                selected={selectedCategory}
                setSelected={setSelectedCategory}
            />
            <FAQList
                faqData={faqData}
                selected={selectedCategory}
            />
            <MeetingCTA />
        </section>
    );
};
