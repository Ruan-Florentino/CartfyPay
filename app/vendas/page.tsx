"use client";

import { motion } from "motion/react";
import { ArrowUpRight, ArrowDownRight, Search, Filter, Calendar, CreditCard, Smartphone, FileText, ChevronRight, TrendingUp, DollarSign, Lock, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useMode } from "@/lib/mode-context";
import { useRouter } from "next/navigation";
import { useVendas } from "@/hooks/use-vendas";

export default function Vendas() {
  const { mode } = useMode();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<'hoje' | 'semana' | 'mes' | 'todos'>('todos');
  const [chartHeight, setChartHeight] = useState(220);
  const { vendas, loading, metricas } = useVendas(activeFilter);

  useEffect(() => {
    if (mode === 'aluno') {
      router.push('/');
    }
  }, [mode, router]);

  useEffect(() => {
    const handleResize = () => {
      setChartHeight(window.innerWidth >= 768 ? 260 : 180);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const result = days.map(day => ({ name: day, vendas: 0 }));
    
    vendas.forEach(v => {
      if (v.status === 'aprovado') {
        const dayIndex = new Date(v.createdAt).getDay();
        result[dayIndex].vendas += v.valor;
      }
    });
    
    return result;
  }, [vendas]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
      case "pendente": return "text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]";
      case "reembolsado": return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20 shadow-[0_0_10px_rgba(161,161,170,0.1)]";
      case "recusado": return "text-red-500 bg-red-500/10 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]";
      default: return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const getMetodoIcon = (metodo: string) => {
    switch (metodo) {
      case "pix": return <Smartphone size={14} className="text-emerald-500" />;
      case "cartao": return <CreditCard size={14} className="text-blue-500" />;
      default: return <FileText size={14} className="text-zinc-500" />;
    }
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] pb-32 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-emerald-500/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 pt-12 flex justify-between items-center sticky top-0 bg-black/40 backdrop-blur-2xl z-40 border-b border-white/10 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em] tracking-tight text-white">Vendas</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">Acompanhe seu faturamento</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
        >
          <Filter size={24} className="text-zinc-300" strokeWidth={1.5} />
        </motion.button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-4 sm:p-6 space-y-6"
      >
        {/* Filters */}
        <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x">
          {[
            { id: 'hoje', label: 'Hoje' },
            { id: 'semana', label: '7 dias' },
            { id: 'mes', label: '30 dias' },
            { id: 'todos', label: 'Todos' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`snap-start shrink-0 px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 backdrop-blur-md border ${
                activeFilter === filter.id 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)] border-emerald-400/50 scale-105' 
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:scale-105'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Resumo Rápido */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-5 rounded-[28px] border border-emerald-500/20 shadow-[0_10px_30px_rgba(16,185,129,0.1)] relative overflow-hidden group backdrop-blur-xl"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-colors"></div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-emerald-500/20 rounded-lg shadow-inner">
                <DollarSign size={16} className="text-emerald-400" strokeWidth={2} />
              </div>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Aprovadas</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-white tracking-tight drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">R$ {metricas.faturamento.toLocaleString('pt-BR')}</p>
            <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs font-bold">
              <TrendingUp size={12} strokeWidth={2} />
              <span>{metricas.vendasAprovadas} vendas</span>
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden group h-full flex flex-col justify-center hover:border-white/20 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
            >
              <p className="text-zinc-400 text-xs font-bold mb-1 uppercase tracking-wider">Pendentes</p>
              <p className="text-xl font-bold tracking-[-0.02em] text-white group-hover:text-amber-400 transition-colors">{metricas.vendasPendentes}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden group h-full flex flex-col justify-center hover:border-white/20 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]"
            >
              <p className="text-zinc-400 text-xs font-bold mb-1 uppercase tracking-wider">Recusadas/Reemb.</p>
              <p className="text-xl font-bold tracking-[-0.02em] text-white group-hover:text-red-400 transition-colors">{metricas.vendasReembolsadas}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl p-5 rounded-[28px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-lg">Faturamento</h3>
            <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border border-emerald-500/20 shadow-inner">
              <TrendingUp size={14} strokeWidth={2} /> {metricas.taxaAprovacao}% aprovação
            </span>
          </div>
          <div className="w-full h-[180px] md:h-[260px] relative">
            <ResponsiveContainer width="100%" height={chartHeight}>
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#34D399', fontWeight: 'bold' }}
                  formatter={(value) => [`R$ ${value}`, 'Vendas']}
                />
                <Area type="monotone" dataKey="vendas" stroke="#34D399" strokeWidth={3} fillOpacity={1} fill="url(#colorVendas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={20} strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Buscar transação, cliente..."
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400/50 focus:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all text-base shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          />
        </motion.div>

        {/* Lista de Vendas */}
        <div className="space-y-3">
          <h3 className="text-white font-bold text-lg mb-2 px-1">Transações Recentes</h3>
          {vendas.length === 0 && (
            <p className="text-zinc-500 text-center py-8">Nenhuma venda encontrada no período.</p>
          )}
          {vendas.map((venda, index) => (
            <motion.div
              key={venda.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all cursor-pointer group relative overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shadow-inner relative group-hover:scale-110 transition-transform bg-zinc-800 flex items-center justify-center text-white font-bold">
                    {venda.cliente.charAt(0).toUpperCase()}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">{venda.cliente}</h3>
                    <p className="text-zinc-400 text-xs mt-0.5 font-medium">{venda.produto}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold tracking-[-0.02em] text-sm ${venda.status === 'reembolsado' || venda.status === 'recusado' ? 'text-zinc-500 line-through' : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]'}`}>
                    R$ {venda.valor.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-zinc-500 text-[10px] mt-1 font-bold">{new Date(venda.createdAt).toLocaleDateString('pt-BR')} {new Date(venda.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/10 relative z-10">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 shadow-inner">
                  {getMetodoIcon(venda.metodo)}
                  <span className="text-zinc-300 text-xs font-bold uppercase">{venda.metodo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-[-0.02em] uppercase tracking-wider border ${getStatusColor(venda.status)}`}>
                    {venda.status}
                  </span>
                  <ChevronRight size={16} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" strokeWidth={1.5} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
