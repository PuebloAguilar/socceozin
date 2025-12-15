
import React, { useState, useEffect } from 'react';
import { useBlog, BlogPost } from '../../context/BlogContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, ArrowLeft, Save, Search, Image as ImageIcon, Loader2, FileText, LayoutTemplate, Download } from 'lucide-react';
import { Button } from '../header/ui/Button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../header/utils';

interface AdminDashboardProps {
  onLogout: () => void;
}

// Categorias segregadas por tipo
const FRAMEWORK_CATEGORIES = [
    'MODELOS MENTAIS',
    'TOMADA DE DECISÃO',
    'APRENDIZADO',
    'AUTOCONHECIMENTO'
];

const INSIGHT_CATEGORIES = [
    'ESTRATÉGIA',
    'GESTÃO',
    'LIDERANÇA',
    'MARKETING',
    'VENDAS',
    'NEGOCIAÇÃO',
    'CARREIRA',
    'INOVAÇÃO',
    'FINANÇAS',
    'EMPREENDEDORISMO'
];

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { posts, addPost, updatePost, deletePost, loading } = useBlog();
  const [view, setView] = useState<'LIST' | 'EDIT'>('LIST');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado para o filtro de tipo (Abas)
  const [filterType, setFilterType] = useState<'ALL' | 'INSIGHT' | 'FRAMEWORK'>('ALL');

  // Form State
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    description: '',
    category: 'ESTRATÉGIA', // Default específico
    tag: 'ESTRATÉGIA',
    content: '',
    image: '',
    readTime: '5 min',
    type: 'INSIGHT'
  });

  // Determina quais categorias exibir no select baseado no tipo selecionado
  const currentCategories = formData.type === 'FRAMEWORK' ? FRAMEWORK_CATEGORIES : INSIGHT_CATEGORIES;

  const handleEditClick = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
    setView('EDIT');
  };

  const handleCreateClick = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      description: '',
      category: 'ESTRATÉGIA',
      tag: 'ESTRATÉGIA',
      content: '',
      image: '',
      readTime: '5 min',
      type: 'INSIGHT',
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    });
    setView('EDIT');
  };

  const handleDeleteClick = async (id: string | number) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      await deletePost(id);
    }
  };

  const handleTypeChange = (newType: 'INSIGHT' | 'FRAMEWORK') => {
      // Ao mudar o tipo, reseta a categoria para a primeira válida daquele tipo
      const defaultCategory = newType === 'FRAMEWORK' ? FRAMEWORK_CATEGORIES[0] : INSIGHT_CATEGORIES[0];
      setFormData({
          ...formData,
          type: newType,
          category: defaultCategory
      });
  };

  const handleManualSave = () => {
      // Força o salvamento no LocalStorage para garantir persistência ao recarregar
      localStorage.setItem('socceo_blog_posts', JSON.stringify(posts));
      
      // Gera o JSON no console para o desenvolvedor copiar se quiser atualizar o código estático
      console.log("JSON ATUALIZADO PARA O CÓDIGO:", JSON.stringify(posts, null, 2));
      
      alert("Alterações salvas com sucesso! Seus posts permanecerão salvos mesmo se você recarregar a página.");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
        // A Tag é automaticamente definida pela Categoria para manter consistência
        const finalCategory = formData.category || (formData.type === 'FRAMEWORK' ? 'MODELOS MENTAIS' : 'ESTRATÉGIA');
        
        const postToSave = {
            ...formData,
            category: finalCategory,
            tag: finalCategory, // Sincronização forçada
            date: formData.date || new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
        } as BlogPost;

        if (editingPost) {
            await updatePost(editingPost.id, postToSave);
        } else {
            // @ts-ignore - remove id for new post
            const { id, ...newPostData } = postToSave;
            await addPost(newPostData);
        }
        setView('LIST');
    } catch (e) {
        alert("Erro ao salvar.");
    } finally {
        setIsSaving(false);
    }
  };

  // Lógica de filtro atualizada para incluir busca E tipo
  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || p.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded border border-green-500/30">MÓDULO LOCAL</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
            <p className="text-neutral-400">Gerencie os insights e frameworks do Socceo.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" onClick={() => window.open('https://www.socceo.com.br/blog', '_blank')}>Ver Site</Button>
             <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={onLogout}>Sair</Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'LIST' ? (
            <motion.div 
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6 border-b border-white/10 pb-1">
                  <button 
                    onClick={() => setFilterType('ALL')}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        filterType === 'ALL' 
                            ? "border-[#FFA11D] text-[#FFA11D]" 
                            : "border-transparent text-neutral-400 hover:text-white"
                    )}
                  >
                      Todos
                  </button>
                  <button 
                    onClick={() => setFilterType('INSIGHT')}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                        filterType === 'INSIGHT' 
                            ? "border-[#FFA11D] text-[#FFA11D]" 
                            : "border-transparent text-neutral-400 hover:text-white"
                    )}
                  >
                      <FileText className="w-4 h-4" /> Insights
                  </button>
                  <button 
                    onClick={() => setFilterType('FRAMEWORK')}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                        filterType === 'FRAMEWORK' 
                            ? "border-[#FFA11D] text-[#FFA11D]" 
                            : "border-transparent text-neutral-400 hover:text-white"
                    )}
                  >
                      <LayoutTemplate className="w-4 h-4" /> Frameworks
                  </button>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                    <Input 
                        placeholder="Buscar posts..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={handleManualSave} variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                        <Save className="w-4 h-4 mr-2" /> Salvar Tudo
                    </Button>
                    <Button onClick={handleCreateClick} className="bg-[#FFA11D] hover:bg-[#FFB24D] text-black border-none font-bold">
                        <Plus className="w-4 h-4 mr-2" /> Novo Post
                    </Button>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                  <div className="flex justify-center py-20">
                      <Loader2 className="w-8 h-8 text-[#FFA11D] animate-spin" />
                  </div>
              ) : (
                /* Table / Grid */
                <div className="grid gap-4">
                    {filteredPosts.map((post) => (
                        <div key={post.id} className="bg-neutral-900/50 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-center gap-6 hover:border-white/20 transition-colors">
                            <div className="w-full md:w-24 h-24 md:h-16 bg-neutral-800 rounded-lg overflow-hidden shrink-0">
                                {post.image ? (
                                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-600"><ImageIcon className="w-6 h-6" /></div>
                                )}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="font-bold text-lg text-white mb-1">{post.title}</h3>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-neutral-400">
                                    <span className={`px-2 py-1 rounded border border-white/5 flex items-center gap-1 ${post.type === 'FRAMEWORK' ? 'text-[#FFA11D] bg-[#FFA11D]/10 border-[#FFA11D]/20' : 'bg-white/5'}`}>
                                        {post.type === 'FRAMEWORK' ? <LayoutTemplate className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                        {post.type || 'INSIGHT'}
                                    </span>
                                    <span className="bg-white/5 px-2 py-1 rounded border border-white/5">{post.category}</span>
                                    <span>{post.date}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="icon" variant="outline" onClick={() => handleEditClick(post)}>
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="outline" className="hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30" onClick={() => handleDeleteClick(post.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {filteredPosts.length === 0 && (
                        <div className="text-center py-20 text-neutral-500">
                            Nenhum post encontrado nesta categoria.
                        </div>
                    )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
                key="edit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="max-w-4xl mx-auto"
            >
                <button onClick={() => setView('LIST')} className="flex items-center text-neutral-400 hover:text-white mb-6 text-sm">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                </button>

                <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6">{editingPost ? 'Editar Post' : 'Criar Novo Post'}</h2>
                    
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Título</Label>
                                <Input 
                                    value={formData.title} 
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="Ex: O fim da vantagem competitiva"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo de Conteúdo</Label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-white/20 bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
                                    value={formData.type}
                                    onChange={(e) => handleTypeChange(e.target.value as 'INSIGHT' | 'FRAMEWORK')}
                                >
                                    <option value="INSIGHT">Insight (Artigo)</option>
                                    <option value="FRAMEWORK">Framework (Metodologia)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Categoria {formData.type === 'FRAMEWORK' ? '(Frameworks)' : '(Insights)'}</Label>
                            <p className="text-xs text-neutral-500 mb-2">
                                Define onde o post aparecerá e a tag exibida no card.
                            </p>
                            <select 
                                className="flex h-10 w-full rounded-md border border-white/20 bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                {currentCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Descrição Curta (Resumo)</Label>
                            <Input 
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Aparece no card da home..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Tempo de Leitura</Label>
                                <Input 
                                    value={formData.readTime} 
                                    onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                                    placeholder="Ex: 5 min"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Data</Label>
                                <Input 
                                    value={formData.date} 
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    placeholder="DD de Mês de AAAA"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>URL da Imagem</Label>
                            <Input 
                                value={formData.image} 
                                onChange={(e) => setFormData({...formData, image: e.target.value})}
                                placeholder="https://..."
                            />
                            {formData.image && (
                                <div className="mt-2 w-full h-40 rounded-lg overflow-hidden border border-white/10 bg-black/50">
                                    <img src={formData.image} className="w-full h-full object-cover opacity-70" alt="Preview" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Conteúdo (HTML)</Label>
                            <p className="text-xs text-neutral-500 mb-2">Para artigos normais, use tags &lt;p&gt;, &lt;h3&gt;, etc. Para Frameworks, insira o JSON da estrutura.</p>
                            <textarea 
                                className="flex min-h-[300px] w-full rounded-md border border-white/20 bg-black px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                value={typeof formData.content === 'string' ? formData.content : JSON.stringify(formData.content, null, 2)}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                placeholder="<p>Escreva seu conteúdo aqui...</p>"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <Button type="button" variant="outline" onClick={() => setView('LIST')} disabled={isSaving}>Cancelar</Button>
                            <Button 
                                type="submit" 
                                className="bg-[#FFA11D] hover:bg-[#FFB24D] text-black border-none font-bold min-w-[140px] shadow-lg shadow-[#FFA11D]/20 transition-all hover:scale-105 active:scale-95" 
                                disabled={isSaving}
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Salvar Post</>}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
