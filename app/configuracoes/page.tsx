"use client";

import { motion } from "motion/react";
import { Bell, ShieldCheck, UserX, Download, ChevronLeft, Smartphone, Mail, MessageSquare, Key, Laptop, Trash2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Settings() {
  const [toggles, setToggles] = useState({
    push: true,
    email: true,
    sms: false,
    twoFactor: false,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-zinc-500/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 pt-12 flex items-center gap-4 sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-2xl z-40 border-b border-white/5 shadow-sm">
        <Link href="/perfil">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-2xl bg-[#111118]/80 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <ChevronLeft size={20} className="text-zinc-300" />
          </motion.button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] tracking-tight text-white">Configurações</h1>
          <p className="text-zinc-400 text-xs mt-0.5 font-medium">Preferências do app</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-4 sm:p-6 space-y-8"
      >
        {/* Notificações */}
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Bell size={18} className="text-amber-500" />
            <h2 className="text-white font-bold text-lg">Notificações</h2>
          </div>
          
          <div className="bg-[#111118]/80 backdrop-blur-xl rounded-[28px] border border-white/5 shadow-lg overflow-hidden">
            {[
              { id: 'push', title: 'Push Notifications', desc: 'Avisos no celular', icon: Smartphone, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { id: 'email', title: 'Email', desc: 'Resumos e novidades', icon: Mail, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { id: 'sms', title: 'SMS', desc: 'Alertas de segurança', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            ].map((item, index) => (
              <div key={item.id} className={`p-4 flex items-center justify-between ${index !== 2 ? 'border-b border-white/5' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${item.bg} shadow-inner border border-white/5`}>
                    <item.icon size={20} className={item.color} />
                  </div>
                  <div>
                    <span className="font-bold text-white block">{item.title}</span>
                    <span className="text-zinc-500 text-xs font-medium">{item.desc}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(item.id as keyof typeof toggles)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out relative shadow-inner ${
                    toggles[item.id as keyof typeof toggles] ? "bg-gradient-to-r from-[#FF5F00] to-[#FF8C00]" : "bg-zinc-800"
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center ${
                      toggles[item.id as keyof typeof toggles] ? "ml-5" : "ml-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Segurança */}
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <ShieldCheck size={18} className="text-blue-500" />
            <h2 className="text-white font-bold text-lg">Segurança</h2>
          </div>
          
          <div className="bg-[#111118]/80 backdrop-blur-xl rounded-[28px] border border-white/5 shadow-lg overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-[#FF5F00]/10 shadow-inner border border-white/5">
                  <Key size={20} className="text-[#FF5F00]" />
                </div>
                <div>
                  <span className="font-bold text-white block">Autenticação 2FA</span>
                  <span className="text-zinc-500 text-xs font-medium">Mais segurança no login</span>
                </div>
              </div>
              <button
                onClick={() => handleToggle('twoFactor')}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out relative shadow-inner ${
                  toggles.twoFactor ? "bg-gradient-to-r from-[#FF5F00] to-[#FF8C00]" : "bg-zinc-800"
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center ${
                    toggles.twoFactor ? "ml-5" : "ml-0"
                  }`}
                />
              </button>
            </div>
            
            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-zinc-800 shadow-inner border border-white/5">
                  <Laptop size={20} className="text-zinc-400" />
                </div>
                <div>
                  <span className="font-bold text-white block">Dispositivos Conectados</span>
                  <span className="text-zinc-500 text-xs font-medium">Gerencie seus acessos</span>
                </div>
              </div>
              <ChevronLeft size={18} className="text-zinc-500 rotate-180" />
            </div>
          </div>
        </motion.section>

        {/* Conta */}
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <UserX size={18} className="text-red-500" />
            <h2 className="text-white font-bold text-lg">Conta</h2>
          </div>
          
          <div className="bg-[#111118]/80 backdrop-blur-xl rounded-[28px] border border-white/5 shadow-lg overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 shadow-inner border border-white/5 group-hover:bg-emerald-500/20 transition-colors">
                  <Download size={20} className="text-emerald-500" />
                </div>
                <div>
                  <span className="font-bold text-white block">Baixar meus dados</span>
                  <span className="text-zinc-500 text-xs font-medium">Exportar histórico</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-red-500/10 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-red-500/10 shadow-inner border border-white/5 group-hover:bg-red-500/20 transition-colors">
                  <Trash2 size={20} className="text-red-500" />
                </div>
                <div>
                  <span className="font-bold text-red-500 block">Excluir conta</span>
                  <span className="text-red-500/60 text-xs font-medium">Ação irreversível</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
