
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronRight, ArrowRight, Check, Clock, Calendar, Linkedin, Facebook, Mail, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordmarkIcon } from '../header/ui/Icons';
import { useBlog } from '../../context/BlogContext';

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Separate accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
};

const BibliotecaFrameworks = ({ onBack, initialPost, initialOptions }: { onBack: () => void, initialPost?: any, initialOptions?: any }) => {
  const { posts } = useBlog(); // Use context instead of static imports
  const [activeCategory, setActiveCategory] = useState('TODOS');
  const [view, setView] = useState<'HOME' | 'ALL_POSTS' | 'ARTICLE' | 'FRAMEWORK'>('HOME');
  const [activePost, setActivePost] = useState<any>(null);
  
  // Referência para o container de scroll principal
  const containerRef = useRef<HTMLDivElement>(null);
  // Reference for frameworks section
  const frameworksSectionRef = useRef<HTMLDivElement>(null);

  // Handle URL and Deep Linking on Mount
  useEffect(() => {
    try {
        const path = window.location.pathname;
        
        if (initialPost) {
            setActivePost(initialPost);
            // Determine view based on type
            setView(initialPost.type === 'FRAMEWORK' ? 'FRAMEWORK' : 'ARTICLE');
            
            const slug = slugify(initialPost.title);
            const typePath = initialPost.type === 'FRAMEWORK' ? 'framework' : 'insight';
            
            if (!path.includes(slug)) {
                window.history.pushState({}, '', `/blog/${typePath}/${slug}`);
            }
        } else if (path.startsWith('/blog/')) {
            // Nova lógica de parsing: /blog/tipo/slug
            const parts = path.split('/').filter(part => part !== ''); // remove strings vazias
            // parts[0] = 'blog', parts[1] = 'insight'|'framework', parts[2] = 'slug'
            
            if (parts.length >= 3) {
                const slug = parts[2];
                const found = posts.find(item => slugify(item.title) === slug);
                
                if (found) {
                    setActivePost(found);
                    setView(found.type === 'FRAMEWORK' ? 'FRAMEWORK' : 'ARTICLE');
                }
            } else if (parts.length === 2) {
                // Fallback para URLs antigas ou diretas sem tipo (ex: /blog/slug)
                const slug = parts[1];
                const found = posts.find(item => slugify(item.title) === slug);
                if (found) {
                    setActivePost(found);
                    setView(found.type === 'FRAMEWORK' ? 'FRAMEWORK' : 'ARTICLE');
                    // Opcional: Atualizar URL para o novo formato
                    const typePath = found.type === 'FRAMEWORK' ? 'framework' : 'insight';
                    window.history.replaceState({}, '', `/blog/${typePath}/${slug}`);
                }
            }
        }
    } catch (e) {
        console.warn('Navigation check failed in this environment');
    }
  }, [initialPost, posts]); 

  // Handle initial options (scrolling and category filter)
  useEffect(() => {
      if (initialOptions) {
          // If a category is provided, set it
          if (initialOptions.category) {
              setActiveCategory(initialOptions.category);
          }
          
          // If section is 'frameworks', scroll to it
          if (initialOptions.section === 'frameworks') {
              // Ensure view is HOME
              setView('HOME');
              // Use a small timeout to allow rendering
              setTimeout(() => {
                  if (frameworksSectionRef.current) {
                      frameworksSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
              }, 100);
          }
      }
  }, [initialOptions]);

  // Efeito para rolar para o topo sempre que a view mudar (exceto quando initialOptions define scroll)
  useEffect(() => {
    if (containerRef.current && !initialOptions) {
        containerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [view, activePost, initialOptions]);

  // Listen to popstate for browser back button support
  useEffect(() => {
      const handlePopState = () => {
          try {
            const path = window.location.pathname;
            
            if (path === '/' ) {
                onBack();
            } else if (path === '/blog' || path === '/blog/') {
                setView('HOME');
                setActivePost(null);
            } else if (path.startsWith('/blog/')) {
                const parts = path.split('/').filter(Boolean);
                let slug = '';
                
                if (parts.length >= 3) slug = parts[2]; // /blog/type/slug
                else if (parts.length === 2) slug = parts[1]; // /blog/slug
                
                const found = posts.find(item => slugify(item.title) === slug);
                if (found) {
                    setActivePost(found);
                    setView(found.type === 'FRAMEWORK' ? 'FRAMEWORK' : 'ARTICLE');
                }
            }
          } catch (e) {
              // Ignore
          }
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
  }, [view, onBack, posts]);

  const categories = [
    'TODOS',
    'MODELOS MENTAIS',
    'TOMADA DE DECISÃO',
    'APRENDIZADO',
    'AUTOCONHECIMENTO'
  ];

  // Separate posts by type for different sections
  const insights = posts.filter(p => p.type === 'INSIGHT');
  const frameworks = posts.filter(p => p.type === 'FRAMEWORK' || (p.type !== 'INSIGHT' && !p.type)); // Fallback for old data without type

  // Filter for framework section
  const filteredFrameworks = activeCategory === 'TODOS' 
    ? frameworks 
    : frameworks.filter(f => f.category === activeCategory);

  const handleBack = () => {
    try {
        if (view === 'ARTICLE' || view === 'ALL_POSTS' || view === 'FRAMEWORK') {
            setView('HOME'); 
            setActivePost(null);
            window.history.pushState({}, '', '/blog'); 
        } else {
            window.history.pushState({}, '', '/'); 
            onBack();
        }
    } catch (e) {
        if (view === 'ARTICLE' || view === 'ALL_POSTS' || view === 'FRAMEWORK') {
            setView('HOME'); 
            setActivePost(null);
        } else {
            onBack();
        }
    }
  };

  const handleOpenPost = (post: any) => {
      setActivePost(post);
      setView('ARTICLE');
      try {
        // Updated URL structure: /blog/insight/slug
        window.history.pushState({}, '', `/blog/insight/${slugify(post.title)}`);
      } catch (e) {}
  };

  const handleOpenFramework = (fw: any) => {
      setActivePost(fw);
      setView('FRAMEWORK');
      try {
        // Updated URL structure: /blog/framework/slug
        window.history.pushState({}, '', `/blog/framework/${slugify(fw.title)}`);
      } catch (e) {}
  };

  const handleCtaClick = () => {
    try {
        window.history.pushState({}, '', '/'); 
    } catch (e) {}
    onBack();
    setTimeout(() => {
        const element = document.getElementById('impacto-real');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
  };

  const SocialButton = ({ icon: Icon }: { icon: any }) => (
    <button className="w-10 h-10 flex items-center justify-center border border-white/10 bg-[#1A1A1A] rounded-md hover:bg-white hover:text-black hover:border-white transition-all text-neutral-400">
        <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[60] overflow-y-auto bg-black text-white font-sans"
    >
      <div className="w-full flex justify-between items-center px-6 py-5 md:px-8 fixed top-0 left-0 bg-black/95 backdrop-blur-md z-50 border-b border-white/10">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-bold text-white hover:text-neutral-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {view === 'HOME' ? 'Voltar ao Site' : 'Voltar à Biblioteca'}
        </button>
        <WordmarkIcon className="h-5 text-white" />
      </div>

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'HOME' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <header className="text-center mb-24 space-y-6">
                  <span className="text-[#FFA11D] text-xs font-bold tracking-[0.2em] uppercase">
                      Biblioteca de Conteúdo
                  </span>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                      Onde a teoria encontra<br />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFA11D] to-orange-600">
                          a prática executiva.
                      </span>
                  </h1>
                  <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                      Frameworks validados por consultorias de elite, adaptados para aplicação imediata no seu dia a dia.
                  </p>
              </header>

              {/* Insights Section (TOP) - Using insights from context */}
              <section className="mb-32">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Insights Recentes</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                      {insights.slice(0, 3).map((insight, idx) => (
                          <article 
                            key={idx} 
                            onClick={() => handleOpenPost(insight)}
                            className="group cursor-pointer flex flex-col h-full bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
                          >
                              <div className="overflow-hidden bg-neutral-900 h-56 relative">
                                  {insight.image ? (
                                      <img 
                                          src={insight.image} 
                                          alt={insight.title}
                                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                      />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                                          <span className="text-neutral-700">Sem imagem</span>
                                      </div>
                                  )}
                                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                       <span className="text-[10px] font-bold text-[#FFA11D] uppercase tracking-widest">
                                          {insight.tag}
                                       </span>
                                  </div>
                              </div>
                              
                              <div className="p-6 flex flex-col flex-grow">
                                  <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-[#FFA11D] transition-colors">
                                      {insight.title}
                                  </h3>
                                  <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-grow">
                                      {insight.description}
                                  </p>
                                  <div className="pt-4 border-t border-white/5 mt-auto w-full">
                                      <button className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest group-hover:text-[#FFA11D] transition-colors">
                                          Ler Mais <ChevronRight className="w-3 h-3" />
                                      </button>
                                  </div>
                              </div>
                          </article>
                      ))}
                  </div>

                  <div className="flex justify-center">
                      <button 
                        onClick={() => setView('ALL_POSTS')}
                        className="flex items-center gap-2 text-xs font-bold text-[#FFA11D] hover:text-white uppercase tracking-widest transition-colors"
                      >
                          Ver Todos os Posts <ArrowRight className="w-4 h-4" />
                      </button>
                  </div>
              </section>

              {/* Frameworks Section - Using frameworks from context */}
              <section ref={frameworksSectionRef} id="frameworks-section" className="border-t border-white/10 pt-24 scroll-mt-32">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Frameworks Estratégicos</h2>
                  
                  <div className="flex flex-wrap gap-2 mb-12">
                      {categories.map((cat) => (
                          <button
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                  activeCategory === cat
                                      ? 'bg-[#FFA11D] text-black shadow-lg shadow-[#FFA11D]/20'
                                      : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                              }`}
                          >
                              {cat}
                          </button>
                      ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredFrameworks.map((fw, idx) => (
                          <article 
                              key={idx}
                              onClick={() => handleOpenFramework(fw)} 
                              className="bg-[#0A0A0A] border border-white/10 p-8 rounded-xl hover:border-white/20 transition-colors group flex flex-col h-full min-h-[300px] cursor-pointer"
                          >
                              <span className="text-[10px] font-bold text-[#FFA11D] uppercase tracking-widest mb-4 block">
                                  {fw.category}
                              </span>
                              <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-[#FFA11D] transition-colors">
                                  {fw.title}
                              </h3>
                              <p className="text-neutral-400 text-sm leading-relaxed mb-8 flex-grow">
                                  {fw.description}
                              </p>
                              <button className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest mt-auto group-hover:text-[#FFA11D] transition-colors">
                                  Ver Aplicação Prática <ChevronRight className="w-3 h-3" />
                              </button>
                          </article>
                      ))}
                  </div>
              </section>

              {/* CTA Section */}
              <section className="mt-24 mb-12">
                  <div className="relative w-full overflow-hidden rounded-2xl bg-[#080808] border border-white/10 p-12 text-center shadow-2xl">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#FFA11D]/5 blur-3xl pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-col items-center">
                          <div className="mb-6 flex items-center justify-center">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#FFA11D]/30 bg-[#FFA11D]/10 shadow-[0_0_15px_rgba(255,161,29,0.3)]">
                                  <Check className="h-8 w-8 text-[#FFA11D]" strokeWidth={3} />
                              </div>
                          </div>
                          
                          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                              Desbloquear Acesso Completo
                          </h3>
                          
                          <p className="text-neutral-400 text-lg mb-8 max-w-2xl mx-auto font-medium">
                              Acesse frameworks exclusivos, templates editáveis e nossa comunidade de executivos de elite.
                          </p>
                          
                          <button 
                              onClick={handleCtaClick}
                              className="flex items-center gap-2 rounded-lg bg-[#FFA11D] px-8 py-4 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#FFB24D] hover:shadow-lg hover:shadow-[#FFA11D]/20 active:scale-95"
                          >
                              Conhecer o Socceo <ArrowRight className="h-4 w-4" />
                          </button>
                      </div>
                  </div>
              </section>
            </motion.div>
          )}

          {view === 'ALL_POSTS' && (
            <motion.div
              key="all-posts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Todos os Insights</h2>
                <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
                  Explore nosso acervo completo de artigos sobre estratégia, liderança e gestão.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                {insights.map((insight, idx) => (
                  <article 
                    key={idx} 
                    onClick={() => handleOpenPost(insight)}
                    className="group cursor-pointer flex flex-col h-full bg-[#0A0A0A] rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all"
                  >
                    <div className="h-56 w-full overflow-hidden bg-neutral-900 relative">
                        {insight.image ? (
                            <img 
                                src={insight.image} 
                                alt={insight.title}
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                                <span className="text-neutral-700">Sem imagem</span>
                            </div>
                        )}
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                           <span className="text-[10px] font-bold text-[#FFA11D] uppercase tracking-widest">
                              {insight.tag}
                           </span>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-[#FFA11D] transition-colors">
                            {insight.title}
                        </h3>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-grow">
                            {insight.description}
                        </p>
                        <div className="pt-4 border-t border-white/5 mt-auto">
                           <button className="flex items-center gap-2 text-[10px] font-bold text-neutral-300 uppercase tracking-widest group-hover:text-white transition-colors">
                               Ler Artigo Completo <ChevronRight className="w-3 h-3" />
                           </button>
                        </div>
                    </div>
                  </article>
                ))}
              </div>
              
              <div className="mt-16 text-center">
                 <p className="text-neutral-500 text-sm">Você chegou ao fim da lista.</p>
              </div>
            </motion.div>
          )}

          {view === 'ARTICLE' && activePost && (
            <motion.article
              key="article"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
                <header className="mb-8">
                    <span className="text-[#FFA11D] font-bold tracking-widest text-xs uppercase mb-4 block">
                        {activePost.tag}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                        {activePost.title}
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8 mb-8">
                        <div className="flex items-center gap-6 text-neutral-400 text-sm font-medium">
                            {activePost.date && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <time dateTime={activePost.date}>{activePost.date}</time>
                                </div>
                            )}
                            {activePost.readTime && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{activePost.readTime}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-400 mr-2 font-medium">Compartilhar:</span>
                            <SocialButton icon={Linkedin} />
                            <SocialButton icon={Facebook} />
                            <SocialButton icon={Mail} />
                        </div>
                    </div>
                </header>

                {activePost.image && (
                    <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden mb-12 border border-white/5 shadow-2xl relative bg-neutral-900">
                        <img 
                            src={activePost.image} 
                            alt={activePost.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                )}

                <div className="prose prose-invert max-w-none prose-lg text-neutral-300 leading-relaxed">
                    {activePost.content && typeof activePost.content === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: activePost.content }} className="space-y-6 text-lg" />
                    ) : (
                        <p>{activePost.description}</p>
                    )}
                </div>

                <div className="mt-20 w-full rounded-2xl bg-[#0A0A0A] border border-white/10 p-8 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[#FFA11D]/5 opacity-20 pointer-events-none" />
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                            Gostou deste insight? Receba mais na sua caixa de entrada.
                        </h3>
                        
                        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
                            <input 
                                type="email" 
                                placeholder="Seu melhor e-mail" 
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFA11D]/50 transition-colors select-text"
                            />
                            <button className="bg-[#FFA11D] text-black font-bold uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-[#FFB24D] transition-colors shadow-lg shadow-[#FFA11D]/10 active:scale-95">
                                Quero Receber Insights
                            </button>
                        </div>
                    </div>
                </div>
            </motion.article>
          )}

          {view === 'FRAMEWORK' && activePost && (
            <motion.article
              key="framework"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="max-w-5xl mx-auto"
            >
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="px-3 py-1 rounded border border-[#FFA11D]/30 bg-[#FFA11D]/10 text-[#FFA11D] text-[10px] font-bold uppercase tracking-widest">
                            {activePost.category}
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
                        {activePost.title}
                    </h1>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8 mt-8">
                        <div className="text-neutral-500 text-sm font-medium">
                            <time dateTime={activePost.date}>{activePost.date}</time>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-400 mr-2 font-medium">Compartilhar:</span>
                            <SocialButton icon={Linkedin} />
                            <SocialButton icon={Facebook} />
                            <SocialButton icon={Mail} />
                        </div>
                    </div>
                </header>

                {activePost.content && activePost.content.whatIs && (
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-8 bg-[#FFA11D]" />
                            <h2 className="text-2xl font-bold text-white">O que é?</h2>
                        </div>
                        <p className="text-lg md:text-xl text-neutral-300 leading-relaxed font-light">
                            {activePost.content.whatIs}
                        </p>
                    </section>
                )}

                {activePost.content && activePost.content.practicalCase && (
                    <section className="rounded-2xl bg-[#160B00] border border-[#FFA11D]/20 p-8 md:p-12 mb-16 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFA11D]/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 rounded-lg bg-[#FFA11D]/20 text-[#FFA11D]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white">Aplicação Prática</h3>
                            </div>

                            <p className="text-lg text-white font-bold mb-8">
                                {activePost.content.practicalCase.title}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Single-loop:</p>
                                    <ul className="space-y-3">
                                        {activePost.content.practicalCase.singleLoop.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-neutral-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 mt-2 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#FFA11D] uppercase tracking-wider mb-4">Double-loop:</p>
                                    <ul className="space-y-3">
                                        {activePost.content.practicalCase.doubleLoop.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-white">
                                                <Check className="w-4 h-4 text-[#FFA11D] mt-1 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10 space-y-4">
                                <p className="text-white text-lg italic">
                                    "{activePost.content.practicalCase.conclusion}"
                                </p>
                                <p className="text-neutral-400 text-sm whitespace-pre-line">
                                    {activePost.content.practicalCase.realCase}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                <div className="border border-white/10 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-[#080808] mb-16">
                    <h3 className="text-2xl font-bold text-white mb-4">Quer aplicar este framework?</h3>
                    <p className="text-neutral-400 mb-8 max-w-lg">
                        Com o Socceo, você acessa templates editáveis, casos práticos e mentorias para aplicar frameworks como este no seu contexto real.
                    </p>
                    <button 
                        onClick={handleCtaClick}
                        className="bg-[#FFA11D] hover:bg-[#FFB24D] text-black px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors shadow-lg shadow-orange-900/20"
                    >
                        Conhecer o Socceo
                    </button>
                </div>

                {activePost.related && activePost.related.length > 0 && (
                    <section className="pt-8 border-t border-white/10">
                        <h4 className="text-xl font-bold text-white mb-8">Frameworks Relacionados</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {activePost.related.map((item: any, i: number) => (
                                <article key={i} className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl hover:border-white/20 transition-colors group cursor-pointer">
                                    <h5 className="font-bold text-white mb-3 group-hover:text-[#FFA11D] transition-colors">{item.title}</h5>
                                    <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                                        {item.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>
                )}
            </motion.article>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default BibliotecaFrameworks;
