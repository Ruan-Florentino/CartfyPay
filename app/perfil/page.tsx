"use client";

import { motion, AnimatePresence } from "motion/react";
import { User, Wallet, PlayCircle, Settings, LogOut, ChevronRight, Bell, Users, ShieldCheck, Crown, Camera, X, Mail, Lock, Edit3 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useMemo } from "react";
import { useMode } from "@/lib/mode-context";

export default function Profile() {
  const { mode } = useMode();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "João Silva",
    email: "joao.silva@cartfy.com",
    avatar: "https://i.pravatar.cc/150?img=11"
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = useMemo(() => {
    const baseItems = [
      { id: "notifications", title: "Notificações", icon: Bell, color: "text-amber-500", bg: "bg-amber-500/10", href: "/notificacoes", desc: "Avisos e alertas" },
      { id: "security", title: "Segurança", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10", href: "#", desc: "Senha e 2FA" },
      { id: "settings", title: "Configurações", icon: Settings, color: "text-zinc-400", bg: "bg-zinc-800", href: "#", desc: "Preferências do app" },
    ];

    if (mode === 'vendedor') {
      return [
        { id: "finance", title: "Financeiro", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10", href: "/financeiro", desc: "Saldo e saques" },
        { id: "affiliates", title: "Afiliados", icon: Users, color: "text-[#FF5F00]", bg: "bg-[#FF5F00]/10", href: "/afiliados", desc: "Gerenciar parceiros" },
        ...baseItems
      ];
    }

    return [
      { id: "members", title: "Meus Cursos", icon: PlayCircle, color: "text-[#6C2BFF]", bg: "bg-[#6C2BFF]/10", href: "/cursos", desc: "Área de membros" },
      ...baseItems
    ];
  }, [mode]);

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] pb-32 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-64 bg-gradient-to-b from-[#FF5F00]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-4 sm:p-6 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="pt-8 text-center relative">
          <div className="relative inline-block">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#FF5F00] to-[#6C2BFF] p-1 mx-auto mb-4 shadow-[0_10px_40px_rgba(255,95,0,0.3)] relative group animate-gradient"
              style={{ backgroundSize: '200% 200%' }}
            >
              <div className="w-full h-full rounded-full bg-[#111118] border-4 border-[#0B0B0F] flex items-center justify-center overflow-hidden relative shadow-inner">
                <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm" onClick={() => fileInputRef.current?.click()}>
                  <Camera className="text-white" size={24} strokeWidth={1.5} />
                </div>
              </div>
            </motion.div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(true)}
              className="absolute bottom-4 right-0 bg-gradient-to-tr from-[#6C2BFF] to-purple-500 p-2.5 rounded-full border-4 border-[#0B0B0F] shadow-lg hover:shadow-[0_0_20px_rgba(108,43,255,0.5)] transition-shadow animate-gradient"
              style={{ backgroundSize: '200% 200%' }}
            >
              <Edit3 size={16} className="text-white" strokeWidth={1.5} />
            </motion.button>
          </div>
          <h1 className="text-3xl font-bold tracking-[-0.02em] tracking-tight text-white mt-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{profileData.name}</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">{profileData.email}</p>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="mt-4 inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FFD700]/10 to-[#FFD700]/5 border border-[#FFD700]/20 text-[#FFD700] px-4 py-1.5 rounded-full text-xs font-bold tracking-[-0.02em] uppercase tracking-wider shadow-[0_0_15px_rgba(255,215,0,0.15)] backdrop-blur-xl"
          >
            <Crown size={14} strokeWidth={2} />
            Plano PRO
          </motion.div>
        </motion.div>

        {/* Menu List */}
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.id} variants={itemVariants}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex items-center justify-between group hover:border-white/20 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`p-3.5 rounded-2xl ${item.bg} shadow-inner border border-white/10 group-hover:scale-110 transition-transform`}>
                        <Icon size={24} className={item.color} strokeWidth={1.5} />
                      </div>
                      <div>
                        <span className="font-bold text-white text-lg block group-hover:text-[#FF5F00] transition-colors">{item.title}</span>
                        <span className="text-zinc-400 text-xs font-medium">{item.desc}</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#FF5F00]/10 transition-colors relative z-10 border border-white/5 shadow-inner">
                      <ChevronRight size={18} className="text-zinc-500 group-hover:text-[#FF5F00] transition-colors" strokeWidth={1.5} />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Logout Button */}
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-red-500/10 to-red-500/5 text-red-500 font-bold tracking-[-0.02em] text-lg py-5 rounded-3xl border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 mt-8 shadow-[0_10px_30px_rgba(239,68,68,0.1)] backdrop-blur-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
        >
          <LogOut size={22} strokeWidth={1.5} />
          Sair da conta
        </motion.button>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-2xl p-4"
            onClick={() => setIsEditing(false)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold tracking-[-0.02em] text-white">Editar Perfil</h3>
                <button onClick={() => setIsEditing(false)} className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors border border-white/10 shadow-inner">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2">Nome Completo</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#FF5F00] transition-colors" size={18} strokeWidth={1.5} />
                    <input 
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF5F00]/50 focus:shadow-[0_0_20px_rgba(255,95,0,0.15)] transition-all shadow-inner"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#FF5F00] transition-colors" size={18} strokeWidth={1.5} />
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF5F00]/50 focus:shadow-[0_0_20px_rgba(255,95,0,0.15)] transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2">Nova Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#FF5F00] transition-colors" size={18} strokeWidth={1.5} />
                    <input 
                      type="password" 
                      placeholder="Deixe em branco para manter"
                      className="w-full bg-black/50 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF5F00]/50 focus:shadow-[0_0_20px_rgba(255,95,0,0.15)] transition-all shadow-inner"
                    />
                  </div>
                </div>
                
                <button onClick={() => setIsEditing(false)} className="w-full py-4 bg-gradient-to-r from-[#FF5F00] to-[#FF8C00] hover:shadow-[0_4px_20px_rgba(255,95,0,0.4)] text-white rounded-2xl font-bold tracking-[-0.02em] transition-all mt-4 animate-gradient" style={{ backgroundSize: '200% 200%' }}>
                  Salvar Alterações
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
