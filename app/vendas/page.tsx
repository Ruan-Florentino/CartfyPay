"use client";

import { motion } from "motion/react";
import { ArrowUpRight, ArrowDownRight, Search, Filter, Calendar, CreditCard, Smartphone, FileText, ChevronRight, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { name: 'Seg', vendas: 4000 },
  { name: 'Ter', vendas: 3000 },
  { name: 'Qua', vendas: 2000 },
  { name: 'Qui', vendas: 2780 },
  { name: 'Sex', vendas: 1890 },
  { name: 'Sáb', vendas: 2390 },
  { name: 'Dom', vendas: 3490 },
];

export default function Vendas() {
  const [activeFilter, setActiveFilter] = useState('Hoje');

  const vendas = [
    {
      id: "TRX-9021",
      cliente: "João Silva",
      avatar: "https://i.pravatar.cc/150?img=11",
      produto: "Curso Mestre em Vendas",
      valor: "R$ 497,00",
      status: "Aprovado",
      metodo: "Pix",
      data: "Hoje, 14:30",
    },
    {
      id: "TRX-9020",
      cliente: "Maria Oliveira",
      avatar: "https://i.pravatar.cc/150?img=5",
      produto: "Mentoria VIP",
      valor: "R$ 1.997,00",
      status: "Aprovado",
      metodo: "Cartão",
      data: "Hoje, 11:15",
    },
    {
      id: "TRX-9019",
      cliente: "Pedro Santos",
      avatar: "https://i.pravatar.cc/150?img=8",
      produto: "E-book Gatilhos",
      valor: "R$ 97,00",
      status: "Pendente",
      metodo: "Boleto",
      data: "Ontem, 16:45",
    },
    {
      id: "TRX-9018",
      cliente: "Ana Costa",
      avatar: "https://i.pravatar.cc/150?img=9",
      produto: "Curso Mestre em Vendas",
      valor: "R$ 497,00",
      status: "Reembolsado",
      metodo: "Cartão",
      data: "18 Mar, 09:20",
    },
    {
      id: "TRX-9017",
      cliente: "Carlos Souza",
      avatar: "https://i.pravatar.cc/150?img=12",
      produto: "Mentoria VIP",
      valor: "R$ 1.997,00",
      status: "Recusado",
      metodo: "Cartão",
      data: "17 Mar, 14:20",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
      case "Pendente": return "text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]";
      case "Reembolsado": return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20 shadow-[0_0_10px_rgba(161,161,170,0.1)]";
      case "Recusado": return "text-red-500 bg-red-500/10 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]";
      default: return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const getMetodoIcon = (metodo: string) => {
    switch (metodo) {
      case "Pix": return <Smartphone size={14} className="text-emerald-500" />;
      case "Cartão": return <CreditCard size={14} className="text-blue-500" />;
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

  return (
    <div className="min-h-screen bg-[#0B0B0F] pb-32 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-emerald-500/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 pt-12 flex justify-between items-center sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-2xl z-40 border-b border-white/5 shadow-sm">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Vendas</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">Acompanhe seu faturamento</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-2xl bg-[#111118]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Filter size={24} className="text-zinc-300" />
        </motion.button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-4 sm:p-6 space-y-6"
      >
        {/* Filters */}
        <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Hoje', '7 dias', '30 dias', 'Este Mês', 'Todos'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                activeFilter === filter 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]' 
                  : 'bg-[#111118]/80 backdrop-blur-xl border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {filter}
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
              <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                <DollarSign size={16} className="text-emerald-500" />
              </div>
              <p className="text-emerald-500 text-xs font-bold uppercase tracking-wider">Aprovadas</p>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">R$ 2.494<span className="text-emerald-500/50 text-xl">,00</span></p>
            <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs font-bold">
              <TrendingUp size={12} />
              <span>+12.5% vs ontem</span>
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-[#111118]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden group h-full flex flex-col justify-center"
            >
              <p className="text-zinc-400 text-xs font-bold mb-1 uppercase tracking-wider">Pendentes</p>
              <p className="text-xl font-black text-white">R$ 97,00</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-[#111118]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden group h-full flex flex-col justify-center"
            >
              <p className="text-zinc-400 text-xs font-bold mb-1 uppercase tracking-wider">Recusadas</p>
              <p className="text-xl font-black text-white">R$ 1.997,00</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div variants={itemVariants} className="bg-[#111118]/80 backdrop-blur-xl p-5 rounded-[28px] border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-lg">Faturamento</h3>
            <span className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
              <TrendingUp size={14} /> +12%
            </span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111118', borderColor: '#ffffff10', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
                  formatter={(value) => [`R$ ${value}`, 'Vendas']}
                />
                <Area type="monotone" dataKey="vendas" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorVendas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar transação, cliente..."
            className="w-full bg-[#111118]/80 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-base shadow-lg"
          />
        </motion.div>

        {/* Lista de Vendas */}
        <div className="space-y-3">
          <h3 className="text-white font-bold text-lg mb-2 px-1">Transações Recentes</h3>
          {vendas.map((venda, index) => (
            <motion.div
              key={venda.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="bg-[#111118]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-xl hover:border-white/10 transition-colors cursor-pointer group relative overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shadow-inner relative">
                    <img src={venda.avatar} alt={venda.cliente} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-emerald-500 transition-colors">{venda.cliente}</h3>
                    <p className="text-zinc-500 text-xs mt-0.5 font-medium">{venda.produto}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${venda.status === 'Reembolsado' || venda.status === 'Recusado' ? 'text-zinc-500 line-through' : 'text-emerald-500'}`}>
                    {venda.valor}
                  </p>
                  <p className="text-zinc-500 text-[10px] mt-1 font-bold">{venda.data}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl">
                  {getMetodoIcon(venda.metodo)}
                  <span className="text-zinc-300 text-xs font-bold">{venda.metodo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${getStatusColor(venda.status)}`}>
                    {venda.status}
                  </span>
                  <ChevronRight size={16} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
