"use client";

import { motion } from "motion/react";
import { ChevronLeft, ArrowDownToLine, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, Wallet, Building2, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Financial() {
  const history = [
    { id: "SAQ-1029", type: "withdraw", amount: "R$ 5.000,00", status: "completed", date: "Hoje, 14:30", account: "Nubank final 4021" },
    { id: "SAQ-1028", type: "withdraw", amount: "R$ 12.450,00", status: "completed", date: "18 Mar, 09:15", account: "Itaú final 8829" },
    { id: "SAQ-1027", type: "withdraw", amount: "R$ 3.200,00", status: "completed", date: "10 Mar, 16:45", account: "Nubank final 4021" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 size={14} className="text-emerald-500" />;
      case "pending": return <Clock size={14} className="text-amber-500" />;
      default: return null;
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
    <div className="min-h-screen bg-[#0B0B0F] pb-32 relative">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-[#FF6A00]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 pt-12 flex items-center gap-4 sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-xl z-40 border-b border-white/5 shadow-sm">
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
          <h1 className="text-3xl font-black tracking-tight text-white">Financeiro</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">Gerencie seus ganhos</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-6 space-y-8"
      >
        {/* Balance Card */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-[#FF6A00] to-[#6C2BFF] p-8 rounded-[2.5rem] relative overflow-hidden shadow-[0_20px_50px_rgba(255,106,0,0.3)]"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white/80">
                <Wallet size={20} />
                <span className="font-medium text-sm uppercase tracking-wider">Saldo Disponível</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                <TrendingUp size={14} className="text-emerald-300" />
                <span className="text-xs font-bold text-white">+12%</span>
              </div>
            </div>
            
            <h2 className="text-5xl font-black text-white tracking-tight mb-8">R$ 14.590<span className="text-3xl text-white/70">,00</span></h2>

            <div className="flex gap-4">
              <div className="flex-1 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-1 mb-1">
                  <Clock size={12} className="text-white/70" />
                  <p className="text-white/70 text-xs">A liberar</p>
                </div>
                <p className="text-white font-bold text-lg">R$ 3.240,50</p>
              </div>
              <div className="flex-1 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-1 mb-1">
                  <AlertCircle size={12} className="text-white/70" />
                  <p className="text-white/70 text-xs">Taxas (Mês)</p>
                </div>
                <p className="text-white font-bold text-lg">R$ 145,20</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="bg-[#111118] border border-white/5 p-5 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors group shadow-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.2)] relative z-10">
              <ArrowDownToLine size={24} className="text-emerald-500" />
            </div>
            <span className="font-bold text-white relative z-10">Sacar</span>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="bg-[#111118] border border-white/5 p-5 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors group shadow-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.2)] relative z-10">
              <Building2 size={24} className="text-blue-500" />
            </div>
            <span className="font-bold text-white relative z-10">Contas</span>
          </motion.button>
        </motion.div>

        {/* History */}
        <motion.div variants={itemVariants} className="space-y-4 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Histórico de Saques</h3>
            <button className="text-sm font-bold text-[#FF6A00] hover:underline">Ver todos</button>
          </div>
          
          <div className="space-y-3">
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="bg-[#111118] p-5 rounded-3xl border border-white/5 flex items-center justify-between shadow-lg hover:border-white/10 transition-colors cursor-pointer group relative overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)] group-hover:scale-110 transition-transform">
                    <ArrowDownRight size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base group-hover:text-emerald-500 transition-colors">Saque</h4>
                    <p className="text-zinc-500 text-xs mt-0.5 font-medium">{item.account}</p>
                  </div>
                </div>
                
                <div className="text-right relative z-10">
                  <p className="font-bold text-white text-lg">{item.amount}</p>
                  <div className="flex items-center justify-end gap-1.5 mt-1">
                    {getStatusIcon(item.status)}
                    <span className="text-zinc-500 text-xs font-bold">{item.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
