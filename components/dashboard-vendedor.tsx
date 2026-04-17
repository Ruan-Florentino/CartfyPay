"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Wallet, TrendingUp, Activity, Bell, ChevronRight, Users, ArrowDownRight, DollarSign, Loader2, Sparkles, Trophy, Target, Star } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useMode } from "@/lib/mode-context";
import { useAuth } from "@/contexts/auth-context";
import { useVendas } from "@/hooks/use-vendas";

export function DashboardVendedor() {
  const { mode, primaryColor, gradientFrom, gradientTo } = useMode();
  const [chartHeight, setChartHeight] = useState(220);
  const { user } = useAuth();
  const { vendas, metricas, loading } = useVendas('todos');
  const [insights, setInsights] = useState<string[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setChartHeight(window.innerWidth >= 768 ? 260 : 180);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchInsights = async () => {
      if (metricas.faturamento === 0) return; // Don't fetch if no data
      setLoadingInsights(true);
      try {
        const response = await fetch('/api/dashboard-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ metricas })
        });
        const data = await response.json();
        if (data.insights) {
          setInsights(data.insights);
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setLoadingInsights(false);
      }
    };

    if (!loading && vendas.length > 0) {
      fetchInsights();
    }
  }, [loading, metricas.faturamento]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  // Calculate today's sales
  const now = new Date();
  const vendasHoje = vendas.filter(v => {
    const vendaDate = new Date(v.createdAt);
    return vendaDate.getDate() === now.getDate() && 
           vendaDate.getMonth() === now.getMonth() && 
           vendaDate.getFullYear() === now.getFullYear() &&
           v.status === 'aprovado';
  }).reduce((acc, curr) => acc + curr.valor, 0);

  // Chart data (last 7 days)
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    
    const daySales = vendas.filter(v => {
      const vendaDate = new Date(v.createdAt);
      return vendaDate.getDate() === d.getDate() && 
             vendaDate.getMonth() === d.getMonth() && 
             vendaDate.getFullYear() === d.getFullYear() &&
             v.status === 'aprovado';
    }).reduce((acc, curr) => acc + curr.valor, 0);

    chartData.push({ name: dayName.charAt(0).toUpperCase() + dayName.slice(1), vendas: daySales });
  }

  const cards = [
    {
      title: "Saldo disponível",
      value: `R$ ${metricas.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Wallet,
      color: "text-[#ff8c42]",
      bg: "bg-[#ff6a00]/10",
      border: "border-[#ff6a00]/20",
      trend: "+0%",
      trendUp: true,
    },
    {
      title: "Vendas hoje",
      value: `R$ ${vendasHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Activity,
      color: "text-[#a855f7]",
      bg: "bg-[#7c3aed]/10",
      border: "border-[#7c3aed]/20",
      trend: "+0%",
      trendUp: true,
    },
    {
      title: "Ticket Médio",
      value: `R$ ${metricas.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      trend: "+0%",
      trendUp: true,
    },
    {
      title: "Conversão",
      value: `${metricas.taxaAprovacao}%`,
      icon: ArrowUpRight,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      trend: "0%",
      trendUp: true,
    },
  ];

  const ultimasVendas = vendas.slice(0, 3).map(v => {
    const date = new Date(v.createdAt);
    const timeString = date.toLocaleDateString('pt-BR') === now.toLocaleDateString('pt-BR') 
      ? `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
      : date.toLocaleDateString('pt-BR');
      
    return {
      id: v.id,
      nome: v.cliente,
      produto: v.produto,
      valor: `R$ ${v.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      tempo: timeString
    };
  });

  const topAfiliados: any[] = []; // Empty for now as we don't have real affiliate data

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
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-64 blur-[100px] -z-10 pointer-events-none opacity-30" style={{ background: `linear-gradient(to bottom, ${gradientFrom}, transparent)` }}></div>

      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center sticky top-0 bg-white/5 backdrop-blur-xl z-40 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-6 pt-12">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Olá, {user?.displayName?.split(' ')[0] || 'Produtor'}! 👋</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">Resumo de hoje</p>
        </div>
        <Link href="/notificacoes" className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-center hover:bg-white/10 transition-colors relative backdrop-blur-md">
          <Bell size={24} className="text-zinc-300" strokeWidth={1.5} />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full shadow-[0_0_10px] animate-pulse border-2 border-[#111118]" style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }}></span>
        </Link>
      </motion.div>

      <div className="p-6 space-y-8">
        {/* Gamification / Nível */}
        <motion.div variants={itemVariants} className="bg-[#111118] border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-[80px] -z-10" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FF8C00] p-0.5 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                <div className="w-full h-full bg-[#111118] rounded-[14px] flex items-center justify-center">
                  <Trophy size={28} className="text-[#FFD700]" />
                </div>
              </div>
              <div>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Seu Nível</p>
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  Platina <Star size={16} className="text-[#FFD700] fill-[#FFD700]" />
                </h3>
              </div>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="flex justify-between items-end mb-2">
                <p className="text-sm font-bold text-zinc-300">Próximo nível: <span className="text-white">Diamante</span></p>
                <p className="text-xs font-bold text-[#FFD700]">R$ 10k / R$ 50k</p>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '20%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
              <p className="text-[10px] text-zinc-500 mt-2 font-medium">Faltam R$ 40.000,00 para desbloquear a taxa de 3.9%</p>
            </div>
          </div>
        </motion.div>

        {/* AI Insights */}
        {vendas.length > 0 && (
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl p-6 rounded-[32px] border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -z-10" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <Sparkles className="text-purple-400" size={20} />
              </div>
              <div>
                <h3 className="text-white font-black text-lg">Insights da IA</h3>
                <p className="text-purple-300/70 text-xs font-medium">Análise em tempo real do seu negócio</p>
              </div>
            </div>
            
            {loadingInsights ? (
              <div className="flex items-center gap-2 text-purple-300/70 text-sm py-4">
                <Loader2 className="animate-spin" size={16} /> Analisando suas métricas...
              </div>
            ) : insights.length > 0 ? (
              <div className="space-y-3">
                {insights.map((insight, i) => (
                  <div key={i} className="bg-black/40 border border-purple-500/20 rounded-2xl p-4 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-purple-400 text-xs font-bold">{i + 1}</span>
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </motion.div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.97 }}
                className={`bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,106,0,0.15)] hover:border-white/20 transition-all duration-300`}
              >
                {/* Glow effect */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 ${card.bg} rounded-full blur-3xl opacity-40 group-hover:opacity-80 transition-opacity duration-500`}></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`p-2.5 rounded-2xl ${card.bg} shadow-inner border border-white/5`}>
                    <Icon size={20} className={card.color} strokeWidth={1.5} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full backdrop-blur-md border ${card.trendUp ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]'}`}>
                    {card.trendUp ? <ArrowUpRight size={12} strokeWidth={1.5} /> : <ArrowDownRight size={12} strokeWidth={1.5} />}
                    {card.trend}
                  </div>
                </div>
                
                <div className="relative z-10">
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">{card.title}</p>
                  <h2 className="text-xl font-black tracking-tight text-white">{card.value}</h2>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Chart */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,106,0,0.15)] hover:border-white/20 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(to bottom, ${gradientFrom}20, transparent)` }}></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-black text-xl text-white flex items-center gap-2">
                  <DollarSign size={20} style={{ color: gradientFrom }} strokeWidth={1.5} />
                  Receita
                </h3>
                <p className="text-zinc-400 text-xs font-medium mt-1">Últimos 7 dias</p>
              </div>
              <select className="bg-white/5 text-xs px-4 py-2 rounded-full border border-white/10 outline-none text-zinc-300 shadow-sm focus:border-white/20 transition-colors font-bold backdrop-blur-md">
                <option>7 dias</option>
                <option>30 dias</option>
              </select>
            </div>
            <div className="w-full h-[180px] md:h-[260px] relative -ml-4">
              <ResponsiveContainer width="100%" height={chartHeight}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={gradientFrom} stopOpacity={0.5}/>
                      <stop offset="95%" stopColor={gradientTo} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 11, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 11, fontWeight: 600 }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(17, 17, 24, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: gradientFrom, fontWeight: '900' }}
                    cursor={{ stroke: `${gradientFrom}33`, strokeWidth: 2, strokeDasharray: '4 4' }}
                    formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Receita']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="vendas" 
                    stroke={gradientFrom} 
                    strokeWidth={4} 
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
            <h3 className="font-black text-xl text-white">Últimas Vendas</h3>
            <Link href="/vendas" className="text-sm font-bold flex items-center gap-1 transition-all hover:scale-105" style={{ color: gradientFrom }}>
              Ver todas <ChevronRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
          <div className="space-y-3">
            {ultimasVendas.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center">
                <p className="text-zinc-500 text-sm">Nenhuma venda realizada ainda.</p>
              </div>
            ) : (
              ultimasVendas.map((venda) => (
                <motion.div 
                  key={venda.id} 
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,106,0,0.15)] hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border border-white/10 group-hover:scale-110 transition-transform animate-gradient" style={{ background: `linear-gradient(135deg, ${gradientFrom}20, ${gradientTo}40)`, color: gradientFrom }}>
                      <Activity size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-black text-sm text-white transition-colors group-hover:text-orange-400">{venda.nome}</p>
                      <p className="text-zinc-500 text-xs mt-0.5 font-medium">{venda.produto}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-emerald-400 shadow-emerald-500/20 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">{venda.valor}</p>
                    <p className="text-zinc-500 text-[10px] mt-1 font-bold uppercase tracking-wider">{venda.tempo}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Top Afiliados */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-xl text-white">Top Afiliados</h3>
            <Link href="/afiliados" className="text-sm font-bold flex items-center gap-1 transition-all hover:scale-105" style={{ color: gradientTo }}>
              Ranking <ChevronRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
          <div className="space-y-3">
            {topAfiliados.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center">
                <p className="text-zinc-500 text-sm">Nenhum afiliado com vendas ainda.</p>
              </div>
            ) : (
              topAfiliados.map((afiliado, i) => (
                <motion.div 
                  key={afiliado.id} 
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border border-white/10 group-hover:scale-110 transition-transform shadow-inner animate-gradient" style={{ background: `linear-gradient(135deg, ${gradientTo}20, ${gradientFrom}40)`, color: gradientTo }}>
                      {i + 1}º
                    </div>
                    <div>
                      <p className="font-black text-sm text-white transition-colors group-hover:text-purple-400">{afiliado.nome}</p>
                      <p className="text-zinc-500 text-xs mt-0.5 font-medium">{afiliado.vendas} vendas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-white">{afiliado.comissao}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

