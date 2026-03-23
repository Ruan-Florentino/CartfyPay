"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Wallet, TrendingUp, Activity, Bell, ChevronRight, Users } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import Link from "next/link";

const data = [
  { name: "Seg", vendas: 400 },
  { name: "Ter", vendas: 300 },
  { name: "Qua", vendas: 550 },
  { name: "Qui", vendas: 450 },
  { name: "Sex", vendas: 700 },
  { name: "Sáb", vendas: 650 },
  { name: "Dom", vendas: 800 },
];

export function DashboardVendedor() {
  const cards = [
    {
      title: "Saldo disponível",
      value: "R$ 14.590,00",
      icon: Wallet,
      color: "text-[#FF6A00]",
      bg: "bg-[#FF6A00]/10",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Vendas hoje",
      value: "R$ 2.340,50",
      icon: Activity,
      color: "text-[#6C2BFF]",
      bg: "bg-[#6C2BFF]/10",
      trend: "+5.2%",
      trendUp: true,
    },
    {
      title: "Total faturado",
      value: "R$ 89.400,00",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      trend: "+18.4%",
      trendUp: true,
    },
    {
      title: "Conversão",
      value: "4.8%",
      icon: ArrowUpRight,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: "-1.2%",
      trendUp: false,
    },
  ];

  const ultimasVendas = [
    { id: 1, nome: "Maria Silva", produto: "Curso Instagram", valor: "R$ 97,00", tempo: "Agora mesmo" },
    { id: 2, nome: "João Pedro", produto: "Mentoria VIP", valor: "R$ 1.997,00", tempo: "Há 5 min" },
    { id: 3, nome: "Ana Costa", produto: "E-book Gatilhos", valor: "R$ 47,00", tempo: "Há 12 min" },
  ];

  const topAfiliados = [
    { id: 1, nome: "Lucas M.", vendas: 145, comissao: "R$ 4.500" },
    { id: 2, nome: "Pedro H.", vendas: 89, comissao: "R$ 2.100" },
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="pb-32 relative min-h-screen"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-xl z-40 border-b border-white/5 shadow-sm p-6 pt-12">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Olá, João! 👋</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">Resumo de hoje</p>
        </div>
        <Link href="/notificacoes" className="w-12 h-12 bg-[#111118] rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-white/5 transition-colors relative">
          <Bell size={24} className="text-zinc-300" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#FF6A00] rounded-full shadow-[0_0_8px_#FF6A00] animate-pulse border-2 border-[#111118]"></span>
        </Link>
      </motion.div>

      <div className="p-6 space-y-8">
        {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#111118] p-4 rounded-3xl border border-white/5 relative overflow-hidden group shadow-lg"
            >
              {/* Glow effect */}
              <div className={`absolute -right-10 -top-10 w-24 h-24 ${card.bg} rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity`}></div>
              
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className={`p-2 rounded-xl ${card.bg} shadow-inner`}>
                  <Icon size={18} className={card.color} />
                </div>
              </div>
              
              <div className="relative z-10">
                <p className="text-zinc-400 text-xs font-medium mb-1">{card.title}</p>
                <h2 className="text-lg font-black tracking-tight text-white">{card.value}</h2>
                <div className={`mt-2 text-[10px] font-bold flex items-center gap-1 ${card.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                  {card.trend}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <motion.div 
        variants={itemVariants}
        className="bg-[#111118] p-5 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF6A00]/5 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-white">Gráfico de Vendas</h3>
            <select className="bg-[#27272A] text-xs px-3 py-1.5 rounded-full border border-white/10 outline-none text-zinc-300 shadow-sm focus:border-[#FF6A00]/50 transition-colors">
              <option>7 dias</option>
              <option>30 dias</option>
            </select>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#FF6A00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 10 }} dy={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#FF6A00', fontWeight: 'bold' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="vendas" 
                  stroke="#FF6A00" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorVendas)" 
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Últimas Vendas */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-white">Últimas Vendas</h3>
          <Link href="/vendas" className="text-[#FF6A00] text-sm font-bold flex items-center gap-1 hover:text-[#FF8C00] transition-colors">
            Ver todas <ChevronRight size={16} />
          </Link>
        </div>
        <div className="space-y-3">
          {ultimasVendas.map((venda) => (
            <motion.div 
              key={venda.id} 
              whileTap={{ scale: 0.98 }}
              className="bg-[#111118] p-4 rounded-3xl border border-white/5 flex justify-between items-center shadow-lg hover:border-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6A00]/10 to-[#FF8C00]/20 flex items-center justify-center text-[#FF6A00] shadow-inner border border-[#FF6A00]/10">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{venda.nome}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{venda.produto}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-sm text-emerald-500">{venda.valor}</p>
                <p className="text-zinc-500 text-xs mt-0.5 font-medium">{venda.tempo}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Top Afiliados */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-white">Top Afiliados</h3>
          <Link href="/afiliados" className="text-[#6C2BFF] text-sm font-bold flex items-center gap-1 hover:text-purple-400 transition-colors">
            Ranking <ChevronRight size={16} />
          </Link>
        </div>
        <div className="space-y-3">
          {topAfiliados.map((afiliado, i) => (
            <motion.div 
              key={afiliado.id} 
              whileTap={{ scale: 0.98 }}
              className="bg-[#111118] p-4 rounded-3xl border border-white/5 flex justify-between items-center shadow-lg hover:border-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6C2BFF]/10 to-purple-500/20 flex items-center justify-center text-[#6C2BFF] font-black text-sm border border-[#6C2BFF]/20 shadow-[0_0_10px_rgba(108,43,255,0.1)]">
                  {i + 1}º
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{afiliado.nome}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{afiliado.vendas} vendas</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-sm text-white">{afiliado.comissao}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      </div>
    </motion.div>
  );
}
