"use client";

import { motion, AnimatePresence } from "motion/react";
import { Header } from "@/components/layout/header";
import { Palette, CreditCard, ArrowUpRight, PackagePlus, ShieldCheck, MessageSquare, ChevronRight, Clock, Eye, Smartphone, Monitor, Code2, ChevronLeft, Link as LinkIcon, Copy, CheckCircle2, X, Image as ImageIcon, Type, AlignLeft, DollarSign, GripVertical, HelpCircle, Star, LayoutTemplate, Trash2, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore, CheckoutSection } from "@/store/checkout-store";
import { useMode } from "@/lib/mode-context";
import { useAuth } from "@/contexts/auth-context";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';

import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { CheckoutExperience } from "@/components/checkout/checkout-experience";
import { CheckoutProvider } from "@/contexts/checkout-context";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

function SortableSectionItem({ section, onToggle, onClick, onRemove }: { section: CheckoutSection, onToggle: (id: string) => void, onClick: (id: string) => void, onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const getSectionDetails = (type: string) => {
    switch (type) {
      case 'header': return { title: 'Cabeçalho', icon: LayoutTemplate, color: 'text-pink-500', bg: 'bg-pink-500/10', desc: 'Logo e título' };
      case 'product': return { title: 'Produto', icon: PackagePlus, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'Imagem, título e preço' };
      case 'benefits': return { title: 'Benefícios', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', desc: 'Lista de vantagens' };
      case 'testimonials': return { title: 'Depoimentos', icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-500/10', desc: 'Prova social' };
      case 'guarantee': return { title: 'Garantia', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10', desc: 'Selo de segurança' };
      case 'timer': return { title: 'Timer Escassez', icon: Clock, color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Gatilho de urgência' };
      case 'payment': return { title: 'Pagamento', icon: CreditCard, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/10', desc: 'Formulário e métodos' };
      case 'faq': return { title: 'FAQ', icon: HelpCircle, color: 'text-purple-500', bg: 'bg-purple-500/10', desc: 'Perguntas frequentes' };
      case 'bonus': return { title: 'Bônus', icon: PackagePlus, color: 'text-yellow-500', bg: 'bg-yellow-500/10', desc: 'Ofertas extras' };
      case 'urgency': return { title: 'Urgência', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Contador de vagas' };
      case 'social_proof': return { title: 'Prova Social', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10', desc: 'Avaliações e notas' };
      default: return { title: type, icon: LayoutTemplate, color: 'text-zinc-500', bg: 'bg-zinc-500/10', desc: '' };
    }
  };

  const details = getSectionDetails(section.type);
  const Icon = details.icon;

  return (
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-white/5 backdrop-blur-xl p-4 rounded-[28px] border ${isDragging ? 'border-[var(--primary)] shadow-[0_0_30px_var(--primary)]' : 'border-white/10'} flex items-center justify-between group transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20`}
      >
        <div className="flex items-center gap-4">
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <GripVertical size={20} strokeWidth={1.5} />
          </div>
          <div 
            className="flex items-center gap-4 cursor-pointer flex-1"
            onClick={() => onClick(section.id)}
          >
            <div className={`p-4 rounded-xl ${details.bg} border border-white/10 shadow-inner`}>
              <Icon size={24} className={details.color} strokeWidth={1.5} />
            </div>
            <div>
              <span className="font-bold text-white text-lg block group-hover:text-[var(--primary)] transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{details.title}</span>
              <span className="text-zinc-400 text-xs font-medium">{details.desc}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(section.id);
            }}
            className="p-2 text-zinc-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(section.id);
            }}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${
              section.enabled ? "bg-gradient-to-r from-[var(--primary)] to-[var(--gradient-to)] shadow-[0_0_15px_var(--primary)]" : "bg-zinc-800 border border-white/10 shadow-inner"
            }`}
          >
            <motion.div
              layout
              className={`w-6 h-6 bg-white rounded-full shadow-md ${
                section.enabled ? "ml-6" : "ml-0"
              }`}
            />
          </button>
        </div>
      </div>
  );
}

export default function CheckoutBuilder() {
  const router = useRouter();
  const { mode, primaryColor, gradientFrom, gradientTo } = useMode();
  const { user, loading: authLoading } = useAuth();
  const { checkoutConfig: config, updateConfig } = useCheckoutStore();
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (mode === 'aluno') {
      router.push('/');
    }
  }, [mode, router]);

  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const isModalActive = (type: string) => {
    if (!activeModal) return false;
    if (activeModal === type) return true;
    return activeModal.startsWith(`${type}_`);
  };

  const getModalTitle = () => {
    if (!activeModal) return '';
    if (activeModal === 'design') return 'Design Global';
    if (activeModal === 'layout') return 'Layout';
    if (activeModal === 'marketing') return 'Marketing';
    if (activeModal === 'conversion') return 'Conversão';
    if (activeModal === 'gamification') return 'Gamificação';
    if (activeModal === 'payment_advanced') return 'Pagamento Avançado';
    if (activeModal === 'advanced') return 'Avançado';
    if (activeModal === 'add_section') return 'Adicionar Seção';
    
    if (activeModal.startsWith('header')) return 'Header';
    if (activeModal.startsWith('product')) return 'Produto';
    if (activeModal.startsWith('benefits')) return 'Benefícios';
    if (activeModal.startsWith('testimonials')) return 'Depoimentos';
    if (activeModal.startsWith('guarantee')) return 'Garantia';
    if (activeModal.startsWith('timer')) return 'Timer Escassez';
    if (activeModal.startsWith('payment')) return 'Pagamento';
    if (activeModal.startsWith('faq')) return 'FAQ';
    if (activeModal.startsWith('bonus')) return 'Bônus';
    if (activeModal.startsWith('urgency')) return 'Urgência';
    if (activeModal.startsWith('social_proof')) return 'Prova Social';
    
    return '';
  };

  const menuItems = [
    { id: 'design', label: 'Design', icon: Palette, desc: 'Cores, fundos e efeitos' },
    { id: 'layout', label: 'Layout', icon: LayoutTemplate, desc: 'Estrutura e visualização' },
    { id: 'marketing', label: 'Marketing', icon: Type, desc: 'Headlines e banners' },
    { id: 'conversion', label: 'Conversão', icon: Zap, desc: 'Gatilhos e notificações' },
    { id: 'gamification', label: 'Gamificação', icon: Star, desc: 'Progresso e animações' },
    { id: 'payment_advanced', label: 'Pagamento', icon: CreditCard, desc: 'Pix, cartões e cupons' },
    { id: 'advanced', label: 'Avançado', icon: ShieldCheck, desc: 'Logo, FAQ e garantia' },
  ];

  const handleToggle = (key: string) => {
    const configKey = key as keyof typeof config;
    if (typeof config[configKey] === 'boolean') {
      updateConfig({ [configKey]: !config[configKey] });
    } else if (configKey === 'guarantee') {
      updateConfig({ guarantee: config.guarantee > 0 ? 0 : 7 });
    } else if (configKey === 'timer') {
      updateConfig({ timer: config.timer > 0 ? 0 : 15 });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = config.sections.findIndex((s) => s.id === active.id);
      const newIndex = config.sections.findIndex((s) => s.id === over.id);

      updateConfig({
        sections: arrayMove(config.sections, oldIndex, newIndex),
      });
    }
  };

  const handleSectionToggle = (id: string) => {
    updateConfig({
      sections: config.sections.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      ),
    });
  };

  const handleGenerate = async () => {
    if (!user) return;
    const mockId = Math.random().toString(36).substring(2, 8);
    
    try {
      await setDoc(doc(db, 'checkouts', mockId), {
        userId: user.uid,
        config: config
      });
      setGeneratedLink(`${window.location.origin}/c/${mockId}`);
    } catch (e: any) {
      console.error("Failed to save checkout to Firestore", e);
      alert(`Erro ao salvar checkout: ${e?.message || 'Erro de conexão'}`);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">Carregando...</div>;
  if (!user) return null;

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div 
      className="min-h-screen bg-[#0B0B0F] pb-32 relative flex flex-col lg:flex-row"
      style={{ 
        '--primary': primaryColor, 
        '--gradient-from': gradientFrom, 
        '--gradient-to': gradientTo 
      } as React.CSSProperties}
    >
      <Header />
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-[var(--primary)]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* Left Column: Builder */}
      <div className="w-full lg:w-[450px] shrink-0 border-r border-white/10 bg-[#0B0B0F]/50 backdrop-blur-3xl z-10 lg:h-screen lg:overflow-y-auto no-scrollbar shadow-[8px_0_32px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="p-6 pt-12 flex justify-between items-center sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-2xl z-40 border-b border-white/10 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.02em] tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Checkout Builder</h1>
            <p className="text-zinc-400 text-sm mt-1 font-medium">Configure a experiência.</p>
          </div>
          
          <div className="flex lg:hidden bg-white/5 backdrop-blur-xl p-1 rounded-xl border border-white/10 shadow-inner">
            <button 
              onClick={() => router.push("/checkout/preview")}
              className={`p-2.5 rounded-xl transition-all duration-300 text-zinc-500 hover:text-white`}
            >
              <Eye size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xs font-bold tracking-[-0.02em] text-zinc-500 uppercase tracking-widest ml-1">Personalização Completa</h2>
            <div className="grid grid-cols-1 gap-2">
              {menuItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveModal(item.id)}
                  className="w-full p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/10 hover:border-[var(--primary)]/50 transition-all group shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] border border-[var(--primary)]/20 shadow-inner">
                      <item.icon size={20} strokeWidth={1.5} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white text-sm group-hover:text-[var(--primary)] transition-colors">{item.label}</h3>
                      <p className="text-[10px] text-zinc-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-bold tracking-[-0.02em] text-zinc-500 uppercase tracking-widest ml-1">Estrutura de Seções</h2>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={config.sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {config.sections.map((section) => (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    onToggle={handleSectionToggle}
                    onClick={setActiveModal}
                    onRemove={(id) => {
                      updateConfig({
                        sections: config.sections.filter(s => s.id !== id)
                      });
                    }}
                  />
                ))}
              </SortableContext>
            </DndContext>
            
            <button 
              onClick={() => setActiveModal('add_section')}
              className="w-full mt-4 p-4 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-zinc-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all font-bold backdrop-blur-xl"
            >
              <PackagePlus size={20} strokeWidth={1.5} />
              Adicionar Seção
            </button>
            </motion.div>
          </div>

          {/* Generated Link Section */}
          <AnimatePresence>
            {generatedLink && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-emerald-500/10 backdrop-blur-xl p-6 rounded-[32px] border border-emerald-500/30 shadow-[0_10px_40px_rgba(16,185,129,0.2)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-inner">
                    <CheckCircle2 size={20} className="text-emerald-500" strokeWidth={2} />
                  </div>
                  <h3 className="font-bold tracking-[-0.02em] text-white text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Checkout Gerado!</h3>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-sm text-zinc-300 truncate font-mono shadow-inner">
                    {generatedLink}
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={`flex items-center justify-center w-14 h-14 rounded-xl transition-all ${copied ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-gradient-to-tr from-[var(--primary)] to-[var(--gradient-to)] shadow-[0_10px_20px_var(--primary)] animate-gradient'}`}
                    style={{ backgroundSize: '200% 200%' }}
                  >
                    {copied ? <CheckCircle2 size={24} className="text-white" strokeWidth={1.5} /> : <Copy size={24} className="text-white" strokeWidth={1.5} />}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] text-white font-bold tracking-[-0.02em] text-xl py-6 rounded-[32px] shadow-[0_20px_40px_var(--primary)] transition-all flex items-center justify-center gap-3 animate-gradient"
            style={{ backgroundSize: '200% 200%' }}
          >
            <LinkIcon size={24} strokeWidth={1.5} />
            Gerar Checkout
          </motion.button>
        </div>
      </div>

      {/* Right Column: Preview (Desktop Only) */}
      <div className="hidden lg:flex flex-1 flex-col h-screen overflow-hidden bg-[#050507] relative">
        <div className="absolute top-6 right-6 z-50 flex bg-black/40 backdrop-blur-2xl p-1.5 rounded-2xl border border-white/10 shadow-inner">
          <button 
            onClick={() => setPreviewMode('mobile')}
            className={`p-3 rounded-xl transition-all duration-300 ${previewMode === 'mobile' ? 'bg-[var(--primary)] text-white shadow-[0_4px_15px_var(--primary)]' : 'text-zinc-500 hover:text-white'}`}
          >
            <Smartphone size={18} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => setPreviewMode('desktop')}
            className={`p-3 rounded-xl transition-all duration-300 ${previewMode === 'desktop' ? 'bg-[var(--primary)] text-white shadow-[0_4px_15px_var(--primary)]' : 'text-zinc-500 hover:text-white'}`}
          >
            <Monitor size={18} strokeWidth={1.5} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar flex justify-center p-8">
          <div className={`transition-all duration-500 w-full ${previewMode === 'mobile' ? 'max-w-[400px] border-[8px] border-zinc-900 rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-[850px]' : 'max-w-6xl rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden'}`}>
            <div className="h-full overflow-y-auto no-scrollbar bg-[#0B0B0F]">
              <CheckoutProvider initialConfig={config}>
                <CheckoutExperience />
              </CheckoutProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 lg:right-auto lg:w-[450px] z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 lg:p-0 lg:items-stretch"
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#111118] border border-white/10 rounded-t-[40px] lg:rounded-none lg:border-l-0 lg:border-t-0 p-8 shadow-2xl pb-12 lg:h-full lg:w-full lg:max-w-none lg:flex lg:flex-col"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8 lg:hidden" />
              
              <div className="flex justify-between items-center mb-8 lg:mt-8">
                <h3 className="text-2xl font-bold tracking-[-0.02em] text-white">
                  {getModalTitle()}
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-white/5 rounded-full text-zinc-400 hover:bg-white/10 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar pb-12 relative overflow-x-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModal}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-6"
                  >
                    {activeModal === 'design' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Estilo do Checkout</label>
                      <select
                        value={config.theme}
                        onChange={(e) => updateConfig({ theme: e.target.value as any })}
                        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all appearance-none"
                      >
                        <option value="standard" className="bg-zinc-900">Padrão (Standard)</option>
                        <option value="stories" className="bg-zinc-900">Stories (Instagram Style)</option>
                        <option value="chat" className="bg-zinc-900">Chat (Conversacional)</option>
                        <option value="reels" className="bg-zinc-900">Reels (Vídeo Vertical)</option>
                        <option value="gamified" className="bg-zinc-900">Gamificado (XP e Recompensas)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Cor Primária (Destaque)</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={config.primaryColor}
                          onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                          className="w-14 h-14 rounded-2xl cursor-pointer bg-transparent border-none"
                        />
                        <input 
                          type="text" 
                          value={config.primaryColor}
                          onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                          className="flex-1 p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Cor do Fundo</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={config.backgroundColor}
                          onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                          className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none"
                        />
                        <input 
                          type="text" 
                          value={config.backgroundColor}
                          onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                          className="flex-1 p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Cor do Texto</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={config.textColor}
                          onChange={(e) => updateConfig({ textColor: e.target.value })}
                          className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none"
                        />
                        <input 
                          type="text" 
                          value={config.textColor}
                          onChange={(e) => updateConfig({ textColor: e.target.value })}
                          className="flex-1 p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Cor da Borda</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={config.borderColor}
                          onChange={(e) => updateConfig({ borderColor: e.target.value })}
                          className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none"
                        />
                        <input 
                          type="text" 
                          value={config.borderColor}
                          onChange={(e) => updateConfig({ borderColor: e.target.value })}
                          className="flex-1 p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold tracking-[-0.02em] text-zinc-500 uppercase tracking-widest mb-3">Imagem de Fundo</label>
                      <label className="border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer relative overflow-hidden group">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              updateConfig({ backgroundImage: url });
                            }
                          }}
                        />
                        {config.backgroundImage ? (
                          <img src={config.backgroundImage} alt="Fundo" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                        ) : (
                          <>
                            <ImageIcon size={32} className="text-zinc-500 mb-2" />
                            <span className="text-xs font-bold text-zinc-400">Upload Background</span>
                          </>
                        )}
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-[-0.02em] text-zinc-500 uppercase tracking-widest">Blur Fundo</label>
                        <input 
                          type="range" min="0" max="20" step="1"
                          value={config.backgroundOptions.blur}
                          onChange={(e) => updateConfig({ backgroundOptions: { ...config.backgroundOptions, blur: parseInt(e.target.value) } })}
                          className="w-full accent-[var(--primary)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-[-0.02em] text-zinc-500 uppercase tracking-widest">Overlay Escuro</label>
                        <input 
                          type="range" min="0" max="1" step="0.1"
                          value={config.backgroundOptions.overlay}
                          onChange={(e) => updateConfig({ backgroundOptions: { ...config.backgroundOptions, overlay: parseFloat(e.target.value) } })}
                          className="w-full accent-[var(--primary)]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[-0.02em] text-zinc-500 uppercase tracking-widest">Gradiente Personalizado</label>
                      <input 
                        type="text" 
                        value={config.backgroundGradient}
                        placeholder="linear-gradient(180deg, #000, #111)"
                        onChange={(e) => updateConfig({ backgroundGradient: e.target.value })}
                        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[-0.02em] text-zinc-500 uppercase tracking-widest">Vídeo de Fundo (MP4 URL)</label>
                      <input 
                        type="text" 
                        value={config.backgroundVideo}
                        placeholder="https://exemplo.com/video.mp4"
                        onChange={(e) => updateConfig({ backgroundVideo: e.target.value })}
                        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <h4 className="font-bold text-white text-sm">Parallax Background</h4>
                        <p className="text-[10px] text-zinc-500">Efeito de profundidade ao rolar</p>
                      </div>
                      <button 
                        onClick={() => updateConfig({ backgroundParallax: !config.backgroundParallax })}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${config.backgroundParallax ? 'bg-[var(--primary)]' : 'bg-zinc-800'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.backgroundParallax ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                )}

                {activeModal === 'layout' && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold tracking-[-0.02em] text-zinc-500 uppercase tracking-widest">Tipo de Layout</label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: 'centered', label: 'Centralizado', icon: AlignLeft },
                        { id: 'fullscreen', label: 'Fullscreen', icon: Monitor },
                        { id: 'minimalist', label: 'Minimalista', icon: Type },
                        { id: 'apple', label: 'Apple Style', icon: Smartphone },
                        { id: 'landing', label: 'Landing Page Longa', icon: LayoutTemplate },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => updateConfig({ layoutType: item.id as any })}
                          className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${config.layoutType === item.id ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-white' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                        >
                          <item.icon size={20} />
                          <span className="font-bold">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeModal === 'marketing' && (
                  <div className="space-y-6 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Headline Dinâmica</label>
                      <input 
                        type="text" 
                        value={config.headline}
                        onChange={(e) => updateConfig({ headline: e.target.value })}
                        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Subheadline Editável</label>
                      <input 
                        type="text" 
                        value={config.subheadline}
                        onChange={(e) => updateConfig({ subheadline: e.target.value })}
                        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Texto CTA Personalizado</label>
                      <input 
                        type="text" 
                        value={config.ctaText}
                        onChange={(e) => updateConfig({ ctaText: e.target.value })}
                        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                      />
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">Banner Promocional</h4>
                        <button 
                          onClick={() => updateConfig({ promoBanner: { ...config.promoBanner, enabled: !config.promoBanner.enabled } })}
                          className={`w-12 h-6 rounded-full p-1 transition-colors ${config.promoBanner.enabled ? 'bg-[var(--primary)]' : 'bg-zinc-800'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.promoBanner.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      {config.promoBanner.enabled && (
                        <input 
                          type="text" 
                          value={config.promoBanner.text}
                          onChange={(e) => updateConfig({ promoBanner: { ...config.promoBanner, text: e.target.value } })}
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)] text-sm"
                        />
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold tracking-[-0.02em] text-zinc-500 uppercase tracking-widest">Lista de Benefícios</label>
                      <div className="space-y-2">
                        {config.benefitsList.map((benefit, index) => (
                          <div key={index} className="flex gap-2">
                            <input 
                              type="text" 
                              value={benefit.text}
                              onChange={(e) => {
                                const newList = [...config.benefitsList];
                                newList[index].text = e.target.value;
                                updateConfig({ benefitsList: newList });
                              }}
                              className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)] text-sm"
                            />
                            <button 
                              onClick={() => {
                                const newList = config.benefitsList.filter((_, i) => i !== index);
                                updateConfig({ benefitsList: newList });
                              }}
                              className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => updateConfig({ benefitsList: [...config.benefitsList, { icon: 'check', text: 'Novo benefício' }] })}
                          className="w-full p-3 bg-[var(--primary)]/10 text-[var(--primary)] border border-dashed border-[var(--primary)]/30 rounded-xl font-bold text-xs hover:bg-[var(--primary)]/20 transition-all"
                        >
                          + Adicionar Benefício
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'conversion' && (
                  <div className="space-y-6 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Tamanho do Timer</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['normal', 'large', 'giant'].map((size) => (
                          <button
                            key={size}
                            onClick={() => updateConfig({ timerSize: size as any })}
                            className={`p-4 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all ${config.timerSize === size ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'bg-black/40 border-white/10 text-zinc-500'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[-0.02em] text-zinc-500 uppercase tracking-widest">Contador de Vagas Restantes</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="number" 
                          value={config.spotsCounter}
                          onChange={(e) => updateConfig({ spotsCounter: parseInt(e.target.value) })}
                          className="w-24 p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)]"
                        />
                        <p className="text-[10px] text-zinc-500">Defina 0 para ocultar o contador</p>
                      </div>
                    </div>

                    {[
                      { id: 'liveSocialProof', label: 'Prova Social ao Vivo', desc: 'Exibe contador de visualizações' },
                      { id: 'purchaseNotifications', label: 'Notificação de Compras', desc: 'Popups de vendas recentes' },
                      { id: 'bestSellerBadge', label: 'Badge "Mais Vendido"', desc: 'Selo de autoridade no produto' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div>
                          <h4 className="font-bold text-white text-sm">{item.label}</h4>
                          <p className="text-[10px] text-zinc-500">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => updateConfig({ [item.id]: !config[item.id as keyof typeof config] })}
                          className={`w-12 h-6 rounded-full p-1 transition-colors ${config[item.id as keyof typeof config] ? 'bg-[var(--primary)]' : 'bg-zinc-800'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config[item.id as keyof typeof config] ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeModal === 'gamification' && (
                  <div className="space-y-6 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    {[
                      { id: 'progressBar', label: 'Barra de Progresso', desc: 'Indica etapas da compra' },
                      { id: 'confettiOnBuy', label: 'Confete ao Comprar', desc: 'Celebração visual no sucesso' },
                      { id: 'pulsingButton', label: 'Botão Pulsando', desc: 'Animação de atenção no CTA' },
                      { id: 'animatedCountdown', label: 'Contador Animado', desc: 'Números que mudam com efeito' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/10">
                        <div>
                          <h4 className="font-bold text-white text-sm">{item.label}</h4>
                          <p className="text-[10px] text-zinc-400">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => updateConfig({ [item.id]: !config[item.id as keyof typeof config] })}
                          className={`w-12 h-6 rounded-full p-1 transition-colors ${config[item.id as keyof typeof config] ? 'bg-[var(--primary)]' : 'bg-zinc-800'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config[item.id as keyof typeof config] ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeModal === 'payment_advanced' && (
                  <div className="space-y-6 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/10">
                      <div>
                        <h4 className="font-bold text-white text-sm">Pix com QR Code Grande</h4>
                        <p className="text-[10px] text-zinc-400">Destaque para pagamento instantâneo</p>
                      </div>
                      <button 
                        onClick={() => updateConfig({ pixQrCode: !config.pixQrCode })}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${config.pixQrCode ? 'bg-[var(--primary)]' : 'bg-zinc-800'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.pixQrCode ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Parcelamento Máximo (Cartão)</label>
                      <select 
                        value={config.cardInstallments}
                        onChange={(e) => updateConfig({ cardInstallments: parseInt(e.target.value) })}
                        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all appearance-none"
                      >
                        {[1, 2, 3, 6, 10, 12].map(n => <option key={n} value={n} className="bg-zinc-900">{n}x sem juros</option>)}
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/10">
                      <div>
                        <h4 className="font-bold text-white text-sm">Boleto com Copiar Código</h4>
                        <p className="text-[10px] text-zinc-400">Facilita o pagamento do boleto</p>
                      </div>
                      <button 
                        onClick={() => updateConfig({ boletoCopy: !config.boletoCopy })}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${config.boletoCopy ? 'bg-[var(--primary)]' : 'bg-zinc-800'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.boletoCopy ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Cupom de Desconto Padrão</label>
                      <input 
                        type="text" 
                        value={config.couponCode}
                        placeholder="EX: BLACKFRIDAY50"
                        onChange={(e) => updateConfig({ couponCode: e.target.value.toUpperCase() })}
                        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                      />
                    </div>
                  </div>
                )}

                {activeModal === 'advanced' && (
                  <div className="space-y-6 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Logo da Marca</label>
                      <label className="border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center bg-black/40 hover:bg-black/60 transition-colors cursor-pointer relative overflow-hidden group">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) updateConfig({ logo: URL.createObjectURL(file) });
                        }} />
                        {config.logo && config.logo !== "https://cartfy.app/logo.png" ? (
                          <img src={config.logo} alt="Logo" className="absolute inset-0 w-full h-full object-contain p-4 group-hover:opacity-50" />
                        ) : (
                          <>
                            <ImageIcon size={32} className="text-zinc-500 mb-2" />
                            <span className="text-xs font-bold text-zinc-400">Upload Logo</span>
                          </>
                        )}
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/10">
                      <div>
                        <h4 className="font-bold text-white text-sm">Garantia Animada</h4>
                        <p className="text-[10px] text-zinc-400">Efeito visual no selo de garantia</p>
                      </div>
                      <button 
                        onClick={() => updateConfig({ animatedGuarantee: !config.animatedGuarantee })}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${config.animatedGuarantee ? 'bg-[var(--primary)]' : 'bg-zinc-800'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.animatedGuarantee ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                )}

                {activeModal === 'product' && (
                  <div className="space-y-6 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Imagem do Produto</label>
                      <label className="border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center bg-black/40 hover:bg-black/60 transition-colors cursor-pointer relative overflow-hidden group">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              updateConfig({ productImage: url });
                            }
                          }}
                        />
                        {config.productImage ? (
                          <img src={config.productImage} alt="Produto" className="absolute inset-0 w-full h-full object-cover p-4 group-hover:opacity-50 transition-opacity" />
                        ) : (
                          <>
                            <ImageIcon size={40} className="text-zinc-500 mb-3" />
                            <span className="text-xs font-bold text-zinc-400">Upload Imagem Produto</span>
                          </>
                        )}
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Título do Produto</label>
                      <input 
                        type="text" 
                        value={config.title}
                        onChange={(e) => updateConfig({ title: e.target.value })}
                        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Subtítulo</label>
                      <input 
                        type="text" 
                        value={config.subtitle}
                        onChange={(e) => updateConfig({ subtitle: e.target.value })}
                        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">URL do Vídeo (YouTube/Vimeo)</label>
                      <input 
                        type="text" 
                        value={config.videoUrl}
                        onChange={(e) => updateConfig({ videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Preço (R$)</label>
                      <input 
                        type="number" 
                        value={Number.isNaN(config.price) ? "" : config.price}
                        onChange={(e) => updateConfig({ price: parseFloat(e.target.value) || 0 })}
                        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Descrição</label>
                      <textarea 
                        value={config.description}
                        onChange={(e) => updateConfig({ description: e.target.value })}
                        className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all min-h-[120px]"
                      />
                    </div>
                  </div>
                )}

                {isModalActive('payment') && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Texto do Botão</label>
                      <input 
                        type="text" 
                        value={config.buttonText}
                        onChange={(e) => updateConfig({ buttonText: e.target.value })}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider">Cor do Botão</label>
                      <div className="flex gap-4">
                        {['var(--primary)', '#10B981', '#3B82F6', '#EC4899', '#000000'].map(color => (
                          <button 
                            key={color}
                            onClick={() => updateConfig({ buttonColor: color, buttonGradient: '' })}
                            className={`w-12 h-12 rounded-xl border-4 transition-all ${config.buttonColor === color && !config.buttonGradient ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Gradiente do Botão (Opcional)</label>
                      <input 
                        type="text" 
                        value={config.buttonGradient}
                        placeholder="linear-gradient(90deg, var(--primary), #FF8A00)"
                        onChange={(e) => updateConfig({ buttonGradient: e.target.value })}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Tamanho do Botão</label>
                      <select 
                        value={config.buttonSize}
                        onChange={(e) => updateConfig({ buttonSize: e.target.value as any })}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)] appearance-none"
                      >
                        <option value="small" className="bg-zinc-900">Pequeno</option>
                        <option value="medium" className="bg-zinc-900">Médio</option>
                        <option value="large" className="bg-zinc-900">Grande</option>
                        <option value="giant" className="bg-zinc-900">Gigante (Mobile-First)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Estilo da Borda</label>
                      <select 
                        value={config.buttonBorder}
                        onChange={(e) => updateConfig({ buttonBorder: e.target.value })}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)] appearance-none"
                      >
                        <option value="none">Sem Borda</option>
                        <option value="solid">Sólida</option>
                        <option value="dashed">Tracejada</option>
                        <option value="glow">Glow (Brilho)</option>
                      </select>
                    </div>
                  </>
                )}

                {isModalActive('benefits') && (
                  <div className="space-y-6 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Lista de Benefícios</label>
                      {config.benefitsList.map((benefit, index) => (
                        <div key={index} className="flex gap-2 p-2 bg-black/40 rounded-2xl border border-white/10">
                          <select 
                            value={benefit.icon}
                            onChange={(e) => {
                              const newList = [...config.benefitsList];
                              newList[index] = { ...newList[index], icon: e.target.value };
                              updateConfig({ benefitsList: newList });
                            }}
                            className="w-16 p-4 bg-transparent border-none text-white outline-none appearance-none text-center"
                          >
                            <option value="check">✓</option>
                            <option value="star">★</option>
                            <option value="heart">♥</option>
                            <option value="zap">⚡</option>
                            <option value="shield">🛡</option>
                          </select>
                          <input 
                            type="text" 
                            value={benefit.text}
                            onChange={(e) => {
                              const newList = [...config.benefitsList];
                              newList[index] = { ...newList[index], text: e.target.value };
                              updateConfig({ benefitsList: newList });
                            }}
                            className="flex-1 p-4 bg-transparent border-none text-white outline-none"
                          />
                          <button 
                            onClick={() => {
                              const newList = config.benefitsList.filter((_, i) => i !== index);
                              updateConfig({ benefitsList: newList });
                            }}
                            className="p-4 text-zinc-500 hover:text-red-500 rounded-xl transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => updateConfig({ benefitsList: [...config.benefitsList, { icon: 'check', text: "Novo benefício" }] })}
                        className="w-full py-4 rounded-2xl border border-dashed border-white/10 text-zinc-400 font-bold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                      >
                        + Adicionar Benefício
                      </button>
                    </div>
                  </div>
                )}

                {isModalActive('bonus') && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Lista de Bônus</label>
                      {config.bonusList.map((bonus, index) => (
                        <div key={index} className="space-y-2 p-4 bg-white/5 border border-white/10 rounded-xl relative">
                          <button 
                            onClick={() => {
                              const newList = config.bonusList.filter((_, i) => i !== index);
                              updateConfig({ bonusList: newList });
                            }}
                            className="absolute top-2 right-2 p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
                          >
                            <X size={16} />
                          </button>
                          <input 
                            type="text" 
                            placeholder="Título do Bônus"
                            value={bonus.title}
                            onChange={(e) => {
                              const newList = [...config.bonusList];
                              newList[index] = { ...newList[index], title: e.target.value };
                              updateConfig({ bonusList: newList });
                            }}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)]"
                          />
                          <input 
                            type="text" 
                            placeholder="Descrição"
                            value={bonus.description}
                            onChange={(e) => {
                              const newList = [...config.bonusList];
                              newList[index] = { ...newList[index], description: e.target.value };
                              updateConfig({ bonusList: newList });
                            }}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)]"
                          />
                          <input 
                            type="number" 
                            placeholder="Valor (R$)"
                            value={Number.isNaN(bonus.value) ? "" : bonus.value}
                            onChange={(e) => {
                              const newList = [...config.bonusList];
                              newList[index] = { ...newList[index], value: parseFloat(e.target.value) || 0 };
                              updateConfig({ bonusList: newList });
                            }}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)]"
                          />
                        </div>
                      ))}
                      <button 
                        onClick={() => updateConfig({ bonusList: [...config.bonusList, { title: "Novo Bônus", description: "Descrição do bônus", value: 97 }] })}
                        className="w-full py-4 border border-dashed border-white/20 text-zinc-400 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
                      >
                        + Adicionar Bônus
                      </button>
                    </div>
                  </div>
                )}

                {isModalActive('urgency') && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Contador de Vagas</label>
                    <input 
                      type="number" 
                      value={config.spotsCounter}
                      onChange={(e) => updateConfig({ spotsCounter: parseInt(e.target.value) || 0 })}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)]"
                    />
                    <p className="text-xs text-zinc-500">Defina como 0 para desativar o contador.</p>
                  </div>
                )}

                {activeModal === 'social_proof' && (
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-400">A seção de Prova Social é estática por enquanto e exibe as estrelas e o texto "Mais de 10.000 alunos satisfeitos".</p>
                  </div>
                )}

                {isModalActive('faq') && (
                  <div className="space-y-6">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Perguntas Frequentes</label>
                    {config.faqList.map((faq, index) => (
                      <div key={index} className="space-y-2 p-4 bg-white/5 border border-white/10 rounded-xl relative">
                        <button 
                          onClick={() => {
                            const newList = config.faqList.filter((_, i) => i !== index);
                            updateConfig({ faqList: newList });
                          }}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                          <X size={14} />
                        </button>
                        <input 
                          type="text" 
                          value={faq.question}
                          placeholder="Pergunta"
                          onChange={(e) => {
                            const newList = [...config.faqList];
                            newList[index].question = e.target.value;
                            updateConfig({ faqList: newList });
                          }}
                          className="w-full p-3 bg-white/5 border border-white/5 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)]"
                        />
                        <textarea 
                          value={faq.answer}
                          placeholder="Resposta"
                          onChange={(e) => {
                            const newList = [...config.faqList];
                            newList[index].answer = e.target.value;
                            updateConfig({ faqList: newList });
                          }}
                          className="w-full p-3 bg-white/5 border border-white/5 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)] min-h-[80px]"
                        />
                      </div>
                    ))}
                    <button 
                      onClick={() => updateConfig({ faqList: [...config.faqList, { question: "Nova Pergunta?", answer: "Resposta aqui." }] })}
                      className="w-full py-4 border border-dashed border-white/20 text-zinc-400 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
                    >
                      + Adicionar FAQ
                    </button>
                  </div>
                )}

                {isModalActive('testimonials') && (
                  <div className="space-y-6">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Depoimentos</label>
                    {config.testimonialsList.map((testimonial, index) => (
                      <div key={index} className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-xl relative">
                        <button 
                          onClick={() => {
                            const newList = config.testimonialsList.filter((_, i) => i !== index);
                            updateConfig({ testimonialsList: newList });
                          }}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                          <X size={14} />
                        </button>
                        <div className="flex gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-black/40 border border-white/10 shrink-0">
                            <img src={testimonial.photo} alt={testimonial.name} className="w-full h-full object-cover" />
                          </div>
                          <input 
                            type="text" 
                            value={testimonial.name}
                            placeholder="Nome do Cliente"
                            onChange={(e) => {
                              const newList = [...config.testimonialsList];
                              newList[index].name = e.target.value;
                              updateConfig({ testimonialsList: newList });
                            }}
                            className="flex-1 p-3 bg-white/5 border border-white/5 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)]"
                          />
                        </div>
                        <textarea 
                          value={testimonial.text}
                          placeholder="Depoimento"
                          onChange={(e) => {
                            const newList = [...config.testimonialsList];
                            newList[index].text = e.target.value;
                            updateConfig({ testimonialsList: newList });
                          }}
                          className="w-full p-3 bg-white/5 border border-white/5 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)] min-h-[80px]"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-zinc-400">Estrelas:</span>
                          <input 
                            type="number" 
                            min="1" max="5"
                            value={testimonial.stars}
                            onChange={(e) => {
                              const newList = [...config.testimonialsList];
                              newList[index].stars = parseInt(e.target.value) || 5;
                              updateConfig({ testimonialsList: newList });
                            }}
                            className="w-16 p-2 bg-white/5 border border-white/5 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)] text-center"
                          />
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => updateConfig({ testimonialsList: [...config.testimonialsList, { photo: "https://i.pravatar.cc/150", name: "Novo Cliente", text: "Excelente produto!", stars: 5 }] })}
                      className="w-full py-4 border border-dashed border-white/20 text-zinc-400 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
                    >
                      + Adicionar Depoimento
                    </button>
                  </div>
                )}

                {isModalActive('guarantee') && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Dias de Garantia (0 para desativar)</label>
                    <input 
                      type="number" 
                      value={Number.isNaN(config.guarantee) ? "" : config.guarantee}
                      onChange={(e) => updateConfig({ guarantee: parseInt(e.target.value) || 0 })}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)]"
                    />
                  </div>
                )}

                {isModalActive('social_proof') && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <h4 className="font-bold text-white text-sm">Prova Social ao Vivo</h4>
                        <p className="text-[10px] text-zinc-500">Exibe avaliações recentes</p>
                      </div>
                      <button 
                        onClick={() => updateConfig({ liveSocialProof: !config.liveSocialProof })}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${config.liveSocialProof ? 'bg-[var(--primary)]' : 'bg-zinc-800'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.liveSocialProof ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                )}

                {isModalActive('timer') && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Minutos do Timer (0 para desativar)</label>
                    <input 
                      type="number" 
                      value={Number.isNaN(config.timer) ? "" : config.timer}
                      onChange={(e) => updateConfig({ timer: parseInt(e.target.value) || 0 })}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:shadow-[0_0_15px_var(--color-primary)]"
                    />
                  </div>
                )}
                
                {activeModal === 'add_section' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white mb-4">Escolha o tipo de seção</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { type: 'header', label: 'Cabeçalho', icon: LayoutTemplate },
                        { type: 'product', label: 'Produto', icon: PackagePlus },
                        { type: 'benefits', label: 'Benefícios', icon: CheckCircle2 },
                        { type: 'testimonials', label: 'Depoimentos', icon: MessageSquare },
                        { type: 'guarantee', label: 'Garantia', icon: ShieldCheck },
                        { type: 'timer', label: 'Timer', icon: Clock },
                        { type: 'payment', label: 'Pagamento', icon: CreditCard },
                        { type: 'faq', label: 'FAQ', icon: HelpCircle },
                        { type: 'bonus', label: 'Bônus', icon: PackagePlus },
                        { type: 'urgency', label: 'Urgência', icon: Clock },
                        { type: 'social_proof', label: 'Prova Social', icon: Star },
                      ].map((item) => (
                        <button
                          key={item.type}
                          onClick={() => {
                            const newSection: CheckoutSection = {
                              id: `${item.type}_${Math.random().toString(36).substr(2, 9)}`,
                              type: item.type as any,
                              enabled: true
                            };
                            updateConfig({
                              sections: [...config.sections, newSection]
                            });
                            setActiveModal(null);
                          }}
                          className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/10 hover:border-[var(--primary)]/50 transition-all group"
                        >
                          <item.icon size={24} className="text-zinc-400 group-hover:text-[var(--primary)] transition-colors" />
                          <span className="text-sm font-bold text-white">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={() => setActiveModal(null)} className="w-full py-5 bg-[var(--primary)] text-white rounded-[24px] font-bold tracking-[-0.02em] text-lg shadow-xl mt-4">
                  Salvar Alterações
                </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
