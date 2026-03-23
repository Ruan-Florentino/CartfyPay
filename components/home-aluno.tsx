"use client";

import { motion } from "motion/react";
import { Play, ChevronRight, CheckCircle2, Clock, BookOpen, Star, Trophy, Flame, User, Heart, Crown, Award, TrendingUp, Search, Bell, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HomeAluno() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const categorias = ["Todos", "Marketing", "Vendas", "Dropshipping", "Copywriting", "Tráfego Pago"];

  const continuarAssistindo = [
    {
      id: 1,
      title: "Módulo 3: Tráfego Pago",
      course: "Curso Mestre em Vendas",
      progress: 45,
      image: "https://picsum.photos/seed/curso1/800/450",
      timeLeft: "12 min restantes",
      rating: 4.8
    },
    {
      id: 2,
      title: "Aula 5: Gatilhos de Escassez",
      course: "Copywriting Avançado",
      progress: 78,
      image: "https://picsum.photos/seed/curso4/800/450",
      timeLeft: "5 min restantes",
      rating: 5.0
    }
  ];

  const meusCursos = [
    {
      id: 1,
      title: "Curso Mestre em Vendas",
      instructor: "João Silva",
      progress: 45,
      image: "https://picsum.photos/seed/curso1/400/600",
      modules: 12,
      completed: 5,
      badge: "Em andamento"
    },
    {
      id: 2,
      title: "Gatilhos Mentais Avançados",
      instructor: "Ana Costa",
      progress: 100,
      image: "https://picsum.photos/seed/curso3/400/600",
      modules: 5,
      completed: 5,
      badge: "Concluído"
    },
    {
      id: 3,
      title: "Copywriting Avançado",
      instructor: "Pedro Santos",
      progress: 15,
      image: "https://picsum.photos/seed/curso4/400/600",
      modules: 8,
      completed: 1,
      badge: "Em andamento"
    }
  ];

  const recomendados = [
    {
      id: 4,
      title: "Dropshipping do Zero",
      instructor: "Marcos Paulo",
      image: "https://picsum.photos/seed/curso5/400/600",
      badge: "Novo",
      rating: 4.9
    },
    {
      id: 5,
      title: "Facebook Ads Expert",
      instructor: "Ana Costa",
      image: "https://picsum.photos/seed/curso6/400/600",
      badge: "Premium",
      rating: 4.7
    },
    {
      id: 6,
      title: "Vendas no WhatsApp",
      instructor: "João Silva",
      image: "https://picsum.photos/seed/curso7/400/600",
      badge: "Popular",
      rating: 4.8
    }
  ];

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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="pb-32 relative min-h-screen"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-64 bg-gradient-to-b from-[#6C2BFF]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-xl z-40 border-b border-white/5 shadow-sm p-6 pt-12">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Olá, Aluno! <span className="inline-block animate-bounce">🎓</span></h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">Pronto para aprender hoje?</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/notificacoes" className="w-10 h-10 bg-[#111118] rounded-full border border-white/10 shadow-lg flex items-center justify-center hover:bg-white/5 transition-colors relative">
            <Bell size={18} className="text-zinc-300" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF6A00] rounded-full shadow-[0_0_8px_#FF6A00] animate-pulse"></span>
          </Link>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6C2BFF] to-[#FF6A00] p-0.5 shadow-[0_0_15px_rgba(108,43,255,0.3)] cursor-pointer"
          >
            <div className="w-full h-full rounded-full bg-[#111118] border-2 border-[#0B0B0F] overflow-hidden relative">
              <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="p-6 space-y-8">
        {/* General Progress / Gamification */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#111118] to-[#0B0B0F] p-5 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#6C2BFF]/20 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#FF6A00]/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFD700]/20 to-[#FF8C00]/20 flex items-center justify-center border border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                  <Crown size={24} className="text-[#FFD700]" />
                </div>
                <div>
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Nível 5 • Mestre</p>
                  <h3 className="text-white font-black text-xl">1.250 XP</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Progresso Geral</p>
                <p className="text-[#6C2BFF] font-black text-xl">45%</p>
              </div>
            </div>
            
            <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-white/5 mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "45%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#6C2BFF] to-[#FF6A00] shadow-[0_0_10px_rgba(108,43,255,0.5)] relative"
              >
                <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 blur-[2px]"></div>
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
              <div className="text-center">
                <p className="text-white font-black text-lg">4</p>
                <p className="text-zinc-500 text-[10px] font-bold uppercase">Cursos Ativos</p>
              </div>
              <div className="text-center border-x border-white/5">
                <p className="text-white font-black text-lg">18h</p>
                <p className="text-zinc-500 text-[10px] font-bold uppercase">Assistidas</p>
              </div>
              <div className="text-center flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 text-[#FF6A00] font-black text-lg">
                  <Flame size={16} fill="currentColor" /> 5
                </div>
                <p className="text-zinc-500 text-[10px] font-bold uppercase">Dias Seguidos</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories Scroll */}
        <motion.div variants={itemVariants} className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6 snap-x">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                activeCategory === cat 
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                  : 'bg-[#111118] text-zinc-400 border-white/10 hover:bg-white/5 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Continuar Assistindo (Netflix Style) */}
        <motion.div variants={itemVariants}>
          <h3 className="font-black text-xl mb-4 text-white flex items-center gap-2">
            <Play size={20} className="text-[#6C2BFF]" fill="currentColor" />
            Continuar Assistindo
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar snap-x">
            {continuarAssistindo.map((item) => (
              <Link href={`/cursos/${item.id}`} key={item.id} className="min-w-[300px] sm:min-w-[340px] snap-start block group">
                <motion.div 
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#111118] rounded-[2rem] border border-white/5 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative transition-all"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-black/20 to-transparent"></div>
                    
                    {/* Hover Play Preview */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                      <div className="w-16 h-16 bg-gradient-to-tr from-[#6C2BFF] to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(108,43,255,0.6)] pl-1 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play size={28} className="text-white" fill="currentColor" />
                      </div>
                    </div>
                    
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black text-white border border-white/10 uppercase tracking-wider">
                      {item.course}
                    </div>
                    
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
                      <Clock size={12} className="text-[#FF6A00]" /> {item.timeLeft}
                    </div>
                  </div>

                  <div className="p-5 relative z-10 bg-[#111118]">
                    <h4 className="font-black text-white text-lg leading-tight mb-3 truncate">{item.title}</h4>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-zinc-500 text-xs font-bold flex items-center gap-1">
                        <Star size={12} className="text-[#FFD700]" fill="currentColor" /> {item.rating}
                      </span>
                      <span className="text-[#6C2BFF] text-xs font-bold">{item.progress}%</span>
                    </div>
                    
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-[#6C2BFF] to-[#FF6A00]"
                      />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Meus Cursos (Netflix Style Vertical Posters) */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-xl text-white flex items-center gap-2">
              <BookOpen size={20} className="text-[#FF6A00]" />
              Meus Cursos
            </h3>
            <Link href="/cursos" className="text-[#FF6A00] text-sm font-bold hover:text-[#FF8C00] transition-colors">
              Ver todos
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar snap-x">
            {meusCursos.map((curso) => (
              <Link href={`/cursos/${curso.id}`} key={curso.id} className="min-w-[160px] w-[160px] snap-start block group">
                <motion.div 
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-2xl overflow-hidden shadow-lg border border-white/5 aspect-[2/3]"
                >
                  <img src={curso.image} alt={curso.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/40 to-transparent"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-2 left-2">
                    {curso.badge === 'Concluído' ? (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[9px] font-black uppercase backdrop-blur-md flex items-center gap-1">
                        <CheckCircle2 size={10} /> {curso.badge}
                      </span>
                    ) : (
                      <span className="bg-[#6C2BFF]/20 text-[#6C2BFF] border border-[#6C2BFF]/30 px-2 py-0.5 rounded-md text-[9px] font-black uppercase backdrop-blur-md">
                        {curso.badge}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h4 className="font-black text-sm text-white mb-1 line-clamp-2 leading-tight group-hover:text-[#FF6A00] transition-colors">{curso.title}</h4>
                    <p className="text-zinc-400 text-[10px] font-medium mb-2 truncate">{curso.instructor}</p>
                    
                    <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${curso.progress}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full rounded-full ${curso.progress === 100 ? 'bg-emerald-500' : 'bg-[#FF6A00]'}`}
                      />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recomendados para Você */}
        <motion.div variants={itemVariants}>
          <h3 className="font-black text-xl mb-4 text-white flex items-center gap-2">
            <Sparkles size={20} className="text-pink-500" />
            Recomendados para Você
          </h3>
          
          <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar snap-x">
            {recomendados.map((curso) => (
              <Link href={`/produtos/${curso.id}`} key={curso.id} className="min-w-[160px] w-[160px] snap-start block group">
                <motion.div 
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-2xl overflow-hidden shadow-lg border border-white/5 aspect-[2/3]"
                >
                  <img src={curso.image} alt={curso.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/40 to-transparent"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase backdrop-blur-md border ${
                      curso.badge === 'Novo' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      curso.badge === 'Premium' ? 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30' :
                      'bg-pink-500/20 text-pink-400 border-pink-500/30'
                    }`}>
                      {curso.badge}
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:text-pink-500 hover:bg-white/10 transition-colors">
                    <Heart size={14} />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h4 className="font-black text-sm text-white mb-1 line-clamp-2 leading-tight group-hover:text-pink-500 transition-colors">{curso.title}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-zinc-400 text-[10px] font-medium truncate">{curso.instructor}</p>
                      <span className="text-zinc-300 text-[10px] font-bold flex items-center gap-0.5">
                        <Star size={10} className="text-[#FFD700]" fill="currentColor" /> {curso.rating}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
