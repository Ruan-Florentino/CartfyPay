"use client";

import { motion } from "motion/react";
import { Search, Filter, ChevronLeft, DollarSign, Users, Award, CheckCircle2, Copy, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Marketplace() {
  const [affiliated, setAffiliated] = useState<number[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const courses = [
    {
      id: 1,
      title: "Curso Marketing Digital",
      producer: "João Silva",
      price: "R$ 197,00",
      commission: "50%",
      sales: "+1000",
      thumbnail: "https://picsum.photos/seed/marketing/400/300",
      category: "Marketing",
    },
    {
      id: 2,
      title: "Mestre das Vendas",
      producer: "Carlos Eduardo",
      price: "R$ 97,00",
      commission: "40%",
      sales: "+500",
      thumbnail: "https://picsum.photos/seed/vendas/400/300",
      category: "Vendas",
    },
    {
      id: 3,
      title: "Dropshipping do Zero",
      producer: "Ana Clara",
      price: "R$ 297,00",
      commission: "60%",
      sales: "+2000",
      thumbnail: "https://picsum.photos/seed/drop/400/300",
      category: "E-commerce",
    },
  ];

  const handleAffiliate = (id: number) => {
    if (!affiliated.includes(id)) {
      setAffiliated([...affiliated, id]);
    }
  };

  const handleCopy = (id: number) => {
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
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
    <div className="min-h-screen bg-[#0B0B0F] pb-32 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-[#FF5F00]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 pt-12 flex justify-between items-center sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-2xl z-40 border-b border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-[#111118]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <ChevronLeft size={24} className="text-zinc-300" />
            </motion.div>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Marketplace</h1>
            <p className="text-zinc-400 text-sm mt-1 font-medium">Encontre produtos para se afiliar</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#FF5F00] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar produtos..." 
              className="w-full bg-[#111118]/80 backdrop-blur-xl border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF5F00]/50 focus:ring-1 focus:ring-[#FF5F00]/50 transition-all shadow-lg"
            />
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-[#111118]/80 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors shadow-lg shrink-0"
          >
            <Filter size={20} />
          </motion.button>
        </div>

        {/* Course List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {courses.map((course) => (
            <motion.div 
              key={course.id}
              variants={itemVariants}
              className="bg-[#111118]/80 backdrop-blur-xl p-4 sm:p-5 rounded-[28px] border border-white/10 shadow-xl relative overflow-hidden group"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 relative">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10">
                    {course.category}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-white text-base sm:text-lg leading-tight mb-1">{course.title}</h3>
                    <p className="text-zinc-400 text-xs font-medium flex items-center gap-1">
                      <Award size={12} className="text-[#FF5F00]" /> {course.producer}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Preço</p>
                      <p className="text-white font-black text-sm sm:text-base">{course.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-500/70 text-[10px] uppercase font-bold tracking-wider">Comissão</p>
                      <p className="text-emerald-500 font-black text-sm sm:text-base">{course.commission}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-zinc-400 text-xs font-medium">
                  <Users size={14} /> {course.sales} vendas
                </div>
                
                {!affiliated.includes(course.id) ? (
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAffiliate(course.id)}
                    className="bg-gradient-to-r from-[#FF5F00] to-[#FF8C00] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-[0_5px_15px_rgba(255,95,0,0.3)] hover:shadow-[0_5px_20px_rgba(255,95,0,0.5)] transition-all"
                  >
                    Se Afiliar
                  </motion.button>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 size={14} /> Afiliado
                    </div>
                  </div>
                )}
              </div>

              {/* Affiliate Link Section (Shows after affiliating) */}
              {affiliated.includes(course.id) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-white/5"
                >
                  <p className="text-zinc-400 text-xs font-medium mb-2">Seu link de afiliado:</p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-zinc-300 truncate font-mono flex items-center">
                      cartfy.app/ref/{course.id}xyz
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopy(course.id)}
                      className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${copied === course.id ? 'bg-emerald-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]' : 'bg-[#111118] border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'}`}
                    >
                      {copied === course.id ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-10 h-10 bg-[#111118] border border-white/10 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Share2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
