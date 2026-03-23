"use client";

import { motion } from "motion/react";
import { Users, Link as LinkIcon, DollarSign, ChevronRight, Trophy, ArrowUpRight, Search, Copy, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Afiliados() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ranking = [
    { id: 1, nome: "Lucas Martins", avatar: "https://i.pravatar.cc/150?img=11", vendas: 145, comissao: "R$ 4.500,00", badge: "Ouro" },
    { id: 2, nome: "Pedro Henrique", avatar: "https://i.pravatar.cc/150?img=12", vendas: 89, comissao: "R$ 2.100,00", badge: "Prata" },
    { id: 3, nome: "Ana Clara", avatar: "https://i.pravatar.cc/150?img=5", vendas: 56, comissao: "R$ 1.250,00", badge: "Bronze" },
    { id: 4, nome: "Marcos Silva", avatar: "https://i.pravatar.cc/150?img=8", vendas: 34, comissao: "R$ 850,00", badge: "" },
  ];

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] pb-32 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-[#FF6A00]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 pt-12 flex justify-between items-center sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-xl z-40 border-b border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/perfil">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-[#111118] rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <ChevronLeft size={24} className="text-zinc-300" />
            </motion.div>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Afiliados</h1>
            <p className="text-zinc-400 text-sm mt-1 font-medium">Gerencie seus parceiros</p>
          </div>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-[#111118] rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Users size={24} className="text-zinc-300" />
        </motion.button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-6 space-y-8"
      >
        {/* Resumo */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#6C2BFF]/20 to-[#6C2BFF]/5 p-5 rounded-3xl border border-[#6C2BFF]/20 relative overflow-hidden group shadow-[0_10px_30px_rgba(108,43,255,0.1)]"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#6C2BFF]/20 rounded-full blur-2xl group-hover:bg-[#6C2BFF]/30 transition-colors"></div>
          <p className="text-[#6C2BFF] text-xs font-bold mb-1 uppercase tracking-wider">Total Afiliados</p>
          <p className="text-2xl font-black text-white">1.248</p>
          <div className="mt-2 text-[10px] font-bold flex items-center gap-1 text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-lg">
            <ArrowUpRight size={12} /> +12 esta semana
          </div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-5 rounded-3xl border border-emerald-500/20 relative overflow-hidden group shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-colors"></div>
          <p className="text-emerald-500 text-xs font-bold mb-1 uppercase tracking-wider">Comissões Pagas</p>
          <p className="text-2xl font-black text-white">R$ 45k</p>
          <div className="mt-2 text-[10px] font-bold flex items-center gap-1 text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-lg">
            <ArrowUpRight size={12} /> +R$ 2k hoje
          </div>
        </motion.div>
      </motion.div>

      {/* Links de Convite */}
      <motion.div 
        variants={itemVariants}
        className="bg-[#111118] p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF6A00]/5 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-tr from-[#FF6A00]/10 to-[#FF8C00]/20 rounded-2xl border border-[#FF6A00]/10 shadow-inner">
              <LinkIcon size={24} className="text-[#FF6A00]" />
            </div>
            <h3 className="font-black text-xl text-white">Link de Convite</h3>
          </div>
          <p className="text-zinc-400 text-sm mb-5 font-medium">Compartilhe este link para convidar novos afiliados para seus produtos.</p>
          <div className="flex gap-3">
            <div className="flex-1 bg-[#0B0B0F] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-zinc-300 truncate shadow-inner font-mono">
              cartfy.com/invite/joaosilva
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all ${copied ? 'bg-emerald-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]' : 'bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] text-white shadow-[0_4px_15px_rgba(255,106,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,106,0,0.4)]'}`}
            >
              {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Ranking */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
              <Trophy size={20} className="text-[#FFD700]" />
            </div>
            <h3 className="font-black text-xl text-white">Ranking Top 10</h3>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#6C2BFF] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar afiliado..." 
              className="bg-[#111118] border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#6C2BFF]/50 focus:ring-1 focus:ring-[#6C2BFF]/50 transition-all w-40 shadow-lg"
            />
          </div>
        </div>

        <div className="space-y-3">
          {ranking.map((afiliado, index) => (
            <motion.div 
              key={afiliado.id} 
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="bg-[#111118] p-4 rounded-3xl border border-white/5 flex items-center gap-4 shadow-xl relative overflow-hidden group cursor-pointer hover:border-white/10 transition-colors"
            >
              {index < 3 && (
                <div className={`absolute top-0 left-0 w-1.5 h-full ${index === 0 ? 'bg-gradient-to-b from-[#FFD700] to-[#FFD700]/50' : index === 1 ? 'bg-gradient-to-b from-[#C0C0C0] to-[#C0C0C0]/50' : 'bg-gradient-to-b from-[#CD7F32] to-[#CD7F32]/50'}`}></div>
              )}
              
              <div className="w-8 text-center font-black text-zinc-500 text-xl pl-2">
                {index + 1}º
              </div>
              
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 shrink-0 shadow-inner relative">
                <img src={afiliado.avatar} alt={afiliado.nome} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-white text-base truncate group-hover:text-[#6C2BFF] transition-colors">{afiliado.nome}</h4>
                  {afiliado.badge && (
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      afiliado.badge === 'Ouro' ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 shadow-[0_0_10px_rgba(255,215,0,0.1)]' :
                      afiliado.badge === 'Prata' ? 'bg-[#C0C0C0]/10 text-[#C0C0C0] border border-[#C0C0C0]/20 shadow-[0_0_10px_rgba(192,192,192,0.1)]' :
                      'bg-[#CD7F32]/10 text-[#CD7F32] border border-[#CD7F32]/20 shadow-[0_0_10px_rgba(205,127,50,0.1)]'
                    }`}>
                      {afiliado.badge}
                    </span>
                  )}
                </div>
                <p className="text-zinc-500 text-xs font-medium">{afiliado.vendas} vendas realizadas</p>
              </div>
              
              <div className="text-right shrink-0">
                <p className="font-black text-base text-emerald-500">{afiliado.comissao}</p>
                <button className="text-[#6C2BFF] text-[10px] font-bold mt-1 hover:underline flex items-center justify-end gap-0.5 w-full">
                  Ver detalhes <ChevronRight size={10} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      </motion.div>
    </div>
  );
}
