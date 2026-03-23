"use client";

import { motion, AnimatePresence } from "motion/react";
import { Palette, CreditCard, ArrowUpRight, PackagePlus, ShieldCheck, MessageSquare, ChevronRight, Clock, Eye, Smartphone, Monitor, Code2, ChevronLeft, Link as LinkIcon, Copy, CheckCircle2, X, Image as ImageIcon, Type, AlignLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function CheckoutBuilder() {
  const [toggles, setToggles] = useState({
    upsell: true,
    orderBump: false,
    guarantee: true,
    testimonials: true,
    timer: false,
    pixel: true,
  });

  const [checkoutData, setCheckoutData] = useState({
    color: "#FF5F00",
    logo: "",
    title: "Meu Produto Incrível",
    description: "Acesso vitalício ao treinamento completo.",
  });

  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = () => {
    // Mock saving to DB
    const mockId = Math.random().toString(36).substring(2, 8);
    setGeneratedLink(`cartfy.app/checkout/${mockId}`);
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const settings = [
    { id: "identity", title: "Identidade Visual", icon: Palette, color: "text-pink-500", bg: "bg-pink-500/10", hasToggle: false, desc: "Cores, logo e fontes" },
    { id: "content", title: "Conteúdo", icon: Type, color: "text-blue-500", bg: "bg-blue-500/10", hasToggle: false, desc: "Título e descrição" },
    { id: "pixel", title: "Pixels de Rastreio", icon: Code2, color: "text-emerald-500", bg: "bg-emerald-500/10", hasToggle: true, desc: "Meta, Google, TikTok" },
    { id: "upsell", title: "Upsell 1-Click", icon: ArrowUpRight, color: "text-[#FF5F00]", bg: "bg-[#FF5F00]/10", hasToggle: true, desc: "Aumente o LTV" },
    { id: "orderBump", title: "Order Bump", icon: PackagePlus, color: "text-[#6C2BFF]", bg: "bg-[#6C2BFF]/10", hasToggle: true, desc: "Oferta complementar" },
    { id: "guarantee", title: "Selo de Garantia", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", hasToggle: true, desc: "Aumenta a conversão" },
    { id: "timer", title: "Timer Escassez", icon: Clock, color: "text-red-500", bg: "bg-red-500/10", hasToggle: true, desc: "Gatilho de urgência" },
    { id: "testimonials", title: "Depoimentos", icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10", hasToggle: true, desc: "Prova social" },
  ];

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
    <div className="min-h-screen bg-[#0B0B0F] pb-32 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-[#FF5F00]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 pt-12 flex justify-between items-center sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-2xl z-40 border-b border-white/5 shadow-sm">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Checkout Builder</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">Configure a experiência.</p>
        </div>
        
        {/* Preview Toggle */}
        <div className="flex bg-[#111118]/80 backdrop-blur-xl p-1 rounded-2xl border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          <button 
            onClick={() => setPreviewMode('mobile')}
            className={`p-2.5 rounded-xl transition-all duration-300 ${previewMode === 'mobile' ? 'bg-gradient-to-tr from-[#FF5F00] to-[#FF8C00] text-white shadow-[0_4px_15px_rgba(255,95,0,0.4)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
          >
            <Smartphone size={18} />
          </button>
          <button 
            onClick={() => setPreviewMode('desktop')}
            className={`p-2.5 rounded-xl transition-all duration-300 ${previewMode === 'desktop' ? 'bg-gradient-to-tr from-[#FF5F00] to-[#FF8C00] text-white shadow-[0_4px_15px_rgba(255,95,0,0.4)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
          >
            <Monitor size={18} />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Preview Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 bg-gradient-to-r from-[#FF5F00]/10 to-[#6C2BFF]/10 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(255,95,0,0.1)] flex items-center justify-between group backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5F00] to-[#6C2BFF] flex items-center justify-center shadow-lg">
              <Eye size={24} className="text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-bold text-lg group-hover:text-[#FF5F00] transition-colors">Visualizar Checkout</h3>
              <p className="text-zinc-400 text-xs">Veja como seu cliente verá a página</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-zinc-500 group-hover:text-white transition-colors" />
        </motion.button>

        {/* Settings List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {settings.map((setting) => {
            const Icon = setting.icon;
            const isToggled = setting.hasToggle ? toggles[setting.id as keyof typeof toggles] : false;

            return (
              <motion.div
                key={setting.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => !setting.hasToggle && setActiveModal(setting.id)}
                className="bg-[#111118]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-white/10 transition-colors shadow-lg relative overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className={`p-3.5 rounded-2xl ${setting.bg} shadow-inner border border-white/5`}>
                    <Icon size={24} className={setting.color} />
                  </div>
                  <div>
                    <span className="font-bold text-white text-lg block group-hover:text-[#FF5F00] transition-colors">{setting.title}</span>
                    <span className="text-zinc-500 text-xs font-medium">{setting.desc}</span>
                  </div>
                </div>

                <div className="relative z-10">
                  {setting.hasToggle ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(setting.id as keyof typeof toggles);
                      }}
                      className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out relative shadow-inner ${
                        isToggled ? "bg-gradient-to-r from-[#FF5F00] to-[#FF8C00]" : "bg-zinc-800"
                      }`}
                    >
                      <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center ${
                          isToggled ? "ml-6" : "ml-0"
                        }`}
                      >
                        {isToggled && <div className="w-2 h-2 rounded-full bg-[#FF5F00]"></div>}
                      </motion.div>
                    </button>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#FF5F00]/10 transition-colors">
                      <ChevronRight size={18} className="text-zinc-500 group-hover:text-[#FF5F00] transition-colors" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Generated Link Section */}
        <AnimatePresence>
          {generatedLink && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="bg-[#111118]/80 backdrop-blur-xl p-5 rounded-[28px] border border-emerald-500/30 shadow-[0_10px_30px_rgba(16,185,129,0.1)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={20} className="text-emerald-500" />
                  <h3 className="font-bold text-white">Checkout Gerado!</h3>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-300 truncate font-mono flex items-center">
                    {generatedLink}
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]' : 'bg-[#FF5F00] text-white shadow-[0_4px_15px_rgba(255,95,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,95,0,0.4)]'}`}
                  >
                    {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          className="w-full bg-gradient-to-r from-[#FF5F00] to-[#FF8C00] text-white font-black text-lg py-5 rounded-3xl shadow-[0_10px_30px_rgba(255,95,0,0.3)] hover:shadow-[0_10px_40px_rgba(255,95,0,0.5)] transition-all flex items-center justify-center gap-2"
        >
          <LinkIcon size={20} />
          Gerar Checkout
        </motion.button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'identity' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#111118]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white">Identidade Visual</h3>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2">Cor Principal</label>
                  <div className="flex gap-3">
                    {['#FF5F00', '#6C2BFF', '#10B981', '#3B82F6', '#EC4899'].map(color => (
                      <button 
                        key={color}
                        onClick={() => setCheckoutData({...checkoutData, color})}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${checkoutData.color === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2">Logo do Produto</label>
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-colors cursor-pointer bg-black/20">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-sm font-medium">Fazer upload da logo</span>
                  </div>
                </div>
                
                <button onClick={() => setActiveModal(null)} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-colors">
                  Concluído
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeModal === 'content' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#111118]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white">Conteúdo</h3>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2">Título do Produto</label>
                  <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input 
                      type="text" 
                      value={checkoutData.title}
                      onChange={(e) => setCheckoutData({...checkoutData, title: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF5F00]/50 transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2">Descrição Curta</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-4 top-4 text-zinc-500" size={18} />
                    <textarea 
                      value={checkoutData.description}
                      onChange={(e) => setCheckoutData({...checkoutData, description: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF5F00]/50 transition-colors min-h-[100px] resize-none"
                    />
                  </div>
                </div>
                
                <button onClick={() => setActiveModal(null)} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-colors">
                  Concluído
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
