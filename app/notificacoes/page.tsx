"use client";

import { motion, AnimatePresence } from "motion/react";
import { Bell, CheckCircle2, DollarSign, UserPlus, ArrowLeft, Trash2, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([
    {
      id: 1,
      tipo: "venda",
      titulo: "Nova Venda Aprovada! 🎉",
      mensagem: "João Silva acabou de comprar Mestre em Vendas.",
      valor: "R$ 497,00",
      tempo: "Agora mesmo",
      lida: false,
    },
    {
      id: 2,
      tipo: "aluno",
      titulo: "Novo Aluno Inscrito",
      mensagem: "Maria Oliveira se matriculou na Mentoria VIP.",
      tempo: "Há 2 horas",
      lida: false,
    },
    {
      id: 3,
      tipo: "saque",
      titulo: "Saque Realizado",
      mensagem: "Seu saque de R$ 1.500,00 foi processado com sucesso.",
      tempo: "Ontem, 14:30",
      lida: true,
    },
    {
      id: 4,
      tipo: "venda",
      titulo: "Boleto Gerado",
      mensagem: "Pedro Santos gerou um boleto para E-book Gatilhos.",
      valor: "R$ 97,00",
      tempo: "Ontem, 10:15",
      lida: true,
    },
  ]);

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "venda": return <DollarSign size={20} className="text-emerald-400" />;
      case "aluno": return <UserPlus size={20} className="text-[#6C2BFF]" />;
      case "saque": return <CheckCircle2 size={20} className="text-[#FF6A00]" />;
      default: return <Bell size={20} className="text-zinc-400" />;
    }
  };

  const getIconBg = (tipo: string) => {
    switch (tipo) {
      case "venda": return "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
      case "aluno": return "bg-[#6C2BFF]/10 border-[#6C2BFF]/20 shadow-[0_0_15px_rgba(108,43,255,0.2)]";
      case "saque": return "bg-[#FF6A00]/10 border-[#FF6A00]/20 shadow-[0_0_15px_rgba(255,106,0,0.2)]";
      default: return "bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const marcarComoLida = (id: number) => {
    setNotificacoes(notificacoes.map(n => n.id === id ? { ...n, lida: true } : n));
  };

  const marcarTodasLidas = () => {
    setNotificacoes(notificacoes.map(n => ({ ...n, lida: true })));
  };

  const removerNotificacao = (id: number) => {
    setNotificacoes(notificacoes.filter(n => n.id !== id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] pb-32 relative">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-[#6C2BFF]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 pt-12 flex items-center justify-between sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-xl z-40 border-b border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/perfil">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-[#111118] rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <ArrowLeft size={24} className="text-zinc-300" />
            </motion.div>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Notificações</h1>
            <p className="text-zinc-400 text-sm mt-1 font-medium">Fique por dentro de tudo</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={marcarTodasLidas}
          className="flex items-center gap-1.5 text-xs font-bold text-[#FF6A00] bg-[#FF6A00]/10 px-3 py-1.5 rounded-full border border-[#FF6A00]/20 hover:bg-[#FF6A00]/20 transition-colors"
        >
          <CheckCheck size={14} />
          Lidas
        </motion.button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-6 space-y-4"
      >
        <AnimatePresence>
          {notificacoes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell size={32} className="text-zinc-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tudo limpo por aqui!</h3>
              <p className="text-zinc-400 text-sm">Você não tem novas notificações no momento.</p>
            </motion.div>
          ) : (
            notificacoes.map((notificacao) => (
              <motion.div
                key={notificacao.id}
                variants={itemVariants}
                layout
                onClick={() => marcarComoLida(notificacao.id)}
                className={`p-4 rounded-3xl border shadow-lg relative overflow-hidden group cursor-pointer transition-all duration-300 ${
                  notificacao.lida 
                    ? 'bg-[#111118] border-white/5 opacity-70 hover:opacity-100' 
                    : 'bg-gradient-to-br from-[#111118] to-[#1a1a24] border-[#FF6A00]/30 shadow-[0_5px_20px_rgba(255,106,0,0.1)]'
                }`}
              >
                {/* Unread Indicator Glow */}
                {!notificacao.lida && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#FF6A00] to-[#6C2BFF] shadow-[0_0_10px_#FF6A00]"></div>
                )}
                
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${getIconBg(notificacao.tipo)}`}>
                    {getIcon(notificacao.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold text-sm truncate pr-2 ${notificacao.lida ? 'text-zinc-400' : 'text-white'}`}>
                        {notificacao.titulo}
                      </h3>
                      <span className="text-[10px] font-medium text-zinc-500 shrink-0 mt-0.5 bg-white/5 px-2 py-0.5 rounded-full">{notificacao.tempo}</span>
                    </div>
                    <p className={`text-xs leading-relaxed mb-2 ${notificacao.lida ? 'text-zinc-500' : 'text-zinc-300'}`}>
                      {notificacao.mensagem}
                    </p>
                    <div className="flex items-center justify-between">
                      {notificacao.valor ? (
                        <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                          <span className="text-emerald-400 font-black text-xs">{notificacao.valor}</span>
                        </div>
                      ) : <div></div>}
                      
                      {/* Delete Button (shows on hover) */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); removerNotificacao(notificacao.id); }}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
