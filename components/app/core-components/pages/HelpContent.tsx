

import React, { useState } from 'react';
import { PlaceholderContent } from '../ui/PlaceholderContent';
import { ContentWithSidebarLayout } from '../ui/ContentWithSidebarLayout';
import { Search, ChevronDown, Send, MessageSquare, Star } from 'lucide-react';

export const HelpCenterContent = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const faqs = [
        { q: "Como adiciono uma nova transação?", a: "Para adicionar uma nova transação, vá para a seção 'Transações' no menu lateral e clique no botão 'Nova Transação'. Preencha os detalhes como valor, categoria e data, e clique em salvar." },
        { q: "É possível categorizar minhas despesas?", a: "Sim! Ao adicionar ou editar uma transação, você pode selecionar uma categoria existente ou criar uma nova na seção 'Categorias'. Isso ajuda a organizar seus gastos e a gerar relatórios mais precisos." },
        { q: "Como funcionam os relatórios?", a: "A seção 'Relatórios' consolida seus dados financeiros em gráficos e resumos fáceis de entender. Você pode filtrar por período, tipo de transação e categoria para obter insights detalhados sobre suas finanças." },
        { q: "Posso conectar minha conta bancária?", a: "Atualmente, a funcionalidade de conexão bancária automática está em desenvolvimento. Por enquanto, as transações precisam ser adicionadas manualmente para garantir sua privacidade e controle total dos dados." },
    ];
    return (
        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-300 p-1">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Central de Ajuda</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Encontre respostas para suas dúvidas ou nos envie uma mensagem.</p>
                <div className="relative mt-4 max-w-lg mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" placeholder="Pesquisar por tópicos..." className="w-full p-3 pl-12 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm" />
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Perguntas Frequentes</h3>
                {faqs.map((faq, index) => (
                     <div key={index} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                        <button 
                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            className="w-full flex justify-between items-center text-left py-4"
                        >
                            <span className="font-medium text-gray-800 dark:text-gray-200">{faq.q}</span>
                            <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-60' : 'max-h-0'}`}>
                            <p className="pb-4 text-gray-600 dark:text-gray-400 pr-4">{faq.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ContactSupportContent = () => (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-300 p-1">
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Falar com Suporte</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Nossa equipe está pronta para ajudar. Preencha o formulário abaixo.</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
             <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assunto</label>
                    <input 
                        type="text" 
                        id="subject" 
                        placeholder="Ex: Dúvida sobre fatura do cartão" 
                        className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sua Mensagem</label>
                    <textarea 
                        id="message" 
                        rows={6} 
                        placeholder="Descreva seu problema ou dúvida em detalhes..." 
                        className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none text-sm resize-none"
                    ></textarea>
                </div>
                 <button type="submit" className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    Enviar Mensagem
                </button>
            </form>
        </div>
    </div>
);

export const FeedbackContent = () => {
    const [rating, setRating] = useState(0);
    return (
        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-300 p-1">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Enviar Feedback</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Adoramos ouvir suas ideias! Compartilhe suas sugestões conosco.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                 <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Qual sua nota para o app?</label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => setRating(star)} type="button">
                                    <Star className={`h-8 w-8 transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seu Feedback</label>
                        <textarea 
                            id="feedback" 
                            rows={6} 
                            placeholder="O que você gosta? O que podemos melhorar?" 
                            className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none text-sm resize-none"
                        ></textarea>
                    </div>
                     <button type="submit" className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Enviar Feedback
                    </button>
                </form>
            </div>
        </div>
    );
};


export const HelpContent = () => {
    const menuItems = [{ category: 'RECURSOS', items: ['Central de Ajuda', 'Falar com Suporte', 'Feedback'] }];
    const [selected, setSelected] = useState(menuItems[0].items[0]);

     const renderContent = () => {
        switch (selected) {
            case 'Central de Ajuda':
                return <HelpCenterContent />;
            case 'Falar com Suporte':
                return <ContactSupportContent />;
            case 'Feedback':
                return <FeedbackContent />;
            default:
                return <PlaceholderContent title={selected} />;
        }
    };

    return (
        <ContentWithSidebarLayout 
            title="Ajuda e Suporte" 
            menuItems={menuItems}
            selectedItem={selected}
            setSelectedItem={setSelected}
        >
            {renderContent()}
        </ContentWithSidebarLayout>
    );
}