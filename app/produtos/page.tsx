"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { Plus, Edit2, MoreVertical, Search, Filter, Pause, Play, BarChart2, X, Image as ImageIcon, DollarSign, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Curso Mestre em Vendas",
      price: "R$ 497,00",
      sales: 1240,
      image: "https://picsum.photos/seed/curso1/400/400",
      status: "Ativo",
    },
    {
      id: 2,
      name: "Mentoria VIP",
      price: "R$ 1.997,00",
      sales: 345,
      image: "https://picsum.photos/seed/curso2/400/400",
      status: "Ativo",
    },
    {
      id: 3,
      name: "E-book Gatilhos Mentais",
      price: "R$ 97,00",
      sales: 5890,
      image: "https://picsum.photos/seed/curso3/400/400",
      status: "Pausado",
    },
  ]);

  const toggleStatus = (id: number) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, status: p.status === "Ativo" ? "Pausado" : "Ativo" } : p
    ));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  // Swipeable Item Component
  const SwipeableProduct = ({ product, onToggle }: { product: any, onToggle: (id: number) => void }) => {
    const x = useMotionValue(0);
    const opacityLeft = useTransform(x, [0, 100], [0, 1]);
    const opacityRight = useTransform(x, [0, -100], [0, 1]);
    const scaleLeft = useTransform(x, [0, 100], [0.8, 1]);
    const scaleRight = useTransform(x, [0, -100], [0.8, 1]);

    const handleDragEnd = (event: any, info: any) => {
      if (info.offset.x > 100) {
        // Swiped right (Edit)
        console.log("Edit product", product.id);
      } else if (info.offset.x < -100) {
        // Swiped left (Pause/Play)
        onToggle(product.id);
      }
    };

    return (
      <motion.div
        layout
        variants={itemVariants}
        className="relative mb-4"
      >
        {/* Background Actions */}
        <div className="absolute inset-0 flex justify-between items-center px-6 rounded-3xl bg-[#111118] border border-white/5 overflow-hidden">
          <motion.div style={{ opacity: opacityLeft, scale: scaleLeft }} className="flex items-center gap-2 text-[#6C2BFF] font-bold">
            <Edit2 size={20} /> Editar
          </motion.div>
          <motion.div style={{ opacity: opacityRight, scale: scaleRight }} className="flex items-center gap-2 text-[#FF6A00] font-bold">
            {product.status === 'Ativo' ? <Pause size={20} /> : <Play size={20} />} {product.status === 'Ativo' ? 'Pausar' : 'Ativar'}
          </motion.div>
        </div>

        {/* Draggable Card */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          onDragEnd={handleDragEnd}
          style={{ x }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="bg-[#111118] p-4 rounded-3xl border border-white/5 flex gap-4 items-center shadow-xl relative overflow-hidden group cursor-grab active:cursor-grabbing z-10"
        >
          {/* Glassmorphism highlight */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative shadow-inner">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            {product.status === 'Pausado' && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                <Pause size={24} className="text-white opacity-80" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 py-1 pointer-events-none">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-white truncate pr-2 text-base">{product.name}</h3>
              <button className="text-zinc-500 hover:text-white transition-colors p-1 -mr-1 rounded-full hover:bg-white/10 pointer-events-auto">
                <MoreVertical size={18} />
              </button>
            </div>
            <p className="text-[#FF6A00] font-black text-lg mb-2">{product.price}</p>
            
            <div className="flex items-center gap-3 text-xs font-bold text-zinc-400">
              <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg">
                <BarChart2 size={12} className="text-emerald-500" />
                {product.sales} vendas
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); onToggle(product.id); }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors pointer-events-auto ${product.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
              >
                {product.status === 'Ativo' ? <Play size={10} fill="currentColor" /> : <Pause size={10} fill="currentColor" />}
                {product.status}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] pb-32 relative">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-[#FF6A00]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 pt-12 flex justify-between items-center sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-xl z-40 border-b border-white/5 shadow-sm">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Produtos</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">Gerencie seu catálogo</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-2xl bg-[#111118] border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Filter size={24} className="text-zinc-300" />
        </motion.button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-6 space-y-6"
      >
        {/* Search */}
        <motion.div variants={itemVariants} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#FF6A00] transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full bg-[#111118] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF6A00]/50 focus:ring-1 focus:ring-[#FF6A00]/50 transition-all text-base shadow-lg"
          />
        </motion.div>

        {/* Product List */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <SwipeableProduct key={product.id} product={product} onToggle={toggleStatus} />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* FAB */}
      <motion.button 
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
        className="absolute bottom-28 right-6 w-16 h-16 bg-gradient-to-tr from-[#FF6A00] to-[#FF8C00] rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(255,106,0,0.6)] z-40 border border-white/20 group"
      >
        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Plus size={32} className="text-white" />
      </motion.button>

      {/* Create Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100) setIsModalOpen(false);
              }}
              className="absolute bottom-0 left-0 right-0 bg-[#111118] rounded-t-[2rem] border-t border-white/10 z-50 p-6 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8 cursor-grab active:cursor-grabbing" />
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-white">Criar Produto</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                  <X size={20} className="text-zinc-400" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Image Upload */}
                <div className="w-full h-32 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/10 hover:border-[#FF6A00]/50 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-[#FF6A00]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} className="text-[#FF6A00]" />
                  </div>
                  <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">Adicionar Capa</span>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input type="text" placeholder="Nome do Produto" className="w-full bg-[#0B0B0F] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF6A00]/50 transition-colors font-medium" />
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input type="text" placeholder="Preço (R$)" className="w-full bg-[#0B0B0F] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF6A00]/50 transition-colors font-medium" />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] text-white font-black text-lg py-4 rounded-2xl shadow-[0_10px_30px_rgba(255,106,0,0.3)] hover:shadow-[0_10px_40px_rgba(255,106,0,0.5)] transition-all mt-4"
                >
                  Continuar
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
